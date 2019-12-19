import Vue from 'vue';

import jwtDecode from 'jwt-decode';

let redirectFunction;
let appObject;
let storeObject;
let baseUrl = '';

export default function ({ app, env, store, redirect }) {
  baseUrl = env.baseUrl;
  redirectFunction = redirect;
  appObject = app;
  storeObject = store;

  if (!window.refreshTimeout) {
    const token = app.$cookies.get('token');

    if (token) {
      registerHandler();
    }
  }
}

/**
 * Registers a handler to refresh given token
 *
 * @param {string} token - JWT token
 */
function registerHandler () {
  const token = appObject.$cookies.get('token');
  const now = parseInt(Date.now() / 1000);
  const data = jwtDecode(token);

  if (window.refreshTimeout) {
    clearTimeout(window.refreshTimeout);
  }

  // refresh token 10 seconds before it expires, to stay logged in as long as tab is open
  window.refreshTimeout = setTimeout(() => {
    refresh();
  }, (data.exp - now - 10) * 1000);
}

/**
 * Refresh given token
 *
 * @param {string} token - JWT token
 *
 * @returns {Promise<void>}
 */
async function refresh () {
  const token = appObject.$cookies.get('token');

  if (!token) {
    return;
  }

  const res = await fetch(baseUrl + '/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ token }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const { data } = await res.json();

  if (data && data.token) {
    appObject.$cookies.set('token', data.token, {
      sameSite: 'strict',
      secure: 'https:' === window.location.protocol,
    });

    const now = parseInt(Date.now() / 1000);
    const tokenData = jwtDecode(data.token);

    window.logoutTimeout = setTimeout(() => {
      refresh(data.token);
    }, (tokenData.exp - now - 10) * 1000);

    return;
  }

  appObject.$cookies.remove('token');
  storeObject.commit('setUser', null);

}

// allow registering handler after successful login
Vue.prototype.$registerRefreshHandler = registerHandler;
