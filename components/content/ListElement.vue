<template>
  <div class="list">
    <ul v-if="content.style === 'unordered'">
      <li v-for="item in content.items">{{ item }}</li>
    </ul>
    <ol v-if="content.style === 'ordered'">
      <li v-for="item in content.items">{{ item }}</li>
    </ol>
  </div>
</template>

<script>
    export default {
        props: ['content'],
    };
</script>

<style lang="scss" scoped>
  .list {
    margin: 1rem 0;
  }

  ul, ol {
    margin: 0 1.6rem;
    padding: 0;

    li {
      padding-left: 0.8rem;
      line-height: 1.6rem;
    }
  }
</style>
