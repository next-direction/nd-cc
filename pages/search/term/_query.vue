<template>
  <section class="page-content">
    <SideBar/>
    <section class="main">
      <PageListHeader :title="title" :tags="[$route.params.query]"/>
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

            const term = params.query;

            // fetch pages (detour over parent_page because otherwise filtering would not be possible)
            const pageResponse = await fetch(
                store.state.baseUrl
                + `/items/page?sort=-created_on&groups=parent_page`
                + '&fields=parent_page.*,parent_page.category.id,parent_page.created_by.id,parent_page.created_by.last_name,parent_page.children.id,parent_page.children.accepted,parent_page.votes.*'
                + `&filter[parent_page.title][contains]=${term}&filter[parent_page.content][logical]=or&filter[parent_page.content][contains]=${term}&filter[content][logical]=or&filter[content][contains]=${term}&filter[parent_page][neq]=0`,
                {
                    headers,
                },
            );

            const { data } = await pageResponse.json();

            const pages = [];

            data.forEach(page => {
                pages.push(page.parent_page);
            });

            return {
                hits: pages,
            };
        },
        components: {
            PageList,
            PageListHeader,
            SideBar,
        },
        computed: {
            title () {
                return `Results for "${this.$route.params.query}"`;
            },
        },
        validate ({ params }) {
            return params.query.length > 0;
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
