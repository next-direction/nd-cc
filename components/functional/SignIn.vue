<template>
  <div class="register">
    <button class="success" @click="showSignInForm">Sign in</button>
  </div>
</template>

<script>
    export default {
        methods: {
            showSignInForm () {
                this.$store.commit('showBackdrop', true);
                this.$store.commit('showSignIn', true);
            },
        },
    };
</script>

<style lang="scss" scoped>

</style>
