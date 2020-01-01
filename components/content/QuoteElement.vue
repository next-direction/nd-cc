<template>
  <blockquote :cite="cite" :class="{alignCenter: content.alignment !== 'left', paddingBottom: !cite}" v-html="content.text"></blockquote>
</template>

<script>
    import stripTags from 'striptags';

    export default {
        computed: {
            cite () {
                return stripTags(this.content.caption).trim().length ? '- ' + stripTags(this.content.caption) : '';
            },
        },
        props: ['content'],
    };
</script>

<style lang="scss" scoped>
  blockquote {
    display: block;
    border-width: 2px 0;
    border-style: solid;
    border-color: $main-light;
    padding: 1.5em 0 0.5em;
    margin: 1.5em 0 !important;
    position: relative;
    color: $secondary-color;

    &.alignCenter {
      text-align: center;
    }

    &.paddingBottom {
      padding-bottom: 1.5rem;
    }
  }

  blockquote:before {
    content: '\201C';
    position: absolute;
    top: -0.8rem;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    width: 3rem;
    height: 2rem;
    font: 6em/1.08em 'Montserrat', sans-serif;
    color: $main-light;
    text-align: center;
  }

  blockquote:after {
    content: attr(cite);
    display: block;
    text-align: right;
    font-size: 0.875em;
    color: $main-light;
  }
</style>
