<template>
  <div class="newest-list">
    <PageListHeader title="Newest topics"/>
    <PageList :pages="topics"/>
  </div>
</template>

<script>
    import PageList from '~/components/functional/PageList.vue';
    import PageListHeader from '~/components/functional/PageListHeader.vue';

    export default {
        components: {
            PageList,
            PageListHeader,
        },
        props: ['topics'],
        computed: {
            user () {
                return this.$store.state.user;
            },
        },
    };
</script>

<style lang="scss" scoped>
  .newest-list {
    flex: 1;
    padding: 2rem;
  }
</style>
