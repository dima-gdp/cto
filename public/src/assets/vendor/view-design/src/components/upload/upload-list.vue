<template>
  <ul :class="[prefixCls + '-list', 's-upload-list']">
    <span v-for="file in files" :key="file.id" class="s-tag ivu-tag">
      {{ file.name }}

      <feather
        stroke="var(--s-black-color-80)"
        class="s-tag-close"
        type="x"
        @click.native="handleRemove(file)"
      />
    </span>
  </ul>
</template>
<script>
import Icon from '../icon/icon.vue'
import iProgress from '../progress/progress.vue'
const prefixCls = 'ivu-upload'

export default {
  name: 'UploadList',
  components: { Icon, iProgress },
  props: {
    files: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      prefixCls: prefixCls,
    }
  },
  methods: {
    fileCls(file) {
      return [
        `${prefixCls}-list-file`,
        {
          [`${prefixCls}-list-file-finish`]: file.status === 'finished',
        },
      ]
    },
    handleClick(file) {
      this.$emit('on-file-click', file)
    },
    handlePreview(file) {
      this.$emit('on-file-preview', file)
    },
    handleRemove(file) {
      this.$emit('on-file-remove', file)
    },
    format(file) {
      const format = file.name.split('.').pop().toLocaleLowerCase() || ''
      let type = 'ios-document-outline'

      if (['gif', 'jpg', 'jpeg', 'png', 'bmp', 'webp'].indexOf(format) > -1) {
        type = 'ios-image'
      }
      if (['mp4', 'm3u8', 'rmvb', 'avi', 'swf', '3gp', 'mkv', 'flv'].indexOf(format) > -1) {
        type = 'ios-film'
      }
      if (['mp3', 'wav', 'wma', 'ogg', 'aac', 'flac'].indexOf(format) > -1) {
        type = 'ios-musical-notes'
      }
      if (['doc', 'txt', 'docx', 'pages', 'epub', 'pdf'].indexOf(format) > -1) {
        type = 'md-document'
      }
      if (['numbers', 'csv', 'xls', 'xlsx'].indexOf(format) > -1) {
        type = 'ios-stats'
      }
      if (['keynote', 'ppt', 'pptx'].indexOf(format) > -1) {
        type = 'ios-videocam'
      }

      return type
    },
    parsePercentage(val) {
      return parseInt(val, 10)
    },
  },
}
</script>

<style lang="scss" scopped>
.s-upload-list {
  display: flex;
  flex-wrap: wrap;
}

.s-tag {
  position: relative;
  padding: 1px 24px 1px 8px;
  background: var(--s-black-color-10) !important;
  border-radius: 2px !important;
  flex: 1 0 30%;
  max-width: 32%;
  text-overflow: ellipsis;

  &-close {
    position: absolute;
    right: 4px;
    top: 4px;
    cursor: pointer;
  }
}
</style>
