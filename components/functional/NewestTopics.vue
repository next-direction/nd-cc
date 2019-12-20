<template>
  <div class="newest-list">
    <header>
      <h1>Newest topics</h1>
      <div>
        <button class="success" v-if="user">New topic</button>
      </div>
    </header>
    <PageList :pages="topics"/>
  </div>
</template>

<script>
    import PageList from '~/components/functional/PageList.vue';

    export default {
        components: {
            PageList,
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

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
  }
</style>
