<template>
  <div class="warning">
    <span class="icon" :class="{small: !content.title}">
      <fa :icon="fa.faExclamationTriangle"></fa>
    </span>
    <span class="content">
      <span class="title" v-if="content.title" v-html="content.title"></span>
      <span class="message" v-html="content.message"></span>
    </span>
  </div>
</template>

<script>
    import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
    import stripTags from 'striptags';

    export default {
        props: ['content'],
        computed: {
            fa () {
                return {
                    faExclamationTriangle,
                };
            },
        },
    };
</script>

<style lang="scss" scoped>
  .warning {
    padding: 1rem;
    background: $warning-light;
    color: $warning-dark;
    display: flex;
    margin: 1rem 0;

    .icon {
      font-size: 3rem;

      &.small {
        font-size: 1.4rem;
      }
    }

    .content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 1rem;

      .title {
        font-weight: bold;
        margin-bottom: 0.6rem;
      }

      .message {
        line-height: 1.4;
      }
    }
  }
</style>
