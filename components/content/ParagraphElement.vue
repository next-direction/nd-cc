<template>
  <p v-html="content.text"></p>
</template>

<script>
    export default {
        props: ['content'],
    };
</script>

<style lang="scss" scoped>
  p {
    margin: 0.6rem 0;
    line-height: 1.6;
    text-align: justify;
    hyphens: auto;
  }
</style>
