<template>
  <ul v-if="categories">
    <li v-for="category in categories">
      <nuxt-link :to="'/category/' + category.id">{{ category.name }}</nuxt-link>
      <CategoryList class="child-list" :parentCategory="category.id"/>
    </li>
  </ul>
</template>

<script>
  export default {
    name: 'CategoryList',
    props: {
      parentCategory: Number,
    },
    computed: {
      categories () {
        const categories = this.$store.state.categories.all;
        const parentMapping = this.$store.state.categories.parents;

        return categories.filter(category => +parentMapping[category.id] === +this.parentCategory);
      },
    },
  };
</script>

<style lang="scss" scoped>

  .child-list {
    margin-left: 0.6rem;
  }

  ul {
    list-style-type: none;
    padding: 0;

    li {

      a {
        width: 100%;
        display: inline-block;
        padding: 0.4rem 2rem 0.4rem 0.4rem;
        text-decoration: none;
        border-right: 4px solid transparent;

        &.nuxt-link-exact-active {
          border-right: 4px solid $main-color;
          background: $main-bg;
          border-top-left-radius: $border-radius;
          border-bottom-left-radius: $border-radius;
        }
      }
    }
  }
</style>
