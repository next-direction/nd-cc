<template>
  <section class="details">
    <div class="header">
      <h1>
        {{ details.title }}
      </h1>
      <button @click="$emit('edit')" class="info" v-if="editable">Edit</button>
    </div>
    <p class="meta">
      Created by <strong>{{ details.created_by.last_name }}</strong> at <strong>{{ details.created_on | formatDate }}</strong> in <strong>{{ getCategoryTree(details.category.id)
      }}</strong>
      <span v-if="details.created_on !== details.modified_on">
        Modified by <strong>{{ details.modified_by.last_name }}</strong> at <strong>{{ details.modified_on | formatDate }}</strong>
      </span>
    </p>
    <div class="question__content">
      <div class="question__content-actions">
        <span class="action-vote-up" :class="{ currentVote: currentVote === 1 }" title="Vote up" @click="vote(1)">
          <fa :icon="fa.faChevronUp"></fa>
        </span>
        <span class="action-vote-num">{{ votes }}</span>
        <span class="action-vote-down" :class="{ currentVote: currentVote === -1 }" title="Vote down" @click="vote(-1)">
          <fa :icon="fa.faChevronDown"></fa>
        </span>
      </div>
      <div class="question__content-blocks">
        <Blocks :blocks="details.content.blocks"/>
      </div>
    </div>
  </section>
</template>

<script>
    import Blocks from '~/components/content/Blocks.vue';
    import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

    export default {
        components: {
            Blocks,
        },
        computed: {
            currentVote () {
                return this.$store.state.user ? this.$store.getters['page/hasVote'](this.$store.state.user) : 0;
            },
            details () {
                return this.$store.state.page.details;
            },
            editable () {
                return this.$store.state.user && +this.details.created_by.id === +this.$store.state.user.id;
            },
            fa () {
                return {
                    faChevronUp,
                    faChevronDown,
                };
            },
            user () {
                return this.$store.state.user;
            },
            votes () {
                return this.$store.getters['page/getVotes'];
            },
        },
        methods: {
            getCategoryTree (categoryId) {
                return this.$store.getters.getTextBreadcrumb(categoryId);
            },
            vote (vote) {
                if (this.user) {
                    this.$store.dispatch('page/addVote', { vm: this, vote });
                } else {
                    alert('Please login to vote!');
                }
            },
        },
    };
</script>

<style lang="scss" scoped>
  .details {
    flex: 1;

    .question__content {
      display: flex;

      &-actions {
        flex: 0 0 3rem;

        display: flex;
        flex-direction: column;
        align-items: center;

        .action-vote-up,
        .action-vote-down {
          color: $gray-light;
          font-size: 1.6rem;
          cursor: pointer;

          &.currentVote {
            color: $success-dark;
          }
        }

        .action-vote-num {
          font-size: 1.2rem;
        }
      }

      &-blocks {
        flex: 1;
      }
    }

    .header {
      display: flex;
      justify-content: space-between;
    }

    .meta {
      margin: 1rem 0;
      color: grey;
      font-size: 0.8rem;
      text-align: right;

      span {
        display: block;
        margin-top: 0.2rem;
      }
    }
  }
</style>
