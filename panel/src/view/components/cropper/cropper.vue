<template>
  <div>
    <Row>
      <i-col span="12">
        <Card>
          <div class="cropper-example cropper-first">
            <Cropper
              :src="exampleImageSrc"
              crop-button-text="Сохранить"
              @on-crop="handleCroped"
            ></Cropper>
          </div>
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>
import Cropper from '@/components/cropper'
import { uploadImg } from '@/api/data'
export default {
  name: 'CropperPage',
  components: {
    Cropper,
  },
  data() {
    return {
      exampleImageSrc: '',
    }
  },
  methods: {
    handleCroped(blob) {
      const formData = new FormData()
      formData.append('croppedImg', blob)
      uploadImg(formData).then(() => {
        this.$Message.success('Загрузка завершена!')
      })
    },
  },
}
</script>

<style lang="less">
.cropper-example {
  height: 400px;
}
</style>
