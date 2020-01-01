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

            // fetch pages with answers (detour over parent_page because otherwise filtering would not be possible)
            const pageResponseWithPromise = fetch(
                store.state.baseUrl
                + `/items/page?sort=-created_on&groups=parent_page`
                + '&fields=parent_page.*,parent_page.category.id,parent_page.created_by.id,parent_page.created_by.last_name,parent_page.children.id,parent_page.children.accepted,parent_page.votes.*'
                + `&filter[parent_page.title][contains]=${term}&filter[parent_page.content][logical]=or&filter[parent_page.content][contains]=${term}&filter[content][logical]=or&filter[content][contains]=${term}&filter[parent_page][neq]=0`,
                {
                    headers,
                },
            ).then(response => response.json());

            // pages that might not have answers (unfortunately no clean way to filter this at the moment)
            const pageResponseWithoutPromise = fetch(
                store.state.baseUrl
                + `/items/page?sort=-created_on`
                + '&fields=*,category.id,created_by.id,created_by.last_name,children.id,children.accepted,votes.*'
                + `&filter[title][0][contains]=${term}&filter[title][1][ncontains]=answer-&filter[content][logical]=or&filter[content][contains]=${term}&filter[parent_page][eq]=0`,
                {
                    headers,
                },
            ).then(response => response.json());

            // allow parallel execution for performance
            const pages = await Promise.all([pageResponseWithPromise, pageResponseWithoutPromise]).then(responses => {
                const hits = [];

                // pages with answers
                responses[0].data.forEach(page => {
                    hits.push(page.parent_page);
                });

                // pages without answers
                responses[1].data.forEach(page => {
                    const alreadyIn = hits.findIndex(hit => +page.id === +hit.id);

                    if (-1 === alreadyIn) {
                        hits.push(page);
                    }
                });

                return hits;
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
