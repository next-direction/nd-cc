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
      <UserMenu v-if="user"/>
    </section>
  </header>
</template>

<script>
    import Search from '~/components/ui/Search.vue';
    import SignUp from '~/components/functional/SignUp.vue';
    import SignIn from '~/components/functional/SignIn.vue';
    import UserMenu from '~/components/functional/UserMenu.vue';

    export default {
        components: {
            SignIn,
            SignUp,
            Search,
            UserMenu,
        },
        computed: {
            user () {
                return this.$store.state.user;
            },
        },
    };
</script>

<style lang="scss" scoped>
  header {
    display: flex;
    justify-content: stretch;
    padding: 0.6rem;
    border-bottom: 2px solid $main-color;
    background-color: white;
    box-shadow: 0 3px 6px rgba(0, 0, 0, .2);
    position: sticky;
    top: 0;
    z-index: 10;

    .logo {
      flex: 1 0 30%;
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
      flex: 1 0 30%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user {
      flex: 1 0 30%;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
  }
</style>
