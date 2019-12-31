<template>
  <div class="container" :class="{visible: signUp}">
    <form class="form" @submit.prevent="register">
      <h1>Sign up</h1>
      <span class="form__close" @click="closeSignUpForm">╳</span>
      <div class="form__field white">
        <input id="signup-email" placeholder="Email address" v-model="email"/>
        <label for="signup-email">Email address</label>
      </div>
      <div class="field-description" :class="{invalid: $v.email.$error}">
        * only for login and communication
      </div>
      <div class="form__field white">
        <input id="username" placeholder="Username" v-model="username"/>
        <label for="username">Username</label>
      </div>
      <div class="field-description" :class="{invalid: $v.username.$error}">
        * display name (4 - 50 chars)
      </div>
      <div class="form__field white">
        <input id="signup-password" type="password" placeholder="Password" v-model="password"/>
        <label for="signup-password">Password</label>
      </div>
      <div class="field-description" :class="{invalid: $v.password.$error}">
        * min 8 chars, lower and upper case letter, special character
        <fa :icon="fa.faInfoCircle" title="Accepted: !@#$%^&*()_+}{;'?>.<,"></fa>
      </div>
      <div class="form__field white">
        <input id="signup-confirm-password" v-model="confirmPassword" type="password" placeholder="Confirm password"/>
        <label for="signup-confirm-password">Confirm password</label>
      </div>
      <div class="field-description" :class="{invalid: $v.confirmPassword.$error}">
        * must match password
      </div>
      <hr style="border: none;">
      <div class="form__checkbox classic" white :class="{invalid: $v.terms.$error}">
        <input id="terms" type="checkbox" v-model="terms">
        <label for="terms">I accept the
          <a href="/legal/terms" target="_blank">terms of use</a>
        </label>
      </div>
      <div class="form__checkbox classic" white :class="{invalid: $v.privacy.$error}">
        <input id="privacy" type="checkbox" v-model="privacy">
        <label for="privacy">I accept the
          <a href="/legal/privacy" target="_blank">privacy agreement</a>
        </label>
      </div>
      <div class="form__button">
        <button class="info" :disabled="loading" :class="{loading: loading}">
          <span v-if="!loading">Sign up</span>
          <Spinner v-if="loading" type="info"/>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
    import Spinner from '~/components/ui/Spinner.vue';
    import { email, maxLength, minLength, required, sameAs } from 'vuelidate/lib/validators';
    import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

    export default {
        components: {
            Spinner,
        },
        computed: {
            fa () {
                return {
                    faInfoCircle,
                };
            },
            signUp () {
                return this.$store.state.signUp;
            },
        },
        data () {
            return {
                confirmPassword: '',
                email: '',
                password: '',
                username: '',
                terms: false,
                privacy: false,
                loading: false,
            };
        },
        methods: {
            async register () {
                this.$v.$touch();

                if (this.$v.$invalid) {
                    return;
                }

                try {
                    this.loading = true;

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

                    this.loading = false;

                    if (result.error) {
                        if (result.error.code === 204) {
                            this.$alert('Email address or username already taken. Please try different values.', null, 'info');
                        } else {
                            console.log(result.error.message);
                            this.$alert('Error during registration, try again later or contact us if the error persists', null, 'error');
                        }

                        return;
                    }

                    this.$alert(
                        'Sign up successful! An Administrator has been informed and will activate your account as soon as possible. Maybe we will send you an email which you have to answer.',
                        'Congratulations',
                        'success',
                        {
                            allowOutsideClick: false,
                        },
                    );

                    this.email = '';
                    this.password = '';

                    this.closeSignUpForm();
                } catch (e) {
                    this.$alert('The following error occurred: ' + e.message, null, 'error');
                }
            },
            closeSignUpForm () {
                this.email = '';
                this.password = '';
                this.confirmPassword = '';
                this.username = '';
                this.terms = false;
                this.privacy = false;
                this.$v.$reset();

                this.loading = false;

                this.$store.commit('showBackdrop', false);
                this.$store.commit('showSignUp', false);
            },
        },
        validations: {
            confirmPassword: {
                required,
                sameAsPassword: sameAs('password'),
            },
            email: {
                email,
                maxLength: maxLength(128),
                required,
            },
            password: {
                minLength: minLength(8),
                strongPassword (password) {

                    // Directus rules for strong passwords
                    return /(?=^.{8,}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+}{';'?>.<,])(?!.*\s).*$/.test(password);
                },
            },
            privacy: {
                sameAs: sameAs(() => true),
            },
            terms: {
                sameAs: sameAs(() => true),
            },
            username: {
                maxLength: maxLength(50),
                minLength: minLength(4),
                required,
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

    hr {
      margin: 1rem 0;
    }

    button.info {
      width: 100px;
      height: 36px;

      &.loading {
        font-size: 1.3rem;
      }
    }

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

      &.invalid,
      &.invalid a {
        color: red;
        font-weight: bold;
      }
    }

    .field-description {
      font-size: 0.6rem;

      &.invalid {
        font-weight: bold;
        color: red;
      }
    }
  }
</style>
