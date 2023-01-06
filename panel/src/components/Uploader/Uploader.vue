<template>
  <div>
    <Upload :before-upload="handleUpload" :disabled="disabled" :type="type" action="none">
      <div style="padding: 20px 0">
        <Icon v-if="!value" type="ios-filing-outline" size="52" style="color: #3399ff" />
        <img
          v-if="isImgFormat"
          :src="value.baseUrl + value.path"
          alt="logo"
          style="max-width: 200px"
        />
        <p v-if="desc">
          {{ desc }}
        </p>
      </div>
    </Upload>
    <transition-group name="fade">
      <div v-if="value" key="file" class="upload-info">
        <div class="upload-info__text">Прикреплен файл: {{ value.name }}</div>
        <Icon
          class="upload-info__delete"
          type="ios-close-circle-outline"
          @click="deleteFile(value.id)"
        />
      </div>
      <Progress
        v-if="value && status !== 'normal'"
        key="progress"
        :percent="percent"
        :status="status"
        hide-info
      />
    </transition-group>
  </div>
</template>

<script>
import { uploadFile, deleteFile, getFile } from '@/api/files'

export default {
  // TODO: Поставить значения по-умолчанию у пропсов
  /* eslint-disable vue/require-default-prop */
  props: {
    desc: {
      type: String,
    },
    uploadType: {
      type: String,
      default: '',
    },
    type: {
      type: String,
    },
    disabled: {
      type: Boolean,
    },
    value: {
      type: [Object, null],
    },
    /* eslint-enable vue/require-default-prop */
  },
  data() {
    return {
      file: null,
      percent: 0,
      status: 'normal',
      imgFormats: ['jpg', 'gif', 'png', 'svg'],
    }
  },
  computed: {
    isImgFormat() {
      if (this.value) {
        const path = this.value.path.split('.')
        const format = path[path.length - 1]

        return this.imgFormats.includes(format)
      } else {
        return false
      }
    },
  },
  methods: {
    async handleUpload(file) {
      // Если уже есть файл, перед загрузкой
      // сначала удаляем старый
      if (this.file) {
        const { id } = this.file
        await this.deleteFile(id)
      }

      this.status = 'active'
      this.percent = 0
      const formData = new FormData()
      formData.append('file', file)
      this.uploadType && formData.append('type', this.uploadType)
      this.percent = 75

      try {
        const res = await uploadFile(formData)
        this.percent = 90
        this.file = res.data
        this.percent = 100
        this.status = 'success'
        this.$Message.success('Файл успешно загружен')
        this.$emit('input', this.file)
      } catch (e) {
        this.status = 'wrong'
        this.file = null
        this.$Message.error('Ошибка загрузки файла')
        this.$emit('input', null)
        throw new Error(e)
      }

      // Это не баг, это фича -
      // без этого отрабатывает action в uploader
      return new Promise()
    },
    async deleteFile(id) {
      try {
        await deleteFile(id)
        this.file = null
        this.percent = 0
        this.status = 'normal'
        this.$emit('input', null)
      } catch (e) {
        this.$emit('input', null)
        throw new Error(e)
      }
    },
  },
}
</script>

<style lang="less" scoped>
.upload-info {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: aliceblue;
  border-radius: 4px;

  &__text {
    line-height: 1.3;
    flex-grow: 1;
  }

  &__delete {
    text-align: center;
    font-size: 14px;
    cursor: pointer;
    color: #ed4014;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
