import jwtDecode from 'jwt-decode';

export const state = () => ({
  backdrop: false,
  signUp: false,
  signIn: false,
  baseUrl: '',
  user: null,
  avatar: '',
});

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
};

export const actions = {
  async nuxtServerInit ({ commit, dispatch }, { app, env }) {
    commit('setBaseUrl', env.baseUrl);

    const token = app.$cookies.get('token');

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
          return dispatch('fetchAvatar', { ...data, token });
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
