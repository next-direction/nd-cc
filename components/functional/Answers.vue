<template>
  <section class="answers" v-if="details.children.length">
    <div class="answers__count">
      <h4>{{ details.children.length }} answer(s)</h4>
    </div>
    <template v-for="child in details.children">
      <hr>
      <div class="answers__answer">
        <Blocks :blocks="child.content.blocks" :class="{ acceptedAnswer: child.accepted }"/>
        <p class="meta">
          Answered by <strong>{{ child.created_by.last_name }}</strong> at <strong>{{ child.created_on | formatDate }}</strong>
        </p>
      </div>
    </template>
  </section>
</template>

<script>
    import Blocks from '~/components/content/Blocks.vue';

    export default {
        components: {
            Blocks,
        },
        props: ['details'],
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

      .meta {
        margin: 1rem 0;
        color: grey;
        font-size: 0.8rem;
        text-align: right;
      }
    }
  }
</style>
