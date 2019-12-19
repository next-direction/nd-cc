import jwtDecode from 'jwt-decode';

export const state = () => ({
  backdrop: false,
  signUp: false,
  signIn: false,
  baseUrl: '',
  user: null,
});

export const mutations = {
  showBackdrop (state, show) {
    state.backdrop = show;
  },
  showSignUp(state, show) {
    state.signUp = show;
  },
  showSignIn(state, show) {
    state.signIn = show;
  },
  setBaseUrl(state, url) {
    state.baseUrl = url;
  },
  setUser(state, user) {
    state.user = user;
  }
};

export const actions = {
  async nuxtServerInit({commit}, {app, env}) {
    commit('setBaseUrl', env.baseUrl);

    const token = app.$cookies.get('token');

    if (isTokenValid(token)) {
      const tokenData = jwtDecode(token);

      const res = await fetch(env.baseUrl + '/users/' + tokenData.id, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      });
      const {data} = await res.json();

      if (data) {
        commit('setUser', data);
      }
    } else {
      app.$cookies.remove('token');
    }
  }
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
