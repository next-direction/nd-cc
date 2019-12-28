<template>
  <div>
    <nuxt-link :to="'/search/tag/' + tag" tag="span" class="tag" v-for="tag in filteredTags" :key="tag.id">{{ tag }}</nuxt-link>
  </div>
</template>

<script>
    export default {
        computed: {
            filteredTags () {
                return this.tags.filter(tag => tag !== '');
            },
        },
        props: ['tags'],
    };
</script>

<style lang="scss" scoped>
  .tag {
    background: $main-color;
    color: white;
    border-radius: $border-radius;
    font-size: 0.7rem;
    padding: 0.3rem;
    display: inline-block;
    margin-right: 0.2rem;
    cursor: pointer;
  }
</style>
