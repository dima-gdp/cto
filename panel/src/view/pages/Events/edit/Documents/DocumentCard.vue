<template>
  <div v-if="data" class="document-item">
    <Card>
      <Spin v-if="loading" fix></Spin>
      <h4 class="document-item__title">Информация о документе</h4>
      <Form ref="formDocument" :model="formDocument" :rules="ruleDocument">
        <FormItem label="Активность">
          <i-switch v-model="formDocument.active"></i-switch>
        </FormItem>
        <FormItem label="Название ссылки в боковом меню" prop="name">
          <Input v-model="formDocument.name" placeholder="Введите название"></Input>
        </FormItem>
        <FormItem prop="file">
          <Uploader
            v-model="formDocument.file"
            desc="Загрузите документ"
            type="drag"
            on-success=""
          ></Uploader>
        </FormItem>
      </Form>
      <div style="flex-grow: 1"></div>
      <template v-if="formDocument.id">
        <div class="document-item__btn-block">
          <Row :gutter="16" class-name='"document-item__btn-block"'>
            <template v-if="formDocument.file && formDocument.id">
              <i-col span="24">
                <Button class="document-item__btn-item" @click="loadTestUserDocument">
                  Скачать образец
                </Button>
              </i-col>
            </template>
            <i-col span="16">
              <Button class="document-item__btn-item" type="primary" long @click="handleUpdate()">
                Сохранить
              </Button>
            </i-col>
            <i-col span="8">
              <Button
                class="document-item__btn-item"
                long
                ghost
                type="error"
                @click="handleDelete(formDocument.id)"
              >
                Удалить
              </Button>
            </i-col>
          </Row>
        </div>
      </template>

      <div v-else class="document-item__btn-block">
        <Button class="document-item__btn-item" type="primary" @click="handleCreate">
          Сохранить
        </Button>
      </div>
    </Card>
  </div>
</template>
<script>
import Uploader from '@/components/Uploader'
import { checkUserDocument } from '@/api/documents'
import { downloadFile } from '@/libs/util'

export default {
  components: {
    Uploader,
  },
  props: {
    data: { type: Object, default: () => {} },
    loading: { type: Boolean, default: false },
  },
  data() {
    return {
      fileUrl: null,
      formDocument: {
        name: '',
      },
      ruleDocument: {
        name: [{ required: true, message: 'Введите название документа', trigger: 'blur' }],
        file: [{ required: true, type: 'object', message: 'Загрузите файл', trigger: 'blur' }],
      },
    }
  },
  created() {
    this.formDocument = this.data
  },
  methods: {
    handleDelete(id) {
      this.$emit('delete', id)
    },
    handleUpdate() {
      this.$refs.formDocument.validate((valid) => {
        if (valid) {
          this.formDocument.fileId = this.formDocument.file.id
          this.$emit('update', this.formDocument.id, this.formDocument)
        } else {
          this.$Message.error('Заполните необходимые поля')
        }
      })
    },
    handleCreate() {
      this.$refs.formDocument.validate((valid) => {
        if (valid) {
          this.formDocument.fileId = this.formDocument.file.id
          this.$emit('create', this.formDocument)
        } else {
          this.$Message.error('Заполните необходимые поля')
        }
      })
    },
    uploadSuccess() {
      this.$refs.formDocument.resetFields()
    },
    async loadTestUserDocument() {
      const templateId = this.data.id
      const eventId = this.$route.params.id
      const userId = this.$store.getters['userId']
      const { data } = await checkUserDocument(userId, eventId, templateId)
      downloadFile(data.url)
    },
  },
}
</script>
<style lang="less">
@import 'DocumentItem';
</style>
