<template>
  <div class="detail-page">
    <nav>
      <h1>
        <span class="back-link" @click="goBack" title="Go back">
          <fa :icon="fa.faArrowCircleLeft"></fa>
        </span>
      </h1>
    </nav>
    <div>
      <section class="details">
        <h1>
          {{ details.title }}
        </h1>
        <p class="meta">
          Created by <strong>{{ details.created_by.last_name }}</strong> on <strong>{{ details.created_on }}</strong> in <strong>{{ getCategoryTree(details.category.id) }}</strong>
        </p>
        <section class="content">
          <template v-for="block in details.content.blocks">
            <component :is="$options.filters.ucfirst(block.type) + 'Element'" :content="block.data"/>
          </template>
        </section>
      </section>
      <section class="answers" v-if="details.children.length">
        <div class="answers__count">
          <h4>{{ details.children.length }} answer(s)</h4>
        </div>
        <template v-for="child in details.children">
          <hr>
          <div class="answers__answer">
            {{ child.id }}
          </div>
        </template>
      </section>
      <section class="answer" v-if="user && details.status !== 'draft'">
        <hr>
        <h4>New answer</h4>
        <PageForm :onlyEditor="true" :category="'' + details.category.id" :parent="details.id" :defaultTitle="getDefaultTitle()" @updateSaved="updateSaved"/>
      </section>
    </div>
  </div>
</template>

<script>
    import PageForm from '~/components/functional/PageForm.vue';
    import CodeElement from '~/components/content/CodeElement.vue';
    import DelimiterElement from '~/components/content/DelimiterElement.vue';
    import HeaderElement from '~/components/content/HeaderElement.vue';
    import ImageElement from '~/components/content/ImageElement.vue';
    import ListElement from '~/components/content/ListElement.vue';
    import ParagraphElement from '~/components/content/ParagraphElement.vue';
    import QuoteElement from '~/components/content/QuoteElement.vue';
    import TableElement from '~/components/content/TableElement.vue';
    import WarningElement from '~/components/content/WarningElement.vue';
    import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';

    const fetchPage = async (app, baseUrl, pageId) => {
        const headers = {
            'Content-Type': 'application/json',
        };

        if (app.$cookies.get('token')) {
            headers['Authorization'] = 'Bearer ' + app.$cookies.get('token');
        }

        const categoryResponse = await fetch(baseUrl + '/items/page/' + pageId + '?fields=*,created_by.last_name,category.id,children.id', {
            headers,
        });

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
            PageForm,
            CodeElement,
            DelimiterElement,
            HeaderElement,
            ImageElement,
            ListElement,
            ParagraphElement,
            QuoteElement,
            TableElement,
            WarningElement,
        },
        computed: {
            fa () {
                return {
                    faArrowCircleLeft,
                };
            },
            user () {
                return this.$store.state.user;
            },
        },
        created () {
            this.$store.subscribe(async (mutation) => {
                if (mutation.type === 'toggleUserStateChange') {
                    if (!this.$store.state.user) {
                        this.$router.push('/');
                    }
                }
            });
        },
        data () {
            return {
                saved: true,
            };
        },
        methods: {
            getDefaultTitle () {
                return `answer-${this.details.id}-${Math.floor(Date.now() / 1000)}`;
            },
            getCategoryTree (categoryId) {
                return this.$store.getters.getTextBreadcrumb(categoryId);
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
            async updateSaved (saved) {
                this.saved = saved;

                if (saved) {
                    this.details = await fetchPage(this, this.$store.state.baseUrl, this.$route.params.page);
                }
            },
        },
        beforeRouteLeave (to, from, next) {
            if (this.saved || window.confirm('Do you really want to leave? You have unsaved changes!')) {
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

    .answers {
      hr {
        margin: 1rem 0;
        border: none;
        border-bottom: 1px solid $main-light;
      }

      &__count {
        margin-top: 2rem;
      }

      &__answer {
        padding: 0 0 0 2rem;
      }
    }

    .answer {
      hr {
        margin-top: 2rem;
        margin-bottom: 1rem;
        border: none;
        border-bottom: 2px solid $main-light;
      }
    }
  }

  .details {
    flex: 1;

    .content {
      margin-top: 2rem;
    }

    .meta {
      margin: 1rem 0;
      color: grey;
      font-size: 0.8rem;
    }
  }

  .back-link {
    cursor: pointer;
    margin-right: 2rem;
  }
</style>
