<template>
  <span class="lds-dual-ring" :class="type"></span>
</template>

<script>
    export default {
        props: ['type'],
    };
</script>

<style lang="scss" scoped>
  .lds-dual-ring {
    width: 1em;
    display: inline-block;
    margin: 0 auto;
  }

  .lds-dual-ring:after {
    content: " ";
    display: block;
    width: 0.8em;
    height: 0.8em;
    margin: 0.1em;
    border-radius: 50%;
    border: 0.08em solid #fff;
    border-color: #fff transparent #fff transparent;
    animation: lds-dual-ring 1.2s linear infinite;
  }

  .lds-dual-ring.info:after {
    border-color: $info-dark transparent $info-dark transparent;
  }

  .lds-dual-ring.primary:after {
    border-color: $main-color transparent $main-color transparent;
  }

  @keyframes lds-dual-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
