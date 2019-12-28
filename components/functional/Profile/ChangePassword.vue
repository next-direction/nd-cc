<template>
  <div class="form">
    <p><strong>Change password</strong></p>
    <div class="form__field inline">
      <input id="change-password" type="password" placeholder="Password" v-model="newPassword"/>
      <label for="change-password">Password</label>
    </div>
    <div class="form__field inline">
      <input id="change-confirm-password" type="password" placeholder="Confirm password" v-model="confirmPassword"/>
      <label for="change-confirm-password">Confirm password</label>
    </div>
    <br>
    <div class="form__button inline">
      <button class="success save" :disabled="loading" :class="{loading: loading}" @click="changePassword">
        <span v-if="!loading">Change</span>
        <Spinner v-if="loading" type="success"/>
      </button>
    </div>
    <div class="form__button inline">
      <button class="gray" @click="$emit('cancel')">Cancel</button>
    </div>
  </div>
</template>

<script>
    import Spinner from '~/components/ui/Spinner';

    export default {
        components: {
            Spinner,
        },
        computed: {
            user () {
                return this.$store.state.user;
            },
        },
        data () {
            return {
                loading: false,
                newPassword: '',
                confirmPassword: '',
            };
        },
        methods: {
            changePassword () {
                if (this.newPassword.trim() !== '' && this.confirmPassword.trim() !== '') {

                    if (this.newPassword === this.confirmPassword) {

                        if (this.newPassword.length < 8) {
                            this.$alert('Password must be at least 8 characters', null, 'warning');
                            return;
                        }

                        this.loading = true;

                        fetch(`${this.$store.state.baseUrl}/users/${this.user.id}`, {
                            method: 'PATCH',
                            body: JSON.stringify({ password: this.newPassword }),
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + this.$cookies.get('token'),
                            },
                        }).then((res) => {
                            return res.json();
                        }).then(result => {
                            this.loading = false;

                            if (result.error) {
                                throw new Error(result.error.message);
                            } else {

                                this.newPassword = '';
                                this.confirmPassword = '';
                                this.$emit('cancel');
                                this.$alert('Password changed', null, 'success');
                            }
                        }).catch(e => {
                            this.loading = false;
                            this.$alert('Error during change: ' + e.message, null, 'error');
                        });
                    } else {
                        this.$alert('Passwords must match', null, 'info');
                    }
                }
            },
        },
    };
</script>

<style lang="scss" scoped>
  .form__field.inline {
    display: inline-block;
    width: 200px;
  }

  .form__button.inline {
    display: inline-block;
    padding: 0;
  }

  button {
    height: 2.4rem;

    &.save {
      font-size: 1rem;
      width: 6rem;
    }
  }
</style>
