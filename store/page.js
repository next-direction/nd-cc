export const state = () => ({
  details: null,
  answersEditSaved: [],
});

export const getters = {
  editAnswerActive: state => state.answersEditSaved.length > 0,
  getVotes: state => state.details.votes.reduce((acc, current) => acc + current.vote, 0),
  hasAcceptedAnswer: state => state.details.children.some(child => child.accepted),
  hasVote: state => user => {
    const vote = state.details.votes.find(vote => +vote.created_by === +user.id);

    return vote ? vote.vote : 0;
  },
  getVote: state => user => {
    return state.details.votes.find(vote => +vote.created_by === +user.id);
  },
};

export const mutations = {
  addChild (state, child) {
    state.details.children.push(child);
  },
  addVote (state, vote) {
    state.details.votes.push(vote);
  },
  deleteVote (state, vote) {
    state.details.votes = state.details.votes.filter(existingVote => +existingVote.id !== +vote.id);
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
  setDetails (state, details) {
    state.details = details;
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
  updateVote (state, editedVote) {
    state.details.votes = state.details.votes.map(vote => {
      return vote.id === editedVote.id ? editedVote : vote;
    });
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

  async addVote ({ commit, getters, rootState, state }, { vm: app, vote }) {
    if (0 === getters.hasVote(rootState.user)) { // first time voter
      try {
        const data = {
          vote,
          page: state.details.id,
        };

        const res = await fetch(rootState.baseUrl + '/items/vote', {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + app.$cookies.get('token'),
          },
        });
        const { data: newVote } = await res.json();

        if (newVote && newVote.id) {
          commit('addVote', newVote);
        } else {
          alert('Error during save!');
        }
      } catch (e) {
        alert(e.message);
      }
    } else { // edit existing vote
      const existingVote = getters.getVote(rootState.user);

      if (+vote === +existingVote.vote) { // remove vote
        try {
          await fetch(rootState.baseUrl + '/items/vote/' + existingVote.id, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + app.$cookies.get('token'),
            },
          });

          commit('deleteVote', existingVote);
        } catch (e) {
          alert(e.message);
        }
      } else { // change vote
        const data = {
          vote,
        };

        try {
          const res = await fetch(rootState.baseUrl + '/items/vote/' + existingVote.id + '?fields=*', {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + app.$cookies.get('token'),
            },
          });
          const { data: editedVote } = await res.json();

          commit('updateVote', editedVote);
        } catch (e) {
          alert(e.message);
        }
      }
    }
  },
};
