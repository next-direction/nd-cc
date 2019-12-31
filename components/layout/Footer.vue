<template>
  <footer>
    <section class="copy">
      &copy 2019 - {{new Date().getFullYear()}} CC - Next Direction
    </section>
    <section class="links">
      <a href="https://github.com/next-direction/nd-cc" target="_blank" title="GitHub Repository for this page">
        <fa :icon="fa.faGithubSquare"/>
      </a>
      <a href="https://next-direction.de" target="_blank" title="Next Direction Blog">
        <fa :icon="fa.faPenSquare"/>
      </a>
      <a href="mailto: info@next-direction.de" title="Contact us">
        <fa :icon="fa.faEnvelopeSquare"/>
      </a>
    </section>
    <section class="legal">
      <nuxt-link to="/legal/imprint">Imprint</nuxt-link> &bull;
      <nuxt-link to="/legal/privacy">Privacy</nuxt-link> &bull;
      <nuxt-link to="/legal/terms">Terms of use</nuxt-link>
    </section>
  </footer>
</template>

<script>
    import { faGithubSquare } from '@fortawesome/free-brands-svg-icons';
    import { faEnvelopeSquare, faPenSquare } from '@fortawesome/free-solid-svg-icons';

    export default {
        computed: {
            fa () {
                return {
                    faEnvelopeSquare,
                    faGithubSquare,
                    faPenSquare,
                };
            },
        },
    };
</script>

<style lang="scss" scoped>
  footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 2px solid $secondary-color;
    font-size: 1.1rem;
    padding: 1.2rem;
    box-shadow: 0 3px 6px rgba(0, 0, 0, .4) inset;
    position: sticky;
    bottom: 0;
    background: white;
    z-index: 10;

    .copy {
      color: $secondary-color;
    }

    .links {
      font-size: 1.4rem;

      a {
        margin: 0 0.4rem;
        color: $secondary-color;
      }
    }

    .legal {
      color: $main-color;

      a {
        text-decoration: none;
        color: $main-color;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
</style>
