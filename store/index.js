import jwtDecode from 'jwt-decode';

export const state = () => ({
  backdrop: false,
  signUp: false,
  signIn: false,
  userStateChange: false,
  baseUrl: '',
  user: null,
  avatar: '',
  forwardTarget: '',
  categories: {
    all: [],
    parents: [],
  },
});

export const getters = {
  category: state => id => {
    return state.categories.all.find(category => +category.id === +id);
  },
  childCategories: (state, getters) => id => {
    let children = Object.keys(state.categories.parents).filter(key => +state.categories.parents[key] === +id);

    children.forEach(child => {
      children = [
        ...children,
        ...getters.childCategories(child),
      ];
    });

    return children;
  },
  getCategoryTree: state => categoryId => {
    let category = state.categories.all.find(category => category.id === categoryId);

    const categories = [{
      id: category.id,
      name: category.name,
    }];
    while (category && category.parent_category) {
      const parent = category.parent_category;

      category = state.categories.all.find(category => category.id === parent);

      if (category) {
        categories.unshift({
          id: category.id,
          name: category.name,
        });
      }
    }

    return categories;
  },
  getTextBreadcrumb: (state, getters) => (categoryId) => {
    const categories = getters.getCategoryTree(categoryId);
    let breadcrumb = '';

    categories.forEach(category => {
      if (breadcrumb) {
        breadcrumb += ' » ';
      }
      breadcrumb += category.name;
    });

    return breadcrumb;
  },
  getCategoryOptions: (state, getters) => (parentId = 0, level = 0) => {
    const options = [];

    state.categories.all.filter(category => category.parent_category === parentId).forEach(category => {
      options.push({
        value: category.id,
        text: category.name,
        level,
        allowed: category.pages_allowed,
        children: getters.getCategoryOptions(category.id, level + 1),
      });
    });

    return options;
  },
};

export const mutations = {
  showBackdrop (state, show) {
    state.backdrop = show;
  },
  showSignUp (state, show) {
    state.signUp = show;
  },
  showSignIn (state, show) {
    state.signIn = show;
  },
  setBaseUrl (state, url) {
    state.baseUrl = url;
  },
  setUser (state, user) {
    state.user = user;
  },
  setAvatar (state, url) {
    state.avatar = url;
  },
  setCategories (state, categories) {
    state.categories.all = categories;

    const parentRelations = [];

    categories.forEach(category => {
      parentRelations[category.id] = category.parent_category;
    });

    state.categories.parents = parentRelations;
  },
  toggleUserStateChange (state) {
    state.userStateChange = !state.userStateChange;
  },
  setForwardTarget (state, target) {
    state.forwardTarget = target;
  },
};

export const actions = {
  async nuxtServerInit ({ commit, dispatch }, { app, env }) {
    commit('setBaseUrl', env.baseUrl);

    // fetch categories
    const categoryResponse = await fetch(env.baseUrl + '/items/category?sort=-order', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const { data: categoryData } = await categoryResponse.json();

    if (categoryData) {
      commit('setCategories', categoryData);
    }

    const token = app.$cookies.get('token');

    // load user data
    if (isTokenValid(token)) {
      const tokenData = jwtDecode(token);

      const res = await fetch(env.baseUrl + '/users/' + tokenData.id, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
      });
      const { data } = await res.json();

      if (data) {
        commit('setUser', data);

        if (data.avatar) {
          await dispatch('fetchAvatar', { ...data, token });
        }
      }
    } else {
      app.$cookies.remove('token');
    }
  },
  async fetchAvatar ({ commit, state }, user) {
    return new Promise(async (resolve, reject) => {
      try {
        const fileRes = await fetch(state.baseUrl + '/files/' + user.avatar, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + user.token,
          },
        });

        var { data: response } = await fileRes.json();
      } catch (e) {
        reject(e.message);
      }

      let avatar = '';

      if (response && response.data && response.data.thumbnails[0]) {
        avatar = response.data.thumbnails[0].url;
      } else if (response && response.data) {
        avatar = response.data.full_url;
      }

      commit('setAvatar', avatar);
      resolve(avatar);
    });
  },
  userStateChanged ({ commit }) {
    commit('toggleUserStateChange');
  },
};

/**
 * Check if token is not expired
 *
 * @param {string} token - JWT token
 *
 * @returns {boolean}
 */
function isTokenValid (token) {

  if (!token) {
    return false;
  }

  const now = parseInt(Date.now() / 1000);
  const data = jwtDecode(token);

  if (now > data.exp) {
    return false;
  }

  return true;
}
