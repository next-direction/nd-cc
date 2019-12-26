<template>
  <section class="page-content">
    <SideBar/>
    <section class="main">
      <PageListHeader :title="title" :category="category.id"/>
      <PageList :pages="topics"/>
    </section>
  </section>
</template>

<script>
    import PageList from '~/components/functional/PageList.vue';
    import PageListHeader from '~/components/functional/PageListHeader.vue';
    import SideBar from '~/components/functional/SideBar.vue';

    const fetchPages = async (app, params, store) => {
        const headers = {
            'Content-Type': 'application/json',
        };

        if (app.$cookies.get('token')) {
            headers['Authorization'] = 'Bearer ' + app.$cookies.get('token');
        }

        const categories = [
            params.category,
            ...store.getters.childCategories(params.category),
        ];

        // fetch pages
        const pageResponse = await fetch(
            store.state.baseUrl
            + `/items/page?filter[category][in]=${categories.join(',')}&sort=status,-created_on&fields=id,title,status,created_on,category.id,created_by.last_name,children.id,children.accepted,votes.*&filter[parent_page][eq]=0`,
            {
                headers,
            },
        );

        const { data: topics } = await pageResponse.json();

        return {
            category: store.getters.category(+params.category),
            topics,
        };
    };

    export default {
        async asyncData ({ app, params, store }) {
            return await fetchPages(app, params, store);
        },
        components: {
            PageList,
            PageListHeader,
            SideBar,
        },
        computed: {
            user () {
                return this.$store.state.user;
            },
            title () {
                return 'Topics in "' + this.category.name + '"';
            },
        },
        created () {
            this.$store.subscribe(async (mutation) => {
                if (mutation.type === 'toggleUserStateChange') {
                    this.$nuxt.$loading.start();
                    const data = await fetchPages(this, this.$route.params, this.$store);
                    this.topics = data.topics;
                    this.$nuxt.$loading.finish();
                }
            });
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

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
</style>
