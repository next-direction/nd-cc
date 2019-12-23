<template>
  <div class="user-menu">
    <span class="user-image" :style="{backgroundImage: 'url(' + avatar + ')'}" v-if="avatar">
    </span>
    <span class="user-image" style="background-image: url(/images/no-user.svg)" v-else></span>
    <span class="display-name">
      {{ displayName }}
    </span>
    <button class="danger" @click="logout">Logout</button>
  </div>
</template>

<script>
    export default {
        computed: {
            avatar () {
                return this.$store.state.avatar;
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
                this.$store.commit('setAvatar', '');
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
    }

    .display-name {
      display: inline-block;
      margin-right: 2rem !important;
    }
  }
</style>
