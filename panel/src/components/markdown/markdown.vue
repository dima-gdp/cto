<template>
  <div class="markdown-editor">
    <textarea :name="name"></textarea>
  </div>
</template>

<script>
import SimpleMDE from 'simplemde'
import { marked } from 'marked'
import 'simplemde/dist/simplemde.min.css'
export default {
  name: 'MarkdownEditor',
  props: {
    // TODO: Поставить значения по-умолчанию у пропсов
    /* eslint-disable vue/require-default-prop */
    value: String,
    name: String,
    previewClass: String,
    /* eslint-enable vue/require-default-prop */
    autoinit: {
      type: Boolean,
      default() {
        return false
      },
    },
    highlight: {
      type: Boolean,
      default() {
        return false
      },
    },
    sanitize: {
      type: Boolean,
      default() {
        return false
      },
    },
    configs: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      initialized: false,
    }
  },
  watch: {
    value(val) {
      if (this.initialized) {
        if (val === this.simplemde.value()) return
        this.simplemde.value(val)
        this.simplemde.codemirror.refresh()
      }
    },
  },
  mounted() {
    if (this.autoinit) this.initialize()
  },
  activated() {
    const editor = this.simplemde
    if (!editor) return
    const isActive = editor.isSideBySideActive() || editor.isPreviewActive()
    if (isActive) editor.toggleFullScreen()
  },
  destroyed() {
    this.simplemde = null
  },
  methods: {
    initialize() {
      if (this.initialized === true) return true

      const configs = Object.assign(
        {
          element: this.$el.firstElementChild,
          initialValue: this.value,
          spellChecker: false,
          renderingConfig: {},
        },
        this.configs
      )

      if (configs.initialValue) {
        this.$emit('input', configs.initialValue)
      }

      if (this.highlight) {
        configs.renderingConfig.codeSyntaxHighlighting = true
      }

      marked.setOptions({ sanitize: this.sanitize })

      this.simplemde = new SimpleMDE(configs)

      const className = this.previewClass || ''
      this.addPreviewClass(className)

      this.bindingEvents()
      this.initialized = true
    },
    bindingEvents() {
      this.simplemde.codemirror.on('change', () => {
        this.$emit('input', this.simplemde.value())
      })
    },
    addPreviewClass(className) {
      const wrapper = this.simplemde.codemirror.getWrapperElement()
      const preview = document.createElement('div')
      wrapper.nextSibling.className += ` ${className}`
      preview.className = `editor-preview ${className}`
      wrapper.appendChild(preview)
    },
  },
}
</script>

<style>
.markdown-editor .markdown-body {
  padding: 0.5em;
}
.markdown-editor .editor-preview-active,
.markdown-editor .editor-preview-active-side {
  display: block;
}
.CodeMirror-fullscreen {
  z-index: 9999;
}
</style>
