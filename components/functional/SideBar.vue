<template>
  <div class="side-bar">
    <ul>
      <li>
        <nuxt-link to="/">Newest topics</nuxt-link>
      </li>
      <li v-if="$route.path.includes('/search/')">
        <span class="active-search nuxt-link-exact-active">Search</span>
      </li>
    </ul>
    <div class="divider">
      Categories
    </div>
    <CategoryList class="parent-list" :parentCategory="0"/>
  </div>
</template>

<script>
  import CategoryList from '~/components/functional/CategoryList.vue';

  export default {
    components: {
      CategoryList,
    },
  };
</script>

<style lang="scss" scoped>
  .side-bar {
    border-right: 1px solid $gray-dark;

    .divider {
      background: $main-color;
      color: white;
      padding: 0.4rem;
      display: inline-block;
      margin: 0.4rem 0;
      width: 100%;
      font-weight: bold;
      border-top-left-radius: $border-radius;
      border-bottom-left-radius: $border-radius;
    }

    .parent-list {
      margin-top: 0;
    }

    ul {
      list-style-type: none;
      margin: 1rem 0;
      padding: 0;

      li {

        a, .active-search {
          width: 100%;
          display: inline-block;
          padding: 0.4rem 2rem 0.4rem 0.4rem;
          text-decoration: none;
          border-right: 4px solid transparent;
          color: $main-color;

          &.nuxt-link-exact-active {
            border-right: 4px solid $main-color;
            background: $main-bg;
            border-top-left-radius: $border-radius;
            border-bottom-left-radius: $border-radius;
          }
        }
      }
    }
  }
</style>
