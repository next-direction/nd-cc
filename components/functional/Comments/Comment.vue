<template>
  <div class="comments__container">
    <div class="comments__icon">
      <fa :icon="fa.faReply" rotation="180"></fa>
    </div>
    <div class="comments__comment" v-if="!editMode">
      <span class="comments__comment-content" v-html="details.content.blocks[0].data.text"></span>
      <span class="comments__comment-creator">
        -- {{details.created_by.last_name}} at {{details.created_on | formatDate}}
        <span class="comments__comment-edited" v-if="details.created_on !== details.modified_on">
          <fa :icon="fa.faPen" :title="'edited by ' + details.modified_by.last_name + ' at ' + $filters.formatDate(details.modified_on)"></fa>
        </span>
        <span class="comments__comment-edit" v-if="+details.created_by.id === +user.id" @click="editMode = true">Edit</span>
      </span>
    </div>
    <CommentForm v-if="editMode" @cancelForm="editMode = false" @pageSaved="updateComment" :defaultData="details.content" :commentId="details.id"/>
  </div>
</template>

<script>
    import CommentForm from '~/components/functional/Comments/CommentForm.vue';
    import { faPen, faReply } from '@fortawesome/free-solid-svg-icons';

    export default {
        components: {
            CommentForm,
        },
        computed: {
            fa () {
                return {
                    faPen,
                    faReply,
                };
            },
            user () {
                return this.$store.state.user ? this.$store.state.user : {};
            },
        },
        created () {
            this.$store.subscribe(async (mutation) => {
                if (mutation.type === 'toggleUserStateChange') {
                    if (!this.$store.state.user) {
                        this.editMode = false;
                    }
                }
            });
        },
        data () {
            return {
                editMode: false,
            };
        },
        methods: {
            updateComment (editedComment) {
                this.editMode = false;
                this.$store.commit('page/updateComment', editedComment);
            },
        },
        props: ['details'],
    };
</script>

<style lang="scss" scoped>
  .comments__container {
    display: flex;

    &:not(:last-child) {
      margin-bottom: 0.4rem;
    }

    .comments__icon {
      padding: 0.4rem;
      color: $gray-light;
    }

    .comments__comment {
      flex: 1;
      background: #f3f3f3;
      padding: 0.4rem;
      border-radius: $border-radius;
      font-size: 0.9rem;

      line-height: 1.4rem;

      &-creator {
        font-size: 0.7rem;
        color: $gray-dark;
        white-space: nowrap;

        .comments__comment-edited {
          margin-left: 0.4rem;
        }

        .comments__comment-edit {
          margin-left: 0.6rem;
          font-size: 0.85rem;
          display: none;
          color: $main-color;

          &:hover {
            cursor: pointer;
            text-decoration: underline;
          }
        }
      }

      &:hover {
        .comments__comment-edit {
          display: inline;
        }
      }
    }

  }

</style>
