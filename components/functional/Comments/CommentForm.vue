<template>
  <form @submit.prevent="defaultData && Object.keys(defaultData).length ? updatePage() : savePage()" class="comment-form">
    <div class="editor-container">
      <div class="editor-comment-content" :id="editorId"></div>
    </div>
    <div class="form__button condensed">
      <button class="success small" :disabled="loading">Save</button>
      <button type="button" class="gray small" @click="$emit('cancelForm')">Cancel</button>
    </div>
  </form>
</template>

<script>
    import uuid4 from 'uuid/v4';

    export default {
        data () {
            return {
                loading: false,
                editorId: null,
            };
        },
        props: {
            defaultData: {
                type: Object,
                default: () => {},
            },
            pageId: {
                type: Number,
                default: 0,
            },
            commentId: {
                type: Number,
                default: 0,
            },
            placeholder: {
                type: String,
                default: 'Type your comment here',
            },
        },
        methods: {
            async savePage () {
                const data = {
                    content: await this.editor.save(),
                    page: this.pageId,
                };

                if (!data.content.blocks.length) {
                    this.$alert('Please enter some content!', null, 'warning');
                    return;
                }

                try {
                    this.loading = true;

                    const res = await fetch(this.$store.state.baseUrl + '/items/comment?fields=*,created_by.last_name,created_by.id', {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + this.$cookies.get('token'),
                        },
                    });
                    const { data: newComment } = await res.json();

                    this.loading = false;

                    if (newComment && newComment.id) {
                        this.$emit('pageSaved', newComment);
                    } else {
                        this.$alert('Error during save, please try again later!', null, 'error');
                    }
                } catch (e) {
                    this.$alert('The following error occurred: ' + e.message, null, 'error');
                }
            },
            async updatePage () {
                const data = {
                    content: await this.editor.save(),
                };

                if (!data.content.blocks.length) {
                    this.$alert('Please enter some content!', null, 'warning');
                    return;
                }

                try {
                    this.loading = true;

                    const res = await fetch(`${this.$store.state.baseUrl}/items/comment/${this.commentId}?fields=*,created_by.last_name,created_by.id,modified_by.last_name`, {
                        method: 'PATCH',
                        body: JSON.stringify(data),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + this.$cookies.get('token'),
                        },
                    });
                    const { data: editedComment } = await res.json();

                    this.loading = false;

                    this.$emit('pageSaved', editedComment);
                } catch (e) {
                    this.$alert('The following error occurred: ' + e.message, null, 'error');
                }
            },
            initEditor () {
                const ImageTool = window.ImageTool;

                this.editor = new EditorJS({
                    /**
                     * Id of Element that should contain Editor instance
                     */
                    holder: this.editorId,
                    data: this.defaultData,
                    placeholder: this.placeholder,
                    logLevel: 'ERROR',
                    tools: {
                        paragraph: {
                            class: SimpleParagraph,
                            inlineToolbar: true,
                        },
                        Marker: {
                            class: Marker,
                        },
                        inlineCode: {
                            class: InlineCode,
                        },
                    },
                });
            },
        },
        mounted () {
            this.editorId = uuid4();
            let script;

            if (!document.getElementById('editorJsScript')) {
                script = document.createElement('script');
                script.setAttribute('src', '/editorjs/editorjs.js');
                script.setAttribute('id', 'editorJsScript');
                document.head.appendChild(script);

                script = document.createElement('script');
                script.setAttribute('src', '/editorjs/paragraph.js');
                document.head.appendChild(script);

                script = document.createElement('script');
                script.setAttribute('src', '/editorjs/marker.js');
                script.setAttribute('async', 'true');
                document.head.appendChild(script);

                script = document.createElement('script');
                script.setAttribute('src', '/editorjs/inline-code.js');
                script.setAttribute('async', 'true');
                document.head.appendChild(script);
            }

            if (!document.getElementById('editorJsSimple')) {
                script = document.createElement('script');
                script.setAttribute('src', '/editorjs/simple-paragraph.js');
                script.setAttribute('async', 'true');
                script.setAttribute('id', 'editorJsSimple');
                document.head.appendChild(script);
            }

            const interval = setInterval(() => {
                if (
                    'undefined' !== typeof EditorJS
                    && 'undefined' !== typeof Paragraph
                    && 'undefined' !== typeof SimpleParagraph
                    && 'undefined' !== typeof Marker
                    && 'undefined' !== typeof InlineCode
                ) {
                    clearInterval(interval);
                    this.initEditor();
                }
            }, 10);
        },
    };
</script>

<style lang='scss'>
  .comment-form {
    flex: 1;
  }

  .editor-comment-content {
    width: 100%;
    background: #F6F6F6;
    border-radius: $border-radius;
    margin: 10px auto;
    font-size: 0.9rem;

    .ce-block--focused {
      background: #F6F6F6 !important;
    }

    .ce-block__content {
      max-width: none;
    }

    .ce-paragraph.cdx-block {
      padding: 0.4em;
    }

    .ce-toolbar__plus,
    .ce-toolbar__actions,
    .ce-toolbox {
      display: none;
    }

    .cdx-settings-button[data-level='1'] {
      display: none;
    }

    .ce-settings__plugin-zone {
      padding: 3px 2px 0;
    }

    .ce-settings__button {
      margin-right: 0;
    }

    .codex-editor--empty .ce-block .ce-paragraph[data-placeholder]:empty::before {
      cursor: text;
    }
  }

  .editor-comment-content .codex-editor__loader {
    height: 34px;
  }

  .editor-comment-content .codex-editor__redactor {
    padding-bottom: 0px !important;
    position: relative;
  }

  .editor-comment-content .ce-block:first-child {
    border-radius: $border-radius;
  }

  .acceptedAnswer {
    .editor-comment-content {
      background: white;

      .ce-block--focused {
        background: white !important;
      }
    }
  }
</style>
