<template>
  <div>
    <MarkdownEditor v-model="content" />
  </div>
</template>

<script>
import MarkdownEditor from '_c/markdown'
export default {
  name: 'MarkdownPage',
  components: {
    MarkdownEditor,
  },
  data() {
    return {
      content: '',
    }
  },
}
</script>

<style></style>
