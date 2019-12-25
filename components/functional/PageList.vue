<template>
  <div class="pages">
    <template v-if="pages.length">
      <div class="page" :class="{draft: page.status === 'draft', announcement: page.status === 'announcement'}" v-for="page in pages">
        <div class="page__info">
          <p class="page__title">
            <nuxt-link :to="'/page/detail/' + page.id">{{ page.title }}</nuxt-link>
          </p>
          <p class="page__meta">
            Created by <strong>{{ page.created_by.last_name }}</strong> at <strong>{{ page.created_on | formatDate }}</strong> in <strong>{{
            getCategoryTree(page.category.id)}}</strong>
          </p>
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
    export default {
        props: ['pages'],
        methods: {
            getCategoryTree (categoryId) {
                return this.$store.getters.getTextBreadcrumb(categoryId);
            },
            hasAcceptedAnswer (page) {
                return page.children && page.children.some(child => child.accepted);
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

    .page__answers {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      padding: 0 0.6rem;
      border-radius: 0 $border-radius $border-radius 0;

      &.hasAnswers {
        color: $success-dark;
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
