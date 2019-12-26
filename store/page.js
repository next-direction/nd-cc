export const state = () => ({
  details: null,
  answersEditSaved: [],
});

export const getters = {
  editAnswerActive: state => state.answersEditSaved.length > 0,
  hasAcceptedAnswer: state => state.details.children.some(child => child.accepted),
};

export const mutations = {
  addChild (state, child) {
    state.details.children.push(child);
  },
  setDetails (state, details) {
    state.details = details;
  },
  clearAnswerEditSaved (state, id) {
    if (id) {
      state.answersEditSaved = state.answersEditSaved.filter(answerId => answerId !== id);
    } else {
      state.answersEditSaved = [];
    }
  },
  setAnswerEditSaved (state, id) {
    if (!state.answersEditSaved.includes(id)) {
      state.answersEditSaved.push(id);
    }
  },
  setChildren (state, children) {
    state.details.children = children;
  },
  updateChild (state, newChild) {
    state.details.children = state.details.children.map(child => {
      return child.id === newChild.id ? newChild : child;
    });
  },
  updatePage (state, page) {
    state.details.title = page.title;
    state.details.content = page.content;
    state.details.modified_by = page.modified_by;
    state.details.modified_on = page.modified_on;
  },
};

export const actions = {
  async toggleAcceptAnswer ({ commit, rootState, state }, { vm: app, answer }) {
    if (this.acceptRequestRunning) {
      return;
    }

    this.acceptRequestRunning = true;

    const promises = state.details.children.map(async child => {
      if (child.id === answer.id) {
        const data = {
          accepted: !child.accepted,
        };

        try {
          await fetch(`${rootState.baseUrl}/items/page/${child.id}?fields=id`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + app.$cookies.get('token'),
            },
          });

          const newChild = { ...child };

          newChild.accepted = !child.accepted;

          return newChild;
        } catch (e) {
          alert(e.message);
        }

      }

      return child;
    });

    Promise.all(promises).then(children => {
      commit('setChildren', children);
      this.acceptRequestRunning = false;
    }).catch(e => alert(e.message));
  },
};
