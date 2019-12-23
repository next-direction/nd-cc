<template>
  <div class="create-page">
    <nav>
      <h1>
        <span class="back-link" @click="goBack" title="Go back">
          <fa :icon="fa.faArrowCircleLeft"></fa>
        </span>
      </h1>
    </nav>
    <section class="content">
      <h1>
        <span>
          Create new topic
        </span>
      </h1>
      <section class="category">
        <span><fa :icon="fa.faLevelUpAlt" rotation="90"></fa> in category</span>
        <RecursiveSelect :options="categoryOptions" v-model="category" @change="updateCategory"/>
      </section>
      <PageForm :category="category" @updateSaved="updateSaved"/>
    </section>
  </div>
</template>

<script>
    import PageForm from '~/components/functional/PageForm.vue';
    import RecursiveSelect from '~/components/ui/RecursiveSelect.vue';
    import { faArrowCircleLeft, faLevelUpAlt } from '@fortawesome/free-solid-svg-icons';

    export default {
        data () {
            return {
                category: this.$route.params.category,
                saved: true,
            };
        },
        components: {
            PageForm,
            RecursiveSelect,
        },
        computed: {
            fa () {
                return {
                    faArrowCircleLeft,
                    faLevelUpAlt,
                };
            },
            categoryOptions () {
                return this.$store.getters.getCategoryOptions();
            },
        },
        methods: {
            goBack () {
                const forwardTarget = this.$store.state.forwardTarget;

                if (forwardTarget) {
                    this.$store.commit('setForwardTarget', '');
                    this.$router.push(forwardTarget);
                } else {
                    this.$router.back();
                }
            },
            updateCategory (event) {
                this.category = event.target.value;
            },
            updateSaved (saved) {
                this.saved = saved;
            },
        },
        middleware: 'guard',
        created () {
            this.$store.subscribe(async (mutation) => {
                if (mutation.type === 'toggleUserStateChange') {
                    if (!this.$store.state.user) {
                        this.$router.push('/');
                    }
                }
            });
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
  .create-page {
    width: 90%;
    max-width: 850px;
    padding: 2rem;
    display: flex;
  }

  .content {
    flex: 1;
  }

  .category {
    display: block;
    margin: 1rem 0;
    background: $main-bg;
    padding: 0.6rem 1rem;
    color: $main-color;

    select {
      margin-left: 0.4rem;
      padding: 0.4rem;
      border: 1px solid $main-color;
      border-radius: $border-radius;
    }

    span > svg {
      margin-right: 0.4rem;
    }
  }

  .back-link {
    cursor: pointer;
    margin-right: 2rem;
  }
</style>
