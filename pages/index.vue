<template>
  <section class="page-content">
    <SideBar/>
    <NewestTopics :topics="pages"/>
  </section>
</template>

<script>
    import NewestTopics from '~/components/functional/NewestTopics.vue';
    import SideBar from '~/components/functional/SideBar.vue';

    export default {
        async asyncData ({ app, store }) {
            const headers = {
                'Content-Type': 'application/json',
            };

            if (app.$cookies.get('token')) {
                headers['Authorization'] = 'Bearer ' + app.$cookies.get('token');
            }

            // fetch pages
            const pageResponse = await fetch(store.state.baseUrl + '/items/page?sort=status,-created_on&fields=title,status,created_by.*', {
                headers,
            });

            const { data: pages } = await pageResponse.json();

            return {
                pages,
            };
        },
        components: {
            NewestTopics,
            SideBar,
        },
    };
</script>

<style lang="scss" scoped>
  .page-content {
    width: 90%;
    max-width: 1200px;
    display: flex;
  }
</style>
