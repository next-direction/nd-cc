<template>
  <div class="comments">
    <div class="comments__comment">
      <Comment :details="comment" v-for="comment in comments" :key="comment.id"/>
    </div>
    <div class="comments__add" v-if="user && !addMode">
      <span class="add" @click="addMode = true">Add comment</span>
    </div>
    <CommentForm v-if="addMode" :pageId="pageId" @cancelForm="addMode = false" @pageSaved="addComment"/>
  </div>
</template>

<script>
    import Comment from '~/components/functional/Comments/Comment.vue';
    import CommentForm from '~/components/functional/Comments/CommentForm.vue';

    export default {
        components: {
            Comment,
            CommentForm,
        },
        computed: {
            user () {
                return this.$store.state.user;
            },
        },
        created () {
            this.$store.subscribe(async (mutation) => {
                if (mutation.type === 'toggleUserStateChange') {
                    if (!this.$store.state.user) {
                        this.addMode = false;
                    }
                }
            });
        },
        data () {
            return {
                addMode: false,
            };
        },
        methods: {
            addComment (comment) {
                this.addMode = false;
                this.$store.commit('page/addComment', comment);
            },
        },
        props: ['comments', 'pageId'],
    };
</script>

<style lang="scss" scoped>
  .comments__add {
    padding: 0.4rem 0;
    font-size: 0.8rem;

    .add {
      color: $gray-dark;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
  }
</style>
