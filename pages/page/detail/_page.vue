<template>
  <div class="detail-page">
    <nav>
      <h1>
        <span class="back-link" @click="goBack" title="Go back">
          <fa :icon="fa.faArrowCircleLeft"></fa>
        </span>
      </h1>
    </nav>
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
  </div>
</template>

<script>
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

    export default {
        async asyncData ({ app, env, params }) {
            const headers = {
                'Content-Type': 'application/json',
            };

            if (app.$cookies.get('token')) {
                headers['Authorization'] = 'Bearer ' + app.$cookies.get('token');
            }

            const categoryResponse = await fetch(env.baseUrl + '/items/page/' + params.page + '?fields=*,created_by.last_name,category.id', {
                headers,
            });

            const { data: pageData } = await categoryResponse.json();

            return {
                details: pageData,
            };
        },
        components: {
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
        },
        created () {
            this.$store.subscribe(async (mutation) => {
                if (mutation.type === 'toggleUserStateChange') {
                    if (!this.$store.state.user) {
                        // TODO: some redirect if status is "draft" and no user is set
                    }
                }
            });
        },
        methods: {
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
