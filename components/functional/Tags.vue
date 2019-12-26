<template>
  <div class="tag-container">
    <span class="label">Tags <fa :icon="fa.faInfoCircle" class="infoIcon" title="Tags are unified on save to allow search: alphabetical order, lowercase, no spaces"></fa></span>
    <div class="add-container">
      <div class="form__field">
        <input ref="newTag" id="addTag" placeholder="Add tag" v-model="newTag" @keypress.enter.prevent="addTag"/>
        <label for="addTag">Add tag</label>
      </div>
      <button type="button" class="primary" @click="addTag">Add</button>
    </div>
    <div class="tags" v-if="tags.length">
      <span class="tag" v-for="tag in tags">{{ tag }} <a class="remove-link" @click.prevent="removeTag(tag)" title="Remove tag">x</a></span>
    </div>
  </div>
</template>

<script>
    import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

    export default {
        computed: {
            fa () {
                return {
                    faInfoCircle,
                };
            },
        },
        data () {
            return {
                tags: this.value,
                newTag: '',
            };
        },
        methods: {
            addTag () {
                const tag = this.$refs.newTag.value.trim();

                if ('' !== tag && !this.tags.includes(tag)) {
                    this.tags.push(tag);
                }

                this.newTag = '';
                this.$emit('input', this.tags);
            },
            removeTag (tagToRemove) {
                this.tags = this.tags.filter(tag => tag !== tagToRemove);
            },
        },
        props: ['value'],
    };
</script>

<style lang="scss" scoped>
  .tag-container {
    margin-top: 1rem;
    background: $main-bg;
    border-radius: $border-radius;
    padding: 0.6rem;
  }

  .add-container {
    display: flex;

    button {
      align-self: flex-end;
      margin-bottom: 1rem;
      margin-left: 0.6rem;
    }
  }

  .label {
    color: $main-color;
  }

  input {
    width: 14rem;
  }

  .infoIcon {
    color: $info-dark;
    margin-left: 0.6rem;
  }

  .tags {
    margin: 0.4rem 0;
  }

  .tag {
    background: $main-color;
    color: white;
    border-radius: $border-radius;
    font-size: 0.7rem;
    padding: 0.3rem;
    display: inline-block;
    margin-right: 0.2rem;

    .remove-link {
      margin-left: 0.4rem;
      cursor: pointer;
      color: white;
      font-weight: bold;
    }
  }
</style>
