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
    <button type="button" class="noDefaultStyle" id="toTop" :class="{visible: showToTop}" @click="toTop">
      <fa :icon="fa.faCaretUp"></fa>
    </button>
  </div>
</template>

<script>
  import Backdrop from '~/components/ui/Backdrop.vue';
  import Footer from '~/components/layout/Footer.vue';
  import Header from '~/components/layout/Header.vue';
  import SignInForm from '~/components/ui/SignInForm.vue';
  import SignUpForm from '~/components/ui/SignUpForm.vue';
  import { faCaretUp } from '@fortawesome/free-solid-svg-icons';

  export default {
    components: {
      Backdrop,
      Footer,
      Header,
      SignInForm,
      SignUpForm,
    },
    computed: {
      fa () {
        return {
          faCaretUp,
        };
      },
    },
    data () {
      return {
        showToTop: false,
      };
    },
    methods: {
      toTop () {
        window.scrollTo(0, 0);
      },
    },
    mounted () {
      window.addEventListener('keypress', e => {
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyF') {
          document.getElementById('search-field').focus();
        }
      });

      window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
          this.showToTop = true;
        } else {
          this.showToTop = false;
        }
      });
    },
  };
</script>

<style lang="scss">
  #toTop {
    position: fixed;
    bottom: 100px;
    right: 36px;

    width: 3rem;
    height: 3rem;

    display: flex;
    justify-content: center;
    align-items: center;

    border: none;

    background: $main-color;
    color: white;
    border-radius: $border-radius;

    font-size: 1.6rem;
    cursor: pointer;

    transform: translateX(100px);
    transition: transform 0.5s ease;

    &:after {
      content: '';
      border: 1px solid $main-color;
      border-radius: $border-radius;
      background: transparent;
      position: absolute;

      width: 3.3rem;
      height: 3.3rem;
    }

    &.visible {
      transform: translateX(0);
    }
  }

  .page-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1 0 auto;
    display: flex;
    justify-content: center;
    padding-bottom: 4rem;
  }
</style>
