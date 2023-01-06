<template>
  <textarea ref="article" :name="name" :placeholder="placeholder" :value="value"></textarea>
</template>

<script>
import '@s256/article-editor/article-editor.min'

export default {
  article: false,
  props: {
    value: {
      default: '',
      type: String,
    },
    placeholder: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    config: {
      default: () => {},
      type: Object,
    },
  },
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    init() {
      const me = this
      const subscribe = {
        'editor.content.change': function (event) {
          const html = event.get('html')
          me.handleInput(html)
          return html
        },
      }

      // extend config
      this.$set(this.config, 'subscribe', subscribe)

      // call
      const app = ArticleEditor(this.$refs.article, this.config)

      // set instance
      this.article = app
      this.$parent.article = app
    },
    destroy() {
      // Call destroy on article to cleanup event handlers
      this.article.stop()

      // unset instance for garbage collection
      this.article = null
      this.$parent.article = null
    },
    handleInput(val) {
      this.$emit('input', val)
    },
  },
}
</script>
