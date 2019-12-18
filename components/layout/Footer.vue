<template>
  <footer>
    <section class="copy">
      &copy 2019 - {{new Date().getFullYear()}} CC - Next Direction
    </section>
    <section class="legal">
      <nuxt-link to="/legal/imprint">Imprint</nuxt-link> &bull;
      <nuxt-link to="/legal/privacy">Privacy</nuxt-link> &bull;
      <nuxt-link to="/legal/terms">Terms of use</nuxt-link>
    </section>
  </footer>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
footer {
  display: flex;
  justify-content: space-between;
  border-top: 2px solid $secondary-color;
  font-size:1.1rem;
  padding: 1.4rem;
  box-shadow: 0 3px 6px rgba(0,0,0,.4) inset;
  position: sticky;
  bottom: 0;
  background: white;

  .copy {
    color: $secondary-color;
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
