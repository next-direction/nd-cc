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
      <Question :details="details" v-if="!editMode" @edit="editMode = true"/>
      <PageForm
        v-if="editMode"
        :showCancel="true"
        @cancelForm="cancelEditMode"
        @pageSaved="updatePage"
        :category="'' + details.category.id"
        :defaultTitle="details.title"
        :defaultData="details.content"
        @updateSaved="updateEditSaved"
        :pageId="+details.id"
      />
      <Answers :details="details" @updateChild="updateChild" :accepted="hasAcceptedAnswer"/>
      <NewAnswer :details="details" @pageSaved="showSavedPage" @updateSaved="updateSaved"/>
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
            + 'children.*,children.created_by.last_name,children.created_by.id,children.modified_by.last_name,children.modified_on',
            {
                headers,
            },
        );

        const { data: pageData } = await categoryResponse.json();

        return pageData;
    };

    export default {
        async asyncData ({ app, env, params }) {
            return {
                details: await fetchPage(app, env.baseUrl, params.page),
            };
        },
        components: {
            Answers,
            NewAnswer,
            PageForm,
            Question,
        },
        computed: {
            fa () {
                return {
                    faArrowCircleLeft,
                };
            },
            hasAcceptedAnswer () {
                return this.details.children.some(child => child.accepted);
            },
        },
        created () {
            this.$store.subscribe(async (mutation) => {
                if (mutation.type === 'toggleUserStateChange') {
                    if (!this.$store.state.user && 'draft' === this.details.status) {
                        this.$router.push('/');
                    }
                }
            });

            this.$nuxt.$on('toggleAnswerAccept', answer => {
                if (this.acceptRequestRunning) {
                    return;
                }

                this.acceptRequestRunning = true;

                const promises = this.details.children.map(async child => {
                    if (child.id === answer.id) {
                        const data = {
                            accepted: !child.accepted,
                        };

                        try {
                            await fetch(`${this.$store.state.baseUrl}/items/page/${child.id}?fields=id`, {
                                method: 'PATCH',
                                body: JSON.stringify(data),
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + this.$cookies.get('token'),
                                },
                            });

                            child.accepted = !child.accepted;
                        } catch (e) {
                            alert(e.message);
                        }

                    }

                    return child;
                });

                Promise.all(promises).then(children => {
                    this.details.children = children;
                    this.acceptRequestRunning = false;
                }).catch(e => alert(e.message));
            });
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
            showSavedPage (page) {
                this.details.children.push(page);
            },
            updateChild (page) {
                this.details.children = this.details.children.map(child => {
                    return child.id === page.id ? page : child;
                });
            },
            updateEditSaved (saved) {
                this.editSaved = saved;
            },
            updatePage (page) {
                this.details.title = page.title;
                this.details.content = page.content;
                this.details.modified_by = page.modified_by;
                this.details.modified_on = page.modified_on;
                this.editMode = false;
            },
            updateSaved (saved) {
                this.saved = saved;
            },
        },
        beforeRouteLeave (to, from, next) {
            if ((this.saved && this.editSaved) || window.confirm('Do you really want to leave? You have unsaved changes!')) {
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
