<template>
  <span class="excerpt__content">
    <span v-if="getFirstParagraph" v-html="getFirstParagraph"></span>
  </span>
</template>

<script>
    export default {
        computed: {
            getFirstParagraph () {
                let content = '';

                this.blocks.forEach(block => {
                    if ('paragraph' === block.type && '' === content) {
                        content = block.data.text;
                    }
                });

                return this.$filters.excerpt(this.$filters.ucfirst(content));
            },
        },
        props: ['blocks'],
    };
</script>

<style lang="scss" scoped>
  .excerpt__content {
    display: block;

    span {
      font-size: 0.9rem;
      line-height: 1.4rem;
      padding: 0.2rem 0.4rem;
      display: inline-block;
    }
  }
</style>
