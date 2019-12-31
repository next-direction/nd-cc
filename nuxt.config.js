require('dotenv').config();

export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: 'Coding Community | Next Direction',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#083b66', throttle: 100 },
  /*
  ** Global CSS
  */
  css: [
    { src: '~assets/style/main.scss', lang: 'sass' },
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~plugins/filter.js',
    { src: '~plugins/alert.js', mode: 'client' },
    { src: '~plugins/refreshToken.js', mode: 'client' },
    '~plugins/vuelidate.js',
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    ['@nuxtjs/dotenv', { systemvars: true }],
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/style-resources',
    'nuxt-fontawesome',
    'cookie-universal-nuxt',
  ],

  styleResources: {
    scss: [
      '~assets/style/variables.scss',
    ],
  },

  fontawesome: {
    component: 'fa',
    imports: [],
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    },
  },
  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost',
  },
};
