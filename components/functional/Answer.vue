<template>
  <div>
    <div class="answers__answer-container" :class="{ acceptedAnswer: details.accepted }" v-if="!editMode">
      <div class="answers__options">
        <fa :icon="fa.faCheck" v-if="details.accepted" class="acceptedIcon" title="Remove acceptance" @click="toggleAccept(details)"></fa>
        <fa :icon="fa.faCheck" v-if="!details.accepted && !accepted" class="acceptIcon" title="Accept this answer" @click="toggleAccept(details)"></fa>
      </div>
      <div class="answers__answer">
        <Blocks :blocks="details.content.blocks"/>
        <div class="answer__footer">
          <p class="answer__footer-actions" v-if="editable">
            <button type="button" class="gray small" @click="editMode = true">Edit</button>
          </p>
          <p class="answer__footer-meta">
            Answered by <strong>{{ details.created_by.last_name }}</strong> at <strong>{{ details.created_on | formatDate }}</strong>
            <span class="meta--modified" v-if="details.created_on !== details.modified_on">
              Modified by <strong>{{ details.modified_by.last_name }}</strong> at <strong>{{ details.modified_on | formatDate }}</strong>
            </span>
          </p>
        </div>
      </div>
    </div>

    <div class="answers__answer-edit" v-if="editMode">
      <PageForm
        :onlyEditor="true"
        :showCancel="true"
        @cancelForm="cancelEditMode"
        @pageSaved="updatePage"
        :category="'' + details.category.id"
        :defaultTitle="details.title"
        :defaultData="details.content"
        @updateSaved="updateEditSaved"
        :pageId="+details.id"
      />
    </div>
  </div>
</template>

<script>
    import Blocks from '~/components/content/Blocks.vue';
    import PageForm from '~/components/functional/PageForm.vue';
    import { faCheck } from '@fortawesome/free-solid-svg-icons';

    export default {
        beforeRouteLeave (to, from, next) {
            if (this.editSaved || window.confirm('Do you really want to leave? You have unsaved changes!')) {
                next();
            } else {
                next(false);
            }
        },
        components: {
            Blocks,
            PageForm,
        },
        computed: {
            editable () {
                return this.$store.state.user && +this.$store.state.user.id === +this.details.created_by.id;
            },
            fa () {
                return {
                    faCheck,
                };
            },
        },
        data () {
            return {
                editMode: false,
                editSaved: true,
            };
        },
        methods: {
            cancelEditMode () {
                this.editMode = false;
            },
            toggleAccept (answer) {
                this.$nuxt.$emit('toggleAnswerAccept', answer);
            },
            updateEditSaved (saved) {
                this.editSaved = saved;
            },
            updatePage (page) {
                this.$emit('updateChild', page);
                this.editSaved = true;
                this.editMode = false;
            },
        },
        props: ['accepted', 'details'],
    };
</script>

<style lang="scss" scoped>
  .answers {
    hr {
      margin: 1rem 0;
      border: none;
      border-bottom: 1px solid $main-light;
    }

    .acceptedAnswer {
      background: $success-light;
    }

    .answers__answer-container {
      display: flex;
      padding-right: 0.6rem;

      .answers__options {
        flex: 0 0 3rem;
        padding: 0.6rem;

        display: flex;
        flex-direction: column;
        align-items: center;

        .acceptedIcon {
          color: $success-dark;
          font-size: 1.6rem;
          cursor: pointer;
        }

        .acceptIcon {
          color: $gray-dark;
          font-size: 1.6rem;
          cursor: pointer;
        }
      }
    }

    &__count {
      margin-top: 2rem;
    }

    &__answer {
      flex: 1;

      .answer__footer {
        display: flex;
        align-items: center;
        justify-content: space-between;

        &-meta {
          flex: 1;
          margin: 1rem 0;
          color: grey;
          font-size: 0.8rem;
          text-align: right;

          .meta--modified {
            display: block;
          }
        }
      }
    }
  }
</style>
