<template>
  <form @submit.prevent="defaultData && Object.keys(defaultData).length ? updatePage() : savePage()">
    <div class="form__field" v-show="!onlyEditor">
      <input id="title" placeholder="Title" v-model="title" @input="$emit('updateSaved', false)"/>
      <label for="title">Title<span class="form__field--required"> *</span></label>
    </div>
    <div class="editor-container">
      <span class="content-label" v-if="!onlyEditor">Content<span class="form__field--required"> *</span></span>
      <div id="content-editor"></div>
    </div>
    <div class="form__element" v-if="!onlyEditor">
      <Tags @input="setTags" :value="tags"/>
    </div>
    <div class="form__button">
      <button class="success" :disabled="loading">Save</button>
      <button type="button" class="gray" v-if="showCancel" @click="$emit('cancelForm')">Cancel</button>
    </div>
  </form>
</template>

<script>
    import Tags from '~/components/functional/Tags.vue';

    const sanitizeTags = tags => {
        if (tags.length) {
            tags = tags.map(tag => tag.toLowerCase().replace(/ /g, '-'));

            // search alphabetically
            tags.sort();

            // make sure comma around first and last value to allow search
            tags.unshift('');
            tags.push('');
        }

        return tags;
    };

    export default {
        components: {
            Tags,
        },
        data () {
            return {
                title: this.defaultTitle,
                tags: this.defaultTags.filter(tag => tag !== ''),
                loading: false,
            };
        },
        props: {
            category: String,
            defaultTitle: {
                type: String,
                default: '',
            },
            defaultTags: {
                type: Array,
                default: () => [],
            },
            defaultData: {
                type: Object,
                default: () => {},
            },
            onlyEditor: {
                type: Boolean,
                default: false,
            },
            pageId: {
                type: Number,
                default: 0,
            },
            parent: {
                type: Number,
                default: 0,
            },
            placeholder: {
                type: String,
                default: 'Click here to start your topic',
            },
            showCancel: {
                type: Boolean,
                default: false,
            },
        },
        methods: {
            setTags (tags) {
                this.tags = tags;
            },
            async savePage () {
                const data = {
                    status: 'published',
                    title: this.title,
                    category: this.category,
                    content: await this.editor.save(),
                    tags: sanitizeTags(this.tags),
                };

                if (!data.content.blocks.length) {
                    this.$alert('Please enter some content!', null, 'warning');
                    return;
                }

                if (this.parent) {
                    data.parent_page = this.parent;
                }

                try {
                    this.loading = true;

                    const res = await fetch(this.$store.state.baseUrl + '/items/page?fields=*,created_by.last_name,created_by.id', {
                        method: 'POST',
                        body: JSON.stringify(data),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + this.$cookies.get('token'),
                        },
                    });
                    const { data: newPage } = await res.json();

                    this.loading = false;

                    if (newPage && newPage.id) {
                        if (newPage.parent_page) {
                            this.editor.blocks.clear();
                            this.$emit('pageSaved', newPage);

                            // wait, otherwise change event of clearing the blocks will set it to false again
                            setTimeout(() => this.$emit('updateSaved', true), 1000);
                        } else {
                            this.$emit('updateSaved', true);
                            this.$router.push('/page/detail/' + newPage.id);
                        }

                    } else {
                        this.$alert('Error during save, please try again later!', null, 'error');
                    }
                } catch (e) {
                    this.$alert('The following error occurred: ' + e.message, null, 'error');
                }
            },
            async updatePage () {
                const data = {
                    title: this.title,
                    content: await this.editor.save(),
                    category: this.category,
                    tags: sanitizeTags(this.tags),
                };

                if (!data.content.blocks.length) {
                    this.$alert('Please enter some content!', null, 'warning');
                    return;
                }

                try {
                    this.loading = true;

                    const res = await fetch(`${this.$store.state.baseUrl}/items/page/${this.pageId}?fields=*,created_by.last_name,created_by.id,modified_by.last_name,modified_by.id,votes.*,tags`, {
                        method: 'PATCH',
                        body: JSON.stringify(data),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + this.$cookies.get('token'),
                        },
                    });
                    const { data: editedPage } = await res.json();

                    this.loading = false;

                    this.$emit('pageSaved', editedPage);
                    this.$emit('updateSaved', true);
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
                    holder: 'content-editor',
                    data: this.defaultData,
                    placeholder: this.placeholder,
                    onChange: () => {
                        this.$emit('updateSaved', false);
                    },
                    tools: {
                        image: {
                            class: ImageTool,
                            config: {
                                uploader: {
                                    uploadByFile: file => {

                                        if (file.size / 1024 > 100) {
                                            this.$alert('File too big! Only 100kB are allowed', null, 'warning');
                                            return Promise.reject('File too big');
                                        }

                                        const reader = new FileReader();

                                        return new Promise((resolve, reject) => {
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
                                    },
                                    uploadByUrl: url => {
                                        return fetch(url, {
                                            mode: 'cors',
                                        })
                                            .then(response => {
                                                return response.blob();
                                            })
                                            .then(blob => {
                                                if (blob.size / 1024 > 100) {
                                                    this.$alert('File too big! Only 100kB are allowed', null, 'warning');
                                                    return Promise.reject('File too big');
                                                }

                                                return new Promise((resolve, reject) => {
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
                                                });
                                            });
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
                            inlineToolbar: false,
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
                script.setAttribute('src', '/editorjs/editorjs.js');
                script.setAttribute('id', 'editorJsScript');
                script.setAttribute('async', 'true');
                document.head.appendChild(script);

                script = document.createElement('script');
                script.setAttribute('src', '/editorjs/image.js');
                script.setAttribute('async', 'true');
                document.head.appendChild(script);

                script = document.createElement('script');
                script.setAttribute('src', '/editorjs/marker.js');
                script.setAttribute('async', 'true');
                document.head.appendChild(script);

                script = document.createElement('script');
                script.setAttribute('src', '/editorjs/quote.js');
                script.setAttribute('async', 'true');
                document.head.appendChild(script);

                script = document.createElement('script');
                script.setAttribute('src', '/editorjs/paragraph.js');
                script.setAttribute('async', 'true');
                document.head.appendChild(script);

                script = document.createElement('script');
                script.setAttribute('src', '/editorjs/list.js');
                script.setAttribute('async', 'true');
                document.head.appendChild(script);

                script = document.createElement('script');
                script.setAttribute('src', '/editorjs/table.js');
                script.setAttribute('async', 'true');
                document.head.appendChild(script);

                script = document.createElement('script');
                script.setAttribute('src', '/editorjs/header.js');
                script.setAttribute('async', 'true');
                document.head.appendChild(script);

                script = document.createElement('script');
                script.setAttribute('src', '/editorjs/warning.js');
                script.setAttribute('async', 'true');
                document.head.appendChild(script);

                script = document.createElement('script');
                script.setAttribute('src', '/editorjs/inline-code.js');
                script.setAttribute('async', 'true');
                document.head.appendChild(script);

                script = document.createElement('script');
                script.setAttribute('src', '/editorjs/delimiter.js');
                script.setAttribute('async', 'true');
                document.head.appendChild(script);
            }

            if (!document.getElementById('detailScript')) {
                let script = document.createElement('script');
                script.setAttribute('id', 'detailScript');
                script.setAttribute('src', '/script/code-plugin.js');
                script.setAttribute('async', 'true');
                document.head.appendChild(script);

                script = document.createElement('script');
                script.setAttribute('src', '/ace/ace.js');
                script.setAttribute('async', 'true');
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
    width: 100%;
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
