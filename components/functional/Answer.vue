<template>
  <div>
    <div class="answers__answer-container" :class="{ acceptedAnswer: details.accepted }" v-if="!editMode">
      <div class="answers__options">
        <span class="action-vote-up" :class="{ currentVote: currentVote === 1 }" title="Vote up" @click="vote(1)">
          <fa :icon="fa.faChevronUp"></fa>
        </span>
        <span class="action-vote-num">{{ votes }}</span>
        <span class="action-vote-down" :class="{ currentVote: currentVote === -1 }" title="Vote down" @click="vote(-1)">
          <fa :icon="fa.faChevronDown"></fa>
        </span>
        <fa :icon="fa.faCheck" v-if="details.accepted" class="acceptedIcon" title="Remove acceptance" @click="toggleAccept(details)"></fa>
        <fa :icon="fa.faCheck" v-if="canAccept" class="acceptIcon" title="Accept this answer" @click="toggleAccept(details)"></fa>
      </div>
      <div class="answers__answer">
        <Blocks :blocks="details.content.blocks"/>
        <div class="answer__footer">
          <p class="answer__footer-actions" v-if="editable">
            <button type="button" class="gray small" @click="editMode = true">Edit</button>
          </p>
          <p class="answer__footer-meta">
            Answered by <strong>{{ details.created_by.last_name }}</strong> at <strong>{{ details.created_on | formatDate }}</strong>
            <span class="meta--modified" v-if="details.created_on !== details.modified_on">
              Modified by <strong>{{ details.modified_by.last_name }}</strong> at <strong>{{ details.modified_on | formatDate }}</strong>
            </span>
          </p>
        </div>
      </div>
    </div>

    <div class="answers__answer-edit" v-if="editMode">
      <PageForm
        :onlyEditor="true"
        :showCancel="true"
        @cancelForm="cancelEditMode"
        @pageSaved="updatePage"
        @updateSaved="updateEditSaved"
        :category="'' + details.category.id"
        :defaultTitle="details.title"
        :defaultData="details.content"
        :pageId="+details.id"
      />
    </div>
  </div>
</template>

<script>
    import Blocks from '~/components/content/Blocks.vue';
    import PageForm from '~/components/functional/PageForm.vue';
    import { faCheck, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

    export default {
        components: {
            Blocks,
            PageForm,
        },
        computed: {
            accepted () {
                return this.$store.getters['page/hasAcceptedAnswer'];
            },
            canAccept () {
                return !this.details.accepted && !this.accepted && this.user && +this.parent.created_by.id === +this.user.id;
            },
            currentVote () {
                return this.$store.state.user ? this.$store.getters['page/hasVote'](this.$store.state.user, this.details.id) : 0;
            },
            editable () {
                return this.$store.state.user && +this.$store.state.user.id === +this.details.created_by.id;
            },
            fa () {
                return {
                    faCheck,
                    faChevronUp,
                    faChevronDown,
                };
            },
            parent () {
                return this.$store.state.page.details;
            },
            user () {
                return this.$store.state.user;
            },
            votes () {
                return this.$store.getters['page/getVotes'](this.details.id);
            },
        },
        data () {
            return {
                editMode: false,
            };
        },
        methods: {
            cancelEditMode () {
                this.editMode = false;
                this.$store.commit('page/clearAnswerEditSaved', this.details.id);
            },
            toggleAccept (answer) {

                if (this.user) {

                    if (+this.user.id === +this.parent.created_by.id) {
                        this.$store.dispatch('page/toggleAcceptAnswer', { vm: this, answer });
                    } else {
                        this.$alert('Only creator of the question can accept an answer!', null, 'warning');
                    }
                }
            },
            updateEditSaved (saved) {
                if (saved) {
                    this.$store.commit('page/clearAnswerEditSaved', this.details.id);
                } else {
                    this.$store.commit('page/setAnswerEditSaved', this.details.id);
                }
            },
            updatePage (page) {
                this.$store.commit('page/updateChild', page);
                this.editMode = false;
            },
            vote (vote) {
                if (this.user) {

                    if (+this.user.id !== +this.details.created_by.id) {
                        this.$store.dispatch('page/addVote', { vm: this, vote, page: this.details.id, isQuestion: false });
                    } else {
                        this.$alert('You cannot vote for your own answer!', null, 'warning');
                    }
                } else {
                    this.$alert('Please login to vote!', null, 'warning');
                }
            },
        },
        props: ['details'],
    };
</script>

<style lang="scss" scoped>
  .answers__answer-container {
    display: flex;
    padding: 0.6rem 0.6rem 0.6rem 0;

    &.acceptedAnswer {
      background: $success-light;

      .answer__footer-meta {
        color: $success-dark;
      }
    }

    .answers__options {
      flex: 0 0 3rem;
      padding: 0 0.6rem;

      display: flex;
      flex-direction: column;
      align-items: center;

      .action-vote-down {
        display: block;
        margin-bottom: 0.4rem;
      }

      .action-vote-up,
      .action-vote-down {
        color: $gray-dark;
        font-size: 1.2rem;
        cursor: pointer;

        &.currentVote {
          color: $success-dark;
        }
      }

      .action-vote-num {
        font-size: 1.2rem;
      }

      .acceptedIcon {
        color: $success-dark;
        font-size: 1.6rem;
        cursor: pointer;
      }

      .acceptIcon {
        color: $gray-dark;
        font-size: 1.6rem;
        cursor: pointer;
      }
    }
  }

  .answers__answer {
    flex: 1;

    .answer__footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 0.8rem;

      &-meta {
        flex: 1;
        color: grey;
        font-size: 0.8rem;
        text-align: right;

        .meta--modified {
          display: block;
        }
      }
    }
  }
</style>
