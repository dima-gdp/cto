<template>
  <div class="markdown" v-html="compiled"></div>
</template>

<script>
import MarkDownIt from 'markdown-it'

export default {
  props: {
    text: {
      type: String,
      default: '',
    },
  },
  computed: {
    compiled() {
      const md = new MarkDownIt()
      const options = {
        html: true,
        xhtmlOut: true,
        breaks: true,
        linkify: true,
        typographer: true,
        quotes: '«»„“',
        highlight: null,
        maxNesting: 20,
      }
      md.options = options
      return md.render(this.text)
    },
  },
}
</script>

<style lang="scss">
.markdown {
  // padding: 18px;
  line-height: 1.4;

  ul {
    padding: 18px;
    list-style: disc;
  }

  ol {
    padding: 18px;
    list-style: decimal;
  }

  li {
    line-height: 1.4;
    display: list-item;
  }
  em {
    font-style: italic;
  }
  strong,
  b {
    font-weight: bold;
  }
}
</style>
