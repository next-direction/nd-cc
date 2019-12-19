<template>
  <div class="register">
    <button class="info" @click="showSignUpForm">Sign up</button>
  </div>
</template>

<script>
    export default {
        methods: {
            showSignUpForm () {
                this.$store.commit('showBackdrop', true);
                this.$store.commit('showSignUp', true);
            },
        },
    };
</script>

<style lang="scss" scoped>

</style>
