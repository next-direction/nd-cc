<template>
  <div :class="{withBackground: content.withBackground, withBorder: content.withBorder}">
    <figure>
      <img :src="content.file.url" :alt="content.caption" :class="{fullWidth: content.stretched}"/>
      <figcaption v-if="content.caption">{{ content.caption }}</figcaption>
    </figure>
  </div>
</template>

<script>
    export default {
        props: ['content'],
    };
</script>

<style lang="scss" scoped>
  div {
    padding: 1rem;

    &.withBackground {
      background: $main-bg;
    }

    &.withBorder {
      border: 1px solid $main-light;
    }

    img.fullWidth {
      width: 100%;
    }
  }

  figcaption {
    margin-top: 0.6rem;
  }
</style>
