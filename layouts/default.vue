<template>
  <div class="page-container">
    <Header/>
    <main>
      <nuxt/>
    </main>
    <Footer/>
  </div>
</template>

<script>
    import Header from '~/components/layout/Header.vue';
    import Footer from '~/components/layout/Footer.vue';

    export default {
        components: {
            Header,
            Footer,
        },
    };
</script>

<style lang="scss">
  @font-face {
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 400;
    src: local('Montserrat Regular'), local('Montserrat-Regular'),
    url('/fonts/montserrat-v14-latin-regular.woff2') format('woff2'),
    url('/fonts/montserrat-v14-latin-regular.woff') format('woff');
  }

  @font-face {
    font-family: 'Montserrat';
    font-style: italic;
    font-weight: 400;
    src: local('Montserrat Italic'), local('Montserrat-Italic'),
    url('/fonts/montserrat-v14-latin-italic.woff2') format('woff2'),
    url('/fonts/montserrat-v14-latin-italic.woff') format('woff');
  }

  @font-face {
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 800;
    src: local('Montserrat ExtraBold'), local('Montserrat-ExtraBold'),
    url('/fonts/montserrat-v14-latin-800.woff2') format('woff2'),
    url('/fonts/montserrat-v14-latin-800.woff') format('woff');
  }

  @font-face {
    font-family: 'Montserrat';
    font-style: italic;
    font-weight: 800;
    src: local('Montserrat ExtraBold Italic'), local('Montserrat-ExtraBoldItalic'),
    url('/fonts/montserrat-v14-latin-800italic.woff2') format('woff2'),
    url('/fonts/montserrat-v14-latin-800italic.woff') format('woff');
  }

  html {
    font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Ubuntu, Roboto, 'Helvetica Neue', Arial, sans-serif;
    font-size: 100%;
    word-spacing: 1px;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    box-sizing: border-box;
  }

  *,
  *:before,
  *:after {
    box-sizing: border-box;
    margin: 0;
    outline: none;
  }

  .page-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1 0 auto;
  }

  h1, h2, h3, h4, h5, h6, a {
    color: $main-color;
  }

  button {
    font-size: 1.1rem;
    padding: calc(0.5rem - 1px) 1rem;
    background: white;
    border-radius: $border-radius;
    transition: all 0.3s ease;
    cursor: pointer;

    position: relative;
    text-align: center;
    -webkit-transition-duration: 0.4s;
    transition-duration: 0.4s;
    text-decoration: none;
    overflow: hidden;

    &:after {
      content: "";
      display: block;
      position: absolute;
      padding-top: 200%;
      padding-left: 250%;
      margin-left: -20px!important;
      margin-top: -120%;
      opacity: 0;
      transition: all 0.8s;
      border-radius: 40%;
    }

    &:active:after {
      padding: 0;
      margin: 0;
      opacity: 1;
      transition: 0s
    }

    &.primary {
      border: 1px solid $main-color;
      color: $main-color;

      &:after {
        background: lighten($main-color, 50%);
      }

      &:hover,
      &:active {
        color: white;
        background: $main-color;
      }
    }

    &.success {
      border: 1px solid $success-dark;
      color: $success-dark;

      &:after {
        background: lighten($success-dark, 50%);
      }

      &:hover,
      &:active {
        color: white;
        background: $success-dark;
      }
    }
  }
</style>
