<template>
  <div class="detail-page">
    <nav>
      <h1>
        <span class="back-link" @click="goBack" title="Go back">
          <fa :icon="fa.faArrowCircleLeft"></fa>
        </span>
      </h1>
    </nav>
    <div class="detail-page-content">
      <Question v-if="!editMode" @edit="editMode = true"/>
      <PageForm
        v-if="editMode"
        :showCancel="true"
        @cancelForm="cancelEditMode"
        @pageSaved="updatePage"
        @updateSaved="updateEditSaved"
        :category="'' + details.category.id"
        :defaultTitle="details.title"
        :defaultData="details.content"
        :defaultTags="details.tags"
        :pageId="+details.id"
      />
      <Answers/>
      <NewAnswer @updateSaved="updateSaved"/>
    </div>
  </div>
</template>

<script>
    import Answers from '~/components/functional/Answers';
    import NewAnswer from '~/components/functional/NewAnswer';
    import PageForm from '~/components/functional/PageForm.vue';
    import Question from '~/components/functional/Question';
    import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';

    const fetchPage = async (app, baseUrl, pageId) => {
        const headers = {
            'Content-Type': 'application/json',
        };

        if (app.$cookies.get('token')) {
            headers['Authorization'] = 'Bearer ' + app.$cookies.get('token');
        }

        const categoryResponse = await fetch(
            baseUrl
            + '/items/page/' + pageId + '?fields=*,created_by.last_name,created_by.id,modified_by.last_name,modified_by.id,category.id,'
            + 'children.*,children.created_by.last_name,children.created_by.id,children.modified_by.last_name,children.modified_on,'
            + 'votes.*,children.votes.*,tags,comments.*,comments.created_by.last_name,comments.created_by.id,comments.modified_by.last_name,'
            + 'children.comments.*,children.comments.created_by.last_name,children.comments.created_by.id,children.comments.modified_by.last_name',
            {
                headers,
            },
        );

        const { data: pageData } = await categoryResponse.json();

        return pageData;
    };

    export default {
        async fetch ({ app, env, params, store }) {
            const details = await fetchPage(app, env.baseUrl, params.page);

            store.commit('page/setDetails', details);
        },
        components: {
            Answers,
            NewAnswer,
            PageForm,
            Question,
        },
        computed: {
            details () {
                return this.$store.state.page.details;
            },
            editAnswerActive () {
                return this.$store.getters['page/editAnswerActive'];
            },
            fa () {
                return {
                    faArrowCircleLeft,
                };
            },
        },
        created () {
            this.$store.subscribe(async (mutation) => {
                if (mutation.type === 'toggleUserStateChange') {
                    if (!this.$store.state.user && 'draft' === this.details.status) {
                        this.$router.push('/');
                    } else if (!this.$store.state.user) {
                        this.editMode = false;
                        this.editSaved = true;
                    }
                }
            });

            this.$store.commit('page/clearAnswerEditSaved');
        },
        data () {
            return {
                saved: true,
                editSaved: true,
                editMode: false,
                acceptRequestRunning: false,
            };
        },
        methods: {
            cancelEditMode () {
                this.editMode = false;
                this.editSaved = true;
            },
            goBack () {
                const forwardTarget = this.$store.state.forwardTarget;

                if (forwardTarget) {
                    this.$store.commit('setForwardTarget', '');
                    this.$router.push(forwardTarget);
                } else {
                    this.$router.back();
                }
            },
            updateEditSaved (saved) {
                this.editSaved = saved;
            },
            updatePage (page) {
                this.$store.commit('page/updatePage', page);
                this.editMode = false;
            },
            updateSaved (saved) {
                this.saved = saved;
            },
        },
        beforeRouteLeave (to, from, next) {
            if ((this.saved && this.editSaved && !this.editAnswerActive) || window.confirm('Do you really want to leave? You have unsaved changes!')) {
                next();
            } else {
                next(false);
            }
        },
    };
</script>

<style lang="scss" scoped>
  .detail-page {
    width: 90%;
    max-width: 850px;
    padding: 2rem;
    display: flex;
  }

  .detail-page-content {
    flex: 1;
  }

  .back-link {
    cursor: pointer;
    margin-right: 2rem;
  }
</style>
