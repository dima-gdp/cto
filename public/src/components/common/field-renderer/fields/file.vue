<template>
  <div>
    <Upload
      :value="value"
      :show-upload-list="false"
      :before-upload="beforeUpload"
      :format="extensions"
      :action="''"
    />
    <UploadList :files="value" @on-file-remove="removeFile"></UploadList>
    <Spin v-if="uploadInProcess" size="large" fix></Spin>
  </div>
</template>

<script>
import InitValidation from '../mixins/init-validation'
import UpdateValue from '../mixins/update-value'

import UploadList from '@/assets/vendor/view-design/src/components/upload/upload-list'
import { getExistingApiInstance } from '@/api'

export default {
  components: { UploadList },
  mixins: [UpdateValue, InitValidation],
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    field: {
      type: Object,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      files: [],
      uploadInProcess: false,
    }
  },
  computed: {
    extensions() {
      const { extensions } = this.field.formLink
      if (extensions) {
        return extensions.split(',').map((e) => e.trim())
      }

      return []
    },
  },
  methods: {
    async beforeUpload(file) {
      if (this.extensions.length > 0) {
        const ext = file.name.split('.')[1]

        if (this.extensions.includes(ext)) {
          const uploadedFile = await this.uploadFile(file)
          if (uploadedFile) {
            this.$emit('input', [...this.value, uploadedFile])
          }
        }
      }

      if (this.extensions.length === 0) {
        const uploadedFile = await this.uploadFile(file)
        if (uploadedFile) {
          this.$emit('input', [...this.value, uploadedFile])
        }
      }
    },
    async uploadFile(file) {
      const data = new FormData()
      data.append('file', file)

      this.uploadInProcess = true
      const res = await getExistingApiInstance()
        .file.upload(data)
        .catch((e) => {
          this.uploadInProcess = false
          throw new Error(e)
        })
      this.uploadInProcess = false

      return res.data
    },
    async removeFile(file) {
      const { id } = file
      const purgedFiles = this.value.filter((f) => +f.id !== +id)

      this.uploadInProcess = true
      await getExistingApiInstance()
        .file.delete(id)
        .catch((e) => {
          if (e.status === 404) {
            this.$emit('input', purgedFiles)
            this.uploadInProcess = false
          } else {
            this.uploadInProcess = false
            throw new Error(e)
          }
        })
      this.uploadInProcess = false

      this.$emit('input', purgedFiles)
    },
  },
}
</script>

<style></style>
