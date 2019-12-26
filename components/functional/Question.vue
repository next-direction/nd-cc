<template>
  <section class="details">
    <div class="header">
      <h1>
        {{ details.title }}
      </h1>
      <button @click="$emit('edit')" class="info" v-if="editable">Edit</button>
    </div>
    <p class="meta">
      Created by <strong>{{ details.created_by.last_name }}</strong> at <strong>{{ details.created_on | formatDate }}</strong> in <strong>{{ getCategoryTree(details.category.id)
      }}</strong>
      <span v-if="details.created_on !== details.modified_on">
        Modified by <strong>{{ details.modified_by.last_name }}</strong> at <strong>{{ details.modified_on | formatDate }}</strong>
      </span>
    </p>
    <Blocks :blocks="details.content.blocks"/>
  </section>
</template>

<script>
    import Blocks from '~/components/content/Blocks.vue';

    export default {
        components: {
            Blocks,
        },
        computed: {
            details () {
                return this.$store.state.page.details;
            },
            editable () {
                return this.$store.state.user && +this.details.created_by.id === +this.$store.state.user.id;
            },
        },
        methods: {
            getCategoryTree (categoryId) {
                return this.$store.getters.getTextBreadcrumb(categoryId);
            },
        },
    };
</script>

<style lang="scss" scoped>
  .details {
    flex: 1;

    .header {
      display: flex;
      justify-content: space-between;
    }

    .content {
      margin-top: 2rem;
    }

    .meta {
      margin: 1rem 0;
      color: grey;
      font-size: 0.8rem;
      text-align: right;

      span {
        display: block;
        margin-top: 0.2rem;
      }
    }
  }
</style>
