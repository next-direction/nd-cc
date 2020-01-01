<template>
  <div class="page-container">
    <Header/>
    <main>
      <nuxt/>
    </main>
    <Footer/>
    <Backdrop/>
    <SignInForm/>
    <SignUpForm/>
  </div>
</template>

<script>
    import Backdrop from '~/components/ui/Backdrop.vue';
    import Footer from '~/components/layout/Footer.vue';
    import Header from '~/components/layout/Header.vue';
    import SignInForm from '~/components/ui/SignInForm.vue';
    import SignUpForm from '~/components/ui/SignUpForm.vue';

    export default {
        components: {
            Backdrop,
            Footer,
            Header,
            SignInForm,
            SignUpForm,
        },
        mounted () {
            window.addEventListener('keypress', (e) => {
                if (e.ctrlKey && e.shiftKey && e.code === 'KeyF') {
                    document.getElementById('search-field').focus();
                }
            });
        },
    };
</script>

<style lang="scss">
  .page-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1 0 auto;
    display: flex;
    justify-content: center;
    padding-bottom: 6rem;
  }
</style>
