export const state = () => ({
  details: null,
  answersEditSaved: [],
});

export const getters = {
  editAnswerActive: state => state.answersEditSaved.length > 0,
  getVotes: state => (parentPage = 0) => {
    let votes = 0;

    if (0 === parentPage) { // votes for question
      votes = state.details.votes ? state.details.votes.reduce((acc, current) => acc + current.vote, 0) : 0;
    } else { // votes for answer
      const child = state.details.children.find(child => +child.id === +parentPage);

      votes = child.votes ? child.votes.reduce((acc, current) => acc + current.vote, 0) : 0;
    }

    return votes;
  },
  hasAcceptedAnswer: state => state.details.children.some(child => child.accepted),
  hasVote: state => (user, parentPage = 0) => {
    let vote;
    if (0 === parentPage) { // vote of question
      vote = state.details.votes.find(vote => +vote.created_by === +user.id);
    } else { // get vote for answer
      const child = state.details.children.find(child => +child.id === +parentPage);

      if (child) {
        vote = child.votes.find(vote => +vote.created_by === +user.id);
      }
    }

    return vote ? vote.vote : 0;
  },
  getVote: state => (user, parentPage = 0) => {
    if (0 === parentPage) {
      return state.details.votes.find(vote => +vote.created_by === +user.id);
    } else {
      const child = state.details.children.find(child => +child.id === +parentPage);

      return child.votes.find(vote => +vote.created_by === +user.id);
    }
  },
};

export const mutations = {
  addChild (state, child) {
    state.details.children.push(child);
  },
  addVote (state, vote) {
    if (+state.details.id === +vote.page) {
      state.details.votes.push(vote);
    } else { // add to answer
      state.details.children = state.details.children.map(child => {
        if (+child.id === +vote.page) {
          child.votes.push(vote);
        }

        return child;
      });
    }
  },
  deleteVote (state, vote) {
    if (+state.details.id === +vote.page) {
      state.details.votes = state.details.votes.filter(existingVote => +existingVote.id !== +vote.id);
    } else { // remove from answer
      state.details.children = state.details.children.map(child => {
        if (+child.id === +vote.page) {
          child.votes = child.votes.filter(existing => existing.id !== vote.id);
        }

        return child;
      });
    }
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
    state.details.tags = page.tags;
  },
  updateVote (state, editedVote) {
    if (+state.details.id === +editedVote.page) {
      state.details.votes = state.details.votes.map(vote => {
        return vote.id === editedVote.id ? editedVote : vote;
      });
    } else { // update vote for answer
      state.details.children = state.details.children.map(child => {
        if (+child.id === +editedVote.page) {
          child.votes = child.votes.map(existing => existing.id === editedVote.id ? editedVote : existing);
        }

        return child;
      });
    }
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
          await app.$alert('The following error occurred: ' + e.message, null, 'error');
        }

      }

      return child;
    });

    Promise.all(promises).then(children => {
      commit('setChildren', children);
      this.acceptRequestRunning = false;
    }).catch(e => app.$alert('The following error occurred: ' + e.message, null, 'error'));
  },

  async addVote ({ commit, getters, rootState, state }, { vm: app, vote, page, isQuestion }) {
    if (0 === getters.hasVote(rootState.user, isQuestion ? 0 : page)) { // first time voter
      try {
        const data = {
          vote,
          page,
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
          await app.$alert('Error during save!', null, 'error');
        }
      } catch (e) {
        await app.$alert('The following error occurred: ' + e.message, null, 'error');
      }
    } else { // edit existing vote
      const existingVote = getters.getVote(rootState.user, isQuestion ? 0 : page);

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
          await app.$alert('The follwing error occurred: ' + e.message, null, 'error');
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
          await app.$alert('The follwing error occurred: ' + e.message, null, 'error');
        }
      }
    }
  },
};
