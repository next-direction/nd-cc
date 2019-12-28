<template>
  <div class="user-menu">
    <nuxt-link tag="span" :to="'/profile/' + user.id" class="user-image" :style="{backgroundImage: 'url(' + avatar + ')'}" v-if="avatar">
    </nuxt-link>
    <nuxt-link tag="span" :to="'/profile/' + user.id" class="user-image" style="background-image: url(/images/no-user.svg)" v-else></nuxt-link>
    <nuxt-link tag="span" :to="'/profile/' + user.id" class="display-name">
      {{ displayName }}
    </nuxt-link>
    <button class="danger" @click="logout">Logout</button>
  </div>
</template>

<script>
    export default {
        computed: {
            avatar () {
                return this.$store.getters.getSmallAvatar;
            },
            user () {
                return this.$store.state.user;
            },
            displayName () {
                if (this.user.last_name) {
                    return `${this.user.last_name}`.trim();
                } else {
                    return this.user.email;
                }
            },
        },
        methods: {
            logout () {
                this.$cookies.remove('token');
                this.$store.commit('setUser', null);
                this.$store.dispatch('userStateChanged');
            },
        },
    };
</script>

<style lang="scss" scoped>
  .user-menu {
    display: flex;
    align-items: center;

    .user-image {
      height: 3rem;
      width: 3rem;
      border-radius: 50%;
      overflow: hidden;
      background-size: cover;
      display: inline-block;
      margin-right: 0.6rem !important;

      &:hover {
        cursor: pointer;
      }
    }

    .display-name {
      display: inline-block;
      margin-right: 2rem !important;

      &:hover {
        text-decoration: underline;
        cursor: pointer;
      }
    }
  }
</style>
