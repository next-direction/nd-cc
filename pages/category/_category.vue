<template>
  <section class="page-content">
    <SideBar/>
    <section class="main">
      <header>
        <h1>Topics in "{{ category.name }}"</h1>
        <div>
          <button class="success" v-if="user">New topic</button>
        </div>
      </header>
      <PageList :pages="topics"/>
    </section>
  </section>
</template>

<script>
    import PageList from '~/components/functional/PageList.vue';
    import SideBar from '~/components/functional/SideBar.vue';

    export default {
        async asyncData ({ app, params, store }) {
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
            const pageResponse = await fetch(store.state.baseUrl + `/items/page?filter[category][in]=${categories.join(',')}&sort=status,-created_on&fields=title,status,created_by.*`, {
                headers,
            });

            const { data: topics } = await pageResponse.json();

            return {
                category: store.getters.category(+params.category),
                topics,
            };
        },
        components: {
            PageList,
            SideBar,
        },
        computed: {
            user () {
                return this.$store.state.user;
            },
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
