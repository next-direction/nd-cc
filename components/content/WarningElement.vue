<template>
  <div class="warning">
    <span class="icon">
      <fa :icon="fa.faExclamationTriangle"></fa>
    </span>
    <span class="content">
      <span class="title" v-if="content.title">{{ content.title }}</span>
      <span class="message">{{ content.message }}</span>
    </span>
  </div>
</template>

<script>
    import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

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

    .icon {
      font-size: 3rem;
    }

    .content {
      display: flex;
      flex-direction: column;
      margin-left: 1rem;

      .title {
        font-weight: bold;
        margin-bottom: 0.6rem;
      }
    }
  }
</style>
