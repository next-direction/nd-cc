<template>
  <div class="container" :class="{visible: signUp}">
    <form class="form" @submit.prevent="register">
      <h1>Sign up</h1>
      <span class="form__close" @click="closeSignUpForm">╳</span>
      <div class="form__field white">
        <input id="signup-email" placeholder="Email address" v-model="email"/>
        <label for="signup-email">Email address</label>
      </div>
      <div class="form__field white">
        <input id="username" placeholder="Username" v-model="username"/>
        <label for="username">Username</label>
      </div>
      <div class="form__field white">
        <input id="signup-password" type="password" placeholder="Password" v-model="password"/>
        <label for="signup-password">Password</label>
      </div>
      <div class="form__field white">
        <input id="signup-confirm-password" type="password" placeholder="Confirm password"/>
        <label for="signup-confirm-password">Confirm password</label>
      </div>
      <hr style="border: none;">
      <div class="form__checkbox classic" white>
        <input id="terms" type="checkbox">
        <label for="terms">I accept the
          <nuxt-link to="/legal/terms" @click.native="closeSignUpForm">terms of use</nuxt-link>
        </label>
      </div>
      <div class="form__checkbox classic" white>
        <input id="privacy" type="checkbox">
        <label for="privacy">I accept the
          <nuxt-link to="/legal/privacy" @click.native="closeSignUpForm">privacy agreement</nuxt-link>
        </label>
      </div>
      <div class="form__button">
        <button class="info">Sign up</button>
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
                username: '',
            };
        },
        methods: {
            async register () {
                try {
                    const response = await fetch(this.$store.state.baseUrl + '/users', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            email: this.email,
                            password: this.password,
                            status: 'invited',
                            last_name: this.username,
                        }),
                    });
                    const result = await response.json();

                    if (result.error) {
                        alert(result.error.message);
                    }

                    alert('Sign up successful! An Administrator has been informed and will activate you account as soon as possible.');

                    this.email = '';
                    this.password = '';
                    this.closeSignUpForm();
                } catch (e) {
                    alert(e.message);
                }
            },
            closeSignUpForm (e) {
                if (!e || !e.ctrlKey) {
                    this.$store.commit('showBackdrop', false);
                    this.$store.commit('showSignUp', false);
                }
            },
        },
        computed: {
            signUp () {
                return this.$store.state.signUp;
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
    border: 2px solid $info-dark;
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
