<template>
  <header>
    <NuxtLink to="/" class="logo">
      <img src="/Logo.png"/>
      <span class="name">
        <span class="name-nd">Next</span>
        <span class="name-cc">Direction</span>
      </span>
    </NuxtLink>
    <section class="search">
      <Search/>
    </section>
    <section class="user">
      <SignIn v-if="!user"/>
      <SignUp v-if="!user"/>
      <button v-if="user" class="danger" @click="logout">Logout</button>
    </section>
  </header>
</template>

<script>
    import Search from '~/components/functional/Search.vue';
    import SignUp from '~/components/functional/SignUp.vue';
    import SignIn from '~/components/functional/SignIn.vue';

    export default {
        components: {
            SignIn,
            SignUp,
            Search,
        },
        computed: {
            user() {
                return this.$store.state.user;
            }
        },
        methods: {
            logout() {
                this.$cookies.remove('token');
                this.$store.commit('setUser', null);
            }
        }
    };
</script>

<style lang="scss" scoped>
  header {
    display: flex;
    justify-content: space-between;
    padding: 0.6rem;
    border-bottom: 2px solid $main-color;
    background-color: white;
    box-shadow: 0 3px 6px rgba(0, 0, 0, .2);
    position: sticky;
    top: 0;

    .logo {
      display: flex;
      align-items: center;

      text-decoration: none;

      .name {
        display: inline-flex;
        margin-left: 1rem;
        font-size: 2rem;

        &-nd {
          color: $secondary-color;
        }

        &-cc {
          color: $main-color;
        }
      }

      img {
        margin-left: 1rem;
        height: 3rem;
      }
    }

    .search {
      display: flex;
      align-items: center;
    }

    .user {
      display: flex;
      align-items: center;

      :first-child {
        margin: 0 0.3rem;
      }
    }
  }
</style>
