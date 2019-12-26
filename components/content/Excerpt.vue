<template>
  <div class="excerpt__content">
    <span v-if="getFirstParagraph">
      {{ getFirstParagraph | ucfirst | excerpt }}
    </span>
  </div>
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

                return content;
            },
        },
        props: ['blocks'],
    };
</script>

<style lang="scss" scoped>
  .excerpt__content {
    span {
      font-size: 0.9rem;
      line-height: 1.4rem;
      padding: 0.2rem 0.4rem;
      display: inline-block;
    }
  }
</style>
