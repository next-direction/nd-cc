<template>
  <section class="answer" v-if="user && details.status !== 'draft'">
    <hr>
    <h4>New answer</h4>
    <PageForm
      :onlyEditor="true"
      :category="'' + details.category.id"
      :parent="details.id"
      :defaultTitle="getDefaultTitle()"
      @updateSaved="updateSaved"
      @pageSaved="pageSaved"
      placeholder="Click here to start your answer"/>
  </section>
</template>

<script>
    import PageForm from '~/components/functional/PageForm.vue';

    export default {
        components: {
            PageForm,
        },
        computed: {
            user () {
                return this.$store.state.user;
            },
        },
        methods: {
            getDefaultTitle () {
                return `answer-${this.details.id}-${Math.floor(Date.now() / 1000)}`;
            },
            pageSaved (page) {
                this.$emit('pageSaved', page);
            },
            updateSaved (state) {
                this.$emit('updateSaved', state);
            },
        },
        props: ['details'],
    };
</script>

<style lang="scss" scoped>
  .answer {
    hr {
      margin-top: 2rem;
      margin-bottom: 1rem;
      border: none;
      border-bottom: 2px solid $main-light;
    }
  }
</style>
