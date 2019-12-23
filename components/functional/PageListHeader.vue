<template>
  <header>
    <h1>{{ title }}</h1>
    <div>
      <button class="success" v-if="user" @click="$router.push(createRoute)">New topic</button>
    </div>
  </header>
</template>

<script>
    export default {
        props: ['title', 'category'],
        computed: {
            user () {
                return this.$store.state.user;
            },
            createRoute () {
                this.$store.commit('setForwardTarget', this.$route.path);

                return '/page/create' + (this.category ? '/' + this.category : '');
            },
        },
    };
</script>

<style lang="scss" scoped>
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
  }
</style>
