<template>
  <div>
    <h1 v-if="content.level === 1">{{ content.text }}</h1>
    <h2 v-if="content.level === 2">{{ content.text }}</h2>
    <h3 v-if="content.level === 3">{{ content.text }}</h3>
    <h4 v-if="content.level === 4">{{ content.text }}</h4>
    <h5 v-if="content.level === 5">{{ content.text }}</h5>
    <h6 v-if="content.level === 6">{{ content.text }}</h6>
  </div>
</template>

<script>
    export default {
        props: ['content'],
    };
</script>

<style lang="scss" scoped>
  h1, h2, h3, h4, h5, h6 {
    margin-top: 2rem;
    margin-bottom: 1rem;
  }
</style>
