<template>
  <form @submit.prevent="savePage">
    <div class="form__field" v-show="!onlyEditor">
      <input id="title" placeholder="Title" v-model="title" @input="$emit('updateSaved', false)"/>
      <label for="title">Title<span class="form__field--required"> *</span></label>
    </div>
    <div class="editor-container">
      <span class="content-label" v-if="!onlyEditor">Content<span class="form__field--required"> *</span></span>
      <div id="content-editor"></div>
    </div>
    <div class="form__button">
      <button class="success">Save</button>
    </div>
  </form>
</template>

<script>
    export default {
        data () {
            return {
                title: this.defaultTitle,
            };
        },
        props: {
            category: String,
            defaultTitle: {
                type: String,
                default: '',
            },
            onlyEditor: {
                type: Boolean,
                default: false,
            },
            parent: {
                type: Number,
                default: 0,
            },
        },
        methods: {
            async savePage () {
                const data = {
                    status: 'published',
                    title: this.title,
                    category: this.category,
                    content: await this.editor.save(),
                };

                if (!data.content.blocks.length) {
                    alert('Please enter some content!');
                }

                if (this.parent) {
                    data.parent_page = this.parent;
                }

                const res = await fetch(this.$store.state.baseUrl + '/items/page', {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.$cookies.get('token'),
                    },
                });
                const { data: newPage } = await res.json();

                if (newPage && newPage.id) {
                    if (newPage.parent_page) {
                        this.editor.blocks.clear();

                        // wait, otherwise change event of clearing the blocks will set it to false again
                        setTimeout(() => this.$emit('updateSaved', true), 1000);
                    } else {
                        this.$emit('updateSaved', true);
                        this.$router.push('/page/detail/' + newPage.id);
                    }

                } else {
                    alert('Error during save!');
                }
            },
            initEditor () {
                const ImageTool = window.ImageTool;

                this.editor = new EditorJS({
                    /**
                     * Id of Element that should contain Editor instance
                     */
                    holder: 'content-editor',
                    placeholder: 'Click here to start your topic',
                    onChange: () => {
                        this.$emit('updateSaved', false);
                    },
                    tools: {
                        image: {
                            class: ImageTool,
                            config: {
                                uploader: {
                                    uploadByFile (file) {
                                        const reader = new FileReader();

                                        const promise = new Promise((resolve, reject) => {
                                            reader.onloadend = function () {

                                                if (reader.error) {
                                                    reject(reader.error.message);
                                                } else {
                                                    resolve({
                                                        success: true,
                                                        file: {
                                                            url: reader.result,
                                                        },
                                                    });
                                                }
                                            };

                                            reader.readAsDataURL(file);
                                        });

                                        return promise;
                                    },
                                    uploadByUrl (url) {
                                        return fetch(url, {
                                            mode: 'cors',
                                        })
                                            .then(response => {
                                                return response.blob();
                                            })
                                            .then(blob => new Promise((resolve, reject) => {
                                                const reader = new FileReader();
                                                reader.onloadend = () => {
                                                    resolve({
                                                        success: true,
                                                        file: {
                                                            url: reader.result,
                                                        },
                                                    });
                                                };
                                                reader.onerror = reject;
                                                reader.readAsDataURL(blob);
                                            }));
                                    },
                                },
                            },
                        },
                        Marker: {
                            class: Marker,
                            inlineToolbar: true,
                        },
                        header: {
                            class: Header,
                            inlineToolbar: true,
                        },
                        quote: {
                            class: Quote,
                            inlineToolbar: true,
                        },
                        paragraph: {
                            class: Paragraph,
                            inlineToolbar: true,
                        },
                        list: {
                            class: List,
                            inlineToolbar: true,
                        },
                        table: {
                            class: Table,
                            inlineToolbar: true,
                            config: {
                                rows: 1,
                                cols: 1,
                            },
                        },
                        warning: {
                            class: Warning,
                            inlineToolbar: true,
                        },
                        inlineCode: {
                            class: InlineCode,
                        },
                        delimiter: Delimiter,
                        code: CodePlugin,
                    },
                });
            },
        },
        mounted () {
            if (!document.getElementById('editorJsScript')) {
                let script = document.createElement('script');
                script.setAttribute('src', 'https://cdn.jsdelivr.net/npm/@editorjs/editorjs');
                script.setAttribute('id', 'editorJsScript');
                document.head.appendChild(script);

                script = document.createElement('script');
                script.setAttribute('src', 'https://cdn.jsdelivr.net/npm/@editorjs/image');
                document.head.appendChild(script);

                script = document.createElement('script');
                script.setAttribute('src', 'https://cdn.jsdelivr.net/npm/@editorjs/marker');
                document.head.appendChild(script);

                script = document.createElement('script');
                script.setAttribute('src', 'https://cdn.jsdelivr.net/npm/@editorjs/quote');
                document.head.appendChild(script);

                script = document.createElement('script');
                script.setAttribute('src', 'https://cdn.jsdelivr.net/npm/@editorjs/paragraph');
                document.head.appendChild(script);

                script = document.createElement('script');
                script.setAttribute('src', 'https://cdn.jsdelivr.net/npm/@editorjs/list');
                document.head.appendChild(script);

                script = document.createElement('script');
                script.setAttribute('src', 'https://cdn.jsdelivr.net/npm/@editorjs/table');
                document.head.appendChild(script);

                script = document.createElement('script');
                script.setAttribute('src', 'https://cdn.jsdelivr.net/npm/@editorjs/header');
                document.head.appendChild(script);

                script = document.createElement('script');
                script.setAttribute('src', 'https://cdn.jsdelivr.net/npm/@editorjs/warning');
                document.head.appendChild(script);

                script = document.createElement('script');
                script.setAttribute('src', 'https://cdn.jsdelivr.net/npm/@editorjs/inline-code');
                document.head.appendChild(script);

                script = document.createElement('script');
                script.setAttribute('src', 'https://cdn.jsdelivr.net/npm/@editorjs/delimiter');
                document.head.appendChild(script);
            }

            if (!document.getElementById('detailScript')) {
                let script = document.createElement('script');
                script.setAttribute('id', 'detailScript');
                script.setAttribute('src', '/script/code-plugin.js');
                document.head.appendChild(script);

                script = document.createElement('script');
                script.setAttribute('src', '/ace/ace.js');
                document.head.appendChild(script);

                script = document.createElement('link');
                script.setAttribute('rel', 'stylesheet');
                script.setAttribute('href', '/style/code-plugin.css');
                document.head.appendChild(script);
            }

            const interval = setInterval(() => {
                if (
                    'undefined' !== typeof EditorJS
                    && 'undefined' !== typeof Marker
                    && 'undefined' !== typeof Header
                    && 'undefined' !== typeof Quote
                    && 'undefined' !== typeof Paragraph
                    && 'undefined' !== typeof List
                    && 'undefined' !== typeof Table
                    && 'undefined' !== typeof Warning
                    && 'undefined' !== typeof InlineCode
                    && 'undefined' !== typeof Delimiter
                    && 'undefined' !== typeof CodePlugin
                    && 'undefined' !== typeof ace
                ) {
                    clearInterval(interval);
                    this.initEditor();
                }
            }, 10);
        },
    };
</script>

<style lang='scss'>
  .editor-container .content-label {
    color: $main-color;
    display: inline-block;
    margin-left: 0.6rem;
  }

  #content-editor {
    width: 850px;
    background: #F6F6F6;
    border-radius: $border-radius;
    margin: 10px auto;
  }

  #content-editor {
    .cdx-settings-button[data-level='1'] {
      display: none;
    }

    .ce-settings__plugin-zone {
      padding: 3px 2px 0;
    }

    .ce-settings__button {
      margin-right: 0;
    }
  }

  #content-editor .codex-editor__loader {
    height: 75px;
  }

  #content-editor .codex-editor__redactor {
    padding-bottom: 34px !important;
    position: relative;
  }

  #content-editor .codex-editor__redactor:after {
    content: '+';
    position: absolute;
    width: 100%;
    text-align: center;
    bottom: 0px;
    box-sizing: border-box;
    color: #989898;
    font-size: 30px;
    font-weight: bold;
    height: 35px;
    line-height: 30px;
    cursor: pointer;
  }

  #content-editor .ce-block {
    border-bottom: 1px dotted lightgray;
  }

  #content-editor .ce-block:first-child {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  #content-editor .ce-block.ce-block--focused {
    background: rgba(100, 100, 200, 0.05);
  }

  #content-editor .ce-settings__code-plugin-mode {
    width: calc(100% - 8px);
    margin: 4px;
    box-sizing: border-box;
    border: 2px solid black;
    border-radius: 3px;
  }
</style>
