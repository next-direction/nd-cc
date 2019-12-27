<template>
  <div class="container" :class="{visible: signIn}">
    <form class="form" @submit.prevent="signInAction">
      <h1>Sign in</h1>
      <span class="form__close" @click="closeSignInForm">╳</span>
      <div class="form__field white">
        <input id="email-address" placeholder="Email address" v-model="email"/>
        <label for="email-address">Email address</label>
      </div>
      <div class="form__field white">
        <input id="password" type="password" placeholder="Password" v-model="password"/>
        <label for="password">Password</label>
      </div>
      <div class="form__button">
        <button class="success" :disabled="loading">Sign in</button>
      </div>
    </form>
  </div>
</template>

<script>
    export default {
        data () {
            return {
                email: '',
                password: '',
                loading: false,
            };
        },
        methods: {
            async signInAction () {
                try {
                    this.loading = true;

                    const response = await fetch(this.$store.state.baseUrl + '/auth/authenticate', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: this.email,
                            password: this.password,
                        }),
                    });
                    const result = await response.json();

                    this.loading = false;

                    if (result.error) {
                        this.$alert('The following error occurred: ' + result.error.message, null, 'error');
                        return;
                    }

                    if (result.data.token) {
                        this.$cookies.set('token', result.data.token, {
                            sameSite: 'strict',
                            secure: 'https:' === window.location.protocol,
                            path: '/',
                        });

                        const user = result.data.user;

                        this.$store.commit('setUser', user);
                        this.$registerRefreshHandler(result.data.token);
                        this.$store.dispatch('userStateChanged');

                        if (user.avatar) {
                            this.$store.dispatch('fetchAvatar', { ...user, token: result.data.token });
                        }
                    } else {
                        this.$alert('Error during sign in, please try again later', null, 'error');
                        return;
                    }

                    this.email = '';
                    this.password = '';

                    this.closeSignInForm();
                } catch (e) {
                    this.$alert('The following error occurred: ' + e.message, null, 'error');
                }
            },
            closeSignInForm (e) {
                if (!e || !e.ctrlKey) {
                    this.$store.commit('showBackdrop', false);
                    this.$store.commit('showSignIn', false);
                }
            },
        },
        computed: {
            signIn () {
                return this.$store.state.signIn;
            },
        },
    };
</script>

<style lang="scss" scoped>
  .container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: -1;

    &.visible {
      z-index: 15;

      .form {
        z-index: 20;
        opacity: 1;
      }
    }
  }

  .form {
    background: rgba(40, 40, 40, 0.9);
    z-index: -1;
    padding: 2rem;
    border-radius: $border-radius;
    width: 80%;
    max-width: 25rem;
    position: relative;
    border: 2px solid $success-dark;
    opacity: 0;
    transition: all 0.2s ease;
    color: white;

    h1 {
      color: white;
      margin-bottom: 1rem;
    }

    a {
      color: white;
    }

    .form__close {
      position: absolute;
      top: 2rem;
      right: 2rem;
      color: white;
      cursor: pointer;
    }

    .form__checkbox {
      font-size: 0.8rem;
    }
  }
</style>
