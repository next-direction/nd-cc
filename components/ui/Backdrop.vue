<template>
  <div :class="{visible: backdrop}"></div>
</template>

<script>
    export default {
        computed: {
            backdrop() {
                return this.$store.state.backdrop;
            }
        }
    };
</script>

<style lang="scss" scoped>
  div {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0, 0.2);
    z-index: -1;
    transition: all 0.2s ease;
    opacity: 0;
  }

  div.visible {
    z-index: 10;
    opacity: 1;
  }
</style>
