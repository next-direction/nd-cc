<template>
  <section class="page-content">
    <SideBar/>
    <NewestTopics :topics="pages"/>
  </section>
</template>

<script>
    import NewestTopics from '~/components/functional/NewestTopics.vue';
    import SideBar from '~/components/functional/SideBar.vue';

    const fetchPages = async (app, store) => {
        const headers = {
            'Content-Type': 'application/json',
        };

        if (app.$cookies.get('token')) {
            headers['Authorization'] = 'Bearer ' + app.$cookies.get('token');
        }

        // fetch pages
        const pageResponse = await fetch(
            store.state.baseUrl
            + '/items/page?sort=status,-created_on&fields=id,title,content,status,created_on,category.id,created_by.last_name,children.id,children.accepted,votes.*&filter[parent_page][eq]=0&filter[status][neq]=announcement',
            {
                headers,
            },
        );

        const { data: pages } = await pageResponse.json();

        return pages;
    };

    export default {
        async asyncData ({ app, store }) {
            return {
                pages: await fetchPages(app, store),
            };
        },
        components: {
            NewestTopics,
            SideBar,
        },
        created () {
            this.$store.subscribe(async (mutation) => {
                if (mutation.type === 'toggleUserStateChange') {
                    this.$nuxt.$loading.start();
                    this.pages = await fetchPages(this, this.$store);
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
</style>
