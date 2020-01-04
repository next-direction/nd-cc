<template>
  <div class="pages">
    <template v-if="pages.length">
      <div class="page" :class="{draft: page.status === 'draft', announcement: page.status === 'announcement'}" v-for="page in pages">
        <div class="page__info">
          <p class="page__title">
            <nuxt-link :to="'/page/detail/' + page.id">{{ page.title }}</nuxt-link>
          </p>
          <p class="page__excerpt">
            <Excerpt :blocks="page.content.blocks"/>
          </p>
          <div class="page__tags" v-if="tags(page.tags).length">
            <Tags :tags="page.tags"/>
          </div>
          <p class="page__meta">
            <strong>{{ page.created_by.last_name }}</strong> at <strong>{{ page.created_on | formatDate }}</strong> in <strong>{{
            getCategoryTree(page.category.id)}}</strong>
          </p>
        </div>
        <div class="page__votes">
          <span class="page__votes-count">{{ sumVotes(page) }}</span>
          <span class="page__votes-label">
            votes
          </span>
        </div>
        <div class="page__answers" :title="hasAcceptedAnswer(page) ? 'Answer accepted' : ''"
             :class="{ hasAnswers: page.children.length, hasAcceptedAnswer: hasAcceptedAnswer(page) }">
          <span class="page__answers-count">{{ page.children.length }}</span>
          <span class="page__answers-label">
            answers
          </span>
        </div>
      </div>
    </template>
    <div class="no-page" v-else>
      There are no topics!
    </div>
  </div>
</template>

<script>
    import Excerpt from '~/components/content/Excerpt.vue';
    import Tags from '~/components/content/Tags.vue';

    export default {
        components: {
            Excerpt,
            Tags,
        },
        methods: {
            getCategoryTree (categoryId) {
                return this.$store.getters.getTextBreadcrumb(categoryId);
            },
            hasAcceptedAnswer (page) {
                return page.children && page.children.some(child => child.accepted);
            },
            sumVotes (page) {
                return page.votes.reduce((acc, current) => acc + current.vote, 0);
            },
            tags (tags) {
                return tags.filter(tag => '' !== tag);
            },
        },
        props: {
            pages: {
                type: Array,
                default: () => [],
            },
        },
    };
</script>

<style lang="scss" scoped>
  .no-page {
    margin: 1rem 0;
  }

  .page {
    border: 1px solid $info-light;
    border-left: 0.6rem solid $info-dark;
    margin-bottom: 1rem;
    border-radius: $border-radius;
    display: flex;

    .page__info {
      flex: 1;
    }

    .page__tags {
      padding: 0.4rem;
    }

    .page__title {
      padding: 0.4rem;
      font-weight: bold;

      a {
        text-decoration: none;

        &:hover {
          color: lighten($main-color, 10%);
        }
      }
    }

    .page__meta {
      padding: 0.4rem;
      color: grey;
      font-size: 0.8rem;
    }

    .page__votes {
      align-self: flex-start;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      padding: 0.8rem;
      border-radius: $border-radius;
      border: 1px solid $gray-dark;
      margin: 0.6rem;
      margin-right: 0.3rem;

      &-count {
        font-size: 1.4rem;
      }
    }

    .page__answers {
      align-self: flex-start;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      padding: 0.8rem 0.4rem;
      border-radius: $border-radius;
      border: 1px solid $gray-dark;
      margin: 0.6rem;
      margin-left: 0.3rem;

      &.hasAnswers {
        color: $success-dark;
        border-color: $success-dark;
      }

      &.hasAcceptedAnswer {
        background: $success-light;
        color: $success-dark;

      }

      &-count {
        font-size: 1.4rem;
      }
    }

    &.draft {
      border-color: $warning-light;
      border-left-color: $warning-dark;
    }

    &.announcement {
      border-color: $danger-light;
      border-left-color: $danger-dark;
    }
  }
</style>
