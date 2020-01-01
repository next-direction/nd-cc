<template>
  <div class="editor-detail-container">
    <div class="code-plugin-mode">{{ mode }}</div>
    <div ref="editor" class="editor"></div>
  </div>
</template>

<script>
    export default {
        props: ['content'],
        data () {
            return {
                elementId: (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase(),
                mode: '',
            };
        },
        methods: {
            initEditor () {
                const currentMode = CodePlugin.modes.find(mode => mode[0] === this.content.mode);
                this.mode = currentMode[1];

                this.editor = ace.edit(this.$refs.editor, {
                    maxLines: Infinity,
                    cursorStyle: 'slim',
                    mode: currentMode[0],
                    readOnly: true,
                    highlightActiveLine: false,
                    highlightGutterLine: false,
                });

                this.editor.container.style.lineHeight = 1.8;

                this.editor.renderer.updateFontSize();
                this.editor.renderer.$cursorLayer.element.style.display = 'none';

                this.editor.setTheme('ace/theme/tomorrow');
                this.editor.setValue(this.content.content);
                this.editor.clearSelection();
            },
        },
        mounted () {
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
                    'undefined' !== typeof CodePlugin
                    && 'undefined' !== typeof ace
                ) {
                    clearInterval(interval);
                    this.initEditor();
                }
            }, 10);
        },
    };
</script>

<style lang="scss">
  .editor-detail-container {
    margin: 1rem 0;

    .editor {
      border: 1px solid $gray-light;
      border-radius: $border-radius;
    }

    .ace_marker-layer .ace_bracket {
      display: none
    }
  }
</style>
