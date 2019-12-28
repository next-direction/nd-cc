<template>
  <section class="page-content">
    <SideBar/>
    <section class="main">
      <PageListHeader :title="title" :tags="[$route.params.tag]"/>
      <PageList :pages="hits"/>
    </section>
  </section>
</template>

<script>
    import PageList from '~/components/functional/PageList';
    import PageListHeader from '~/components/functional/PageListHeader';
    import SideBar from '~/components/functional/SideBar.vue';

    export default {
        async asyncData ({ app, params, store }) {
            const headers = {
                'Content-Type': 'application/json',
            };

            if (app.$cookies.get('token')) {
                headers['Authorization'] = 'Bearer ' + app.$cookies.get('token');
            }

            // fetch pages
            const pageResponse = await fetch(
                store.state.baseUrl
                + `/items/page?sort=-created_on`
                + `&fields=id,title,content,status,tags,created_on,category.id,created_by.last_name,children.id,children.accepted,votes.*`
                + `&filter[tags][contains]=,${params.tag},`,
                {
                    headers,
                },
            );

            const { data } = await pageResponse.json();

            return {
                hits: data,
            };
        },
        components: {
            PageList,
            PageListHeader,
            SideBar,
        },
        computed: {
            title () {
                return `Results for tag "${this.$route.params.tag}"`;
            },
        },
        validate ({ params }) {
            return params.tag.length > 0;
        },
    };
</script>

<style lang="scss" scoped>
  .page-content {
    width: 90%;
    max-width: 1200px;
    display: flex;
  }

  .main {
    flex: 1;
    padding: 2rem;
  }
</style>
