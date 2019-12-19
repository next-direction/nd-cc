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
                document.getElementById('email-address').focus();
            },
        },
    };
</script>

<style lang="scss" scoped>
  .register {
    margin-right: 0.5rem;
  }
</style>
