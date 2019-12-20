<template>
  <section class="page-content">
    <SideBar/>
    <div>Some content later on</div>
  </section>
</template>

<script>
    import SideBar from '~/components/functional/SideBar.vue';

    export default {
        components: {
            SideBar,
        },
    };
</script>

<style lang="scss" scoped>
  .page-content {
    width: 100%;
    max-width: 1000px;
    display: flex;
  }
</style>
