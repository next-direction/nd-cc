<template>
  <div>
    <span class="tag" v-for="tag in filteredTags">{{ tag }}</span>
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
  }
</style>
