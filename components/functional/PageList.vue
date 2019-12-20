<template>
  <div class="pages">
    <template v-if="pages.length">
      <div class="page" :class="{draft: page.status === 'draft', announcement: page.status === 'announcement'}" v-for="page in pages">
        <p class="page-title">{{ page.title }}</p>
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
