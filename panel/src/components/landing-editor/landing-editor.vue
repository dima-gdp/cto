<template>
  <div class="landing-editor">
    <Tabs v-model="tabs" :animated="false">
      <TabPane class="landing-editor__tab-pane" label="html" :name="$options.TABS.html">
        <div ref="editor-html" class="landing-editor__editor"></div>
      </TabPane>
      <TabPane label="css" :name="$options.TABS.css">
        <div ref="editor-css" class="landing-editor__editor"></div>
      </TabPane>
      <TabPane label="js" :name="$options.TABS.js">
        <div ref="editor-js" class="landing-editor__editor"></div>
      </TabPane>
      <TabPane label="preview" :name="$options.TABS.preview">
        <iframe ref="iframe" class="iframe"></iframe>
      </TabPane>
    </Tabs>
    <div>
      <SavePanel @save="onSave(true)" @apply="onSave" />
    </div>
  </div>
</template>

<script>
import { CodeEditor } from '@/services/code-editor-adapter'
import SavePanel from '@/components/save-panel/save-panel'
import { initIframe, reloadIframe, updateIframe } from '@/app/use-iframe'

let htmlEditor
let cssEditor
let jsEditor

export const TABS = {
  html: 'html',
  css: 'css',
  js: 'js',
  preview: 'preview',
}

export default {
  components: {
    SavePanel,
  },

  props: {
    code: { type: Object, default: () => ({ html: '', css: '', js: '' }), required: false },
    styleLinkUrl: { type: String, default: '', required: false },
  },

  TABS,

  data() {
    return {
      iframeSrc: null,
      tabs: TABS.html,
    }
  },

  watch: {
    code: {
      deep: true,
      async handler(val) {
        await reloadIframe(this.$refs.iframe, this.styleLinkUrl)
        this.updateCodeEditor(val)
        this.updatePreview()
      },
    },

    tabs(val) {
      if(val === TABS.preview) {
        this.updatePreview()
      }
    },
  },

  mounted() {
    htmlEditor = new CodeEditor(this.$refs['editor-html'], this.code.html, 'html')
    cssEditor = new CodeEditor(this.$refs['editor-css'], this.code.css, 'css')
    jsEditor = new CodeEditor(this.$refs['editor-js'], this.code.js, 'js')

    initIframe(this.$refs.iframe, this.styleLinkUrl)
  },

  methods: {
    updateCodeEditor(code) {
      htmlEditor.setValue(code.html)
      cssEditor.setValue(code.css)
      jsEditor.setValue(code.js)
    },

    updatePreview() {
      updateIframe({
        iframe: this.$refs.iframe,
        html: htmlEditor.getValue(),
        css: cssEditor.getValue(),
        js: jsEditor.getValue(),
      })
    },

    onSave(isExit) {
      const code = {
        html: htmlEditor.getValue(),
        css: cssEditor.getValue(),
        js: jsEditor.getValue(),
      }

      this.$emit('save', code, isExit)
    },
  },
}
</script>

<style lang="less">
@import "_landing-editor";
</style>
