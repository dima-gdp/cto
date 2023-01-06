<template>
  <div class="import-detail">
    <Row :gutter="15">
      <i-col span="6">
        <Card title="Импортировать" class="import-detail__card" icon="ios-code-download">
          <Form ref="form" :model="form" :rules="ruleValidate" label-position="top">
            <FormItem v-if="importModels" label="Модели импорта" prop="model">
              <Select v-model="form.model" placeholder="выберите модель импорта" clearable>
                <Option v-for="(item, key) in importModels.model" :key="item" :value="key"
                  >{{ item }}
                </Option>
              </Select>
            </FormItem>
            <FormItem label="Файл импорта" prop="file">
              <Uploader
                v-model="form.file"
                desc="Загрузите файл импора: .xlsx"
                type="drag"
                upload-type="import"
              />
            </FormItem>
          </Form>
          <Spin v-if="load" fix></Spin>
        </Card>
        <div class="import-detail__btn-block">
          <Button type="primary" long @click="handleSave(true)"> Импортировать </Button>
        </div>
      </i-col>
    </Row>
  </div>
</template>
<script>
import { getImportModels } from '@/api/imports'
import Uploader from '@/components/Uploader'
export default {
  components: {
    Uploader,
  },
  props: {
    edit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      importModels: null,
      form: {
        model: '',
        file: null,
      },
      ruleValidate: {
        model: [{ required: true, message: 'Не может быть пустым полем', trigger: 'blur' }],
        file: [
          {
            required: true,
            message: 'Не может быть пустым полем',
            trigger: 'blur',
            type: 'object',
          },
        ],
      },
      load: true,
    }
  },
  created() {
    this.getImportModels()
  },
  methods: {
    getImportModels() {
      this.loading = true
      getImportModels()
        .then((res) => {
          this.importModels = res.data
          this.load = false
        })
        .catch((e) => {
          console.error(e)
        })
    },
    handleSave(redirect) {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$emit('on-save', this.form, redirect)
        } else {
          this.$Message.error('В форме есть ошибки!')
        }
      })
    },
  },
}
</script>
