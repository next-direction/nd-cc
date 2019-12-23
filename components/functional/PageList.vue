<template>
  <div class="pages">
    <template v-if="pages.length">
      <div class="page" :class="{draft: page.status === 'draft', announcement: page.status === 'announcement'}" v-for="page in pages">
        <p class="page-title">
          <nuxt-link :to="'/page/detail/' + page.id">{{ page.title }}</nuxt-link>
        </p>
        <p class="page-meta">
          Created by <strong>{{ page.created_by.last_name }}</strong> on <strong>{{ page.created_on }}</strong> in <strong>{{ getCategoryTree(page.category.id)}}
        </strong></p>
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

    .page-title {
      padding: 0.4rem;
      font-weight: bold;

      a {
        text-decoration: none;

        &:hover {
          color: lighten($main-color, 10%);
        }
      }
    }

    .page-meta {
      padding: 0.4rem;
      color: grey;
      font-size: 0.8rem;
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
