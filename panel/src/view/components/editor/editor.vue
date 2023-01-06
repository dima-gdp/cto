<template>
  <div>
    <Editor ref="editor" :value="content" @on-change="handleChange" />
    <Button @click="changeContent"> Изменить содержимое редактора </Button>
  </div>
</template>

<script>
import Editor from '_c/editor'
export default {
  name: 'EditorPage',
  components: {
    Editor,
  },
  data() {
    return {
      content: '12312323',
    }
  },
  methods: {
    handleChange(html, text) {},
    changeContent() {
      this.$refs.editor.setHtml('<p>powered by wangeditor</p>')
    },
  },
}
</script>

<style></style>
