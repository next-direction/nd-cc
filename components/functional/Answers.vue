<template>
  <section class="answers" v-if="details.children.length">
    <div class="answers__count">
      <h4>{{ details.children.length }} answer(s)</h4>
    </div>
    <template v-for="child in details.children">
      <hr>
      <Answer :details="child"/>
    </template>
  </section>
</template>

<script>
    import Answer from '~/components/functional/Answer.vue';
    import Blocks from '~/components/content/Blocks.vue';

    export default {
        components: {
            Answer,
            Blocks,
        },
        computed: {
            details () {
                return this.$store.state.page.details;
            },
        },
    };
</script>

<style lang="scss" scoped>
  .answers {
    hr {
      margin: 1rem 0;
      border: none;
      border-bottom: 1px solid $main-light;
    }

    &__count {
      margin-top: 2rem;
    }

    &__answer {
      padding: 0 0 0 2rem;

      .acceptedAnswer {
        background: $success-light;
      }

      .answer__footer {
        display: flex;
        align-items: center;
        justify-content: space-between;

        &-meta {
          flex: 1;
          margin: 1rem 0;
          color: grey;
          font-size: 0.8rem;
          text-align: right;
        }
      }
    }
  }
</style>
