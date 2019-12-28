<template>
  <div class="profile__details-avatar">
    <span class="user-image" :style="{backgroundImage: 'url(' + avatar + ')'}" v-if="avatar"></span>
    <span class="user-image" style="background-image: url(/images/no-user.svg)" v-else></span>
    <div class="avatar__change">
      <label for="changeAvatar" class="primary small" ref="changeAvatarLabel">
        <button class="primary small" @click="selectFile">Change avatar</button>
        <fa :icon="fa.faInfoCircle" title="Only jpg, jpeg, png and gif up to 200kB are supported"></fa>
      </label>
      <input type="file" id="changeAvatar" ref="changeAvatar" accept=".jpg,.jpeg,.png,.gif">
    </div>
  </div>
</template>

<script>
    import uuid4 from 'uuid/v4';
    import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

    export default {
        computed: {
            avatar () {
                return this.$store.getters.getFullAvatar;
            },
            fa () {
                return {
                    faInfoCircle,
                };
            },
            user () {
                return this.$store.state.user ? this.$store.state.user : {};
            },
        },
        methods: {
            selectFile () {
                this.$refs.changeAvatarLabel.click();
            },
        },
        mounted () {
            const file = this.$refs.changeAvatar;

            file.addEventListener('change', async e => {
                const selectedFile = e.target.files.length ? e.target.files[0] : null;

                if (selectedFile) {
                    if (!['image/png', 'image/jpg', 'image/jpeg', 'image/gif'].includes(selectedFile.type)) {
                        this.$alert('This file type is not supported', null, 'warning');
                        return;
                    }

                    if (selectedFile.size / 1024 > 200) {
                        this.$alert('This file is too big', null, 'warning');
                        return;
                    }

                    try {
                        const reader = new FileReader();

                        const content = await new Promise((resolve, reject) => {
                            reader.onloadend = function () {

                                if (reader.error) {
                                    reject(reader.error.message);
                                } else {
                                    resolve(reader.result);
                                }
                            };

                            reader.readAsDataURL(selectedFile);
                        });

                        const base64 = content.replace(/^data:(.*,)?/, '');
                        const extension = selectedFile.name.split('.').pop();
                        const data = {
                            data: base64,
                            filename_download: selectedFile.name,
                            filename_disk: uuid4() + '.' + extension,
                        };

                        if (this.user.avatar) { // edit existing file
                            const { data: updatedFile } = await fetch(`${this.$store.state.baseUrl}/files/${this.user.avatar.id}?fields=*`, {
                                method: 'PATCH',
                                body: JSON.stringify(data),
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + this.$cookies.get('token'),
                                },
                            }).then(res => res.json());

                            this.$store.commit('setAvatar', updatedFile[0]);
                        } else { // create new file and link to user
                            const { data: uploadedFile } = await fetch(`${this.$store.state.baseUrl}/files?fields=*`, {
                                method: 'POST',
                                body: JSON.stringify(data),
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + this.$cookies.get('token'),
                                },
                            }).then(res => res.json());

                            fetch(`${this.$store.state.baseUrl}/users/${this.user.id}`, {
                                method: 'PATCH',
                                body: JSON.stringify({ avatar: uploadedFile.id }),
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + this.$cookies.get('token'),
                                },
                            });

                            this.$store.commit('setAvatar', uploadedFile);
                        }
                    } catch (e) {
                        this.$alert('Error during processing the image: ' + e.message, null, 'error');
                        return;
                    }
                }

                file.value = '';
            });
        },
    };
</script>

<style lang="scss" scoped>
  .profile__details-avatar {
    display: flex;
    flex-direction: column;
    align-items: center;

    .user-image {
      height: 8rem;
      width: 8rem;
      border-radius: 50%;
      overflow: hidden;
      background-size: cover;
      display: inline-block;
    }

    .avatar__change {
      margin-top: 1rem;

      label {
        display: flex;
        align-items: center;

        button {
          margin-right: 0.4rem;
        }

        svg {
          color: $info-dark;
        }
      }

      #changeAvatar {
        display: none;
      }
    }
  }
</style>
