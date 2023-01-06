<template>
  <div class="main-info-wrap">
    <Card class="user-base-form">
      <Form
        ref="formData"
        :model="form"
        :rules="formRules"
        label-position="top"
        style="margin-bottom: 30px"
      >
        <Row type="flex" :gutter="10">
          <i-col :lg="12" :md="24" :sm="24">
            <FormItem class="user-base-form__item" label="Название" prop="name">
              <Input v-model="form.name" placeholder="Название базы" />
            </FormItem>
          </i-col>

          <i-col :lg="12" :md="24" :sm="24">
            <FormItem class="user-base-form__item" label="Описание" prop="name">
              <Input v-model="form.description" placeholder="Описание базы" />
            </FormItem>
          </i-col>
        </Row>
      </Form>
      <Row type="flex" justify="end" :gutter="10">
        <i-col :sm="4" class-name="user-base-form-actions">
          <Button
            :disabled="load"
            class="user-base-form-actions__btn"
            long
            @click="submitForm('formData', 'accept')"
          >
            Применить
          </Button>
        </i-col>
        <i-col :sm="4" class-name="user-base-form-actions">
          <Button
            :disabled="load"
            type="primary"
            class="user-base-form-actions__btn"
            long
            @click="submitForm('formData', 'save')"
          >
            Сохранить
          </Button>
        </i-col>
      </Row>
      <Spin v-if="load" fix></Spin>
    </Card>
  </div>
</template>

<script>
export default {
  name: 'MainFormData',
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
    load: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        name: '',
        description: '',
      },
      formRules: {
        name: [{ required: true, message: 'Это поле обязательно!', trigger: 'blur' }],
        description: [{ required: true, message: 'Это поле обязательно!', trigger: 'blur' }],
      },
    }
  },
  watch: {
    formData(value) {
      if (value) {
        this.initForm()
      }
    },
  },
  methods: {
    async submitForm(formRef, action) {
      const valid = await this.$refs.formData.validate()
      if (valid) {
        this.$emit('on-submit', [this.form, action])
      }
    },
    initForm() {
      for (const key in this.formData) {
        this.form[key] = this.formData[key]
      }
    },
  },
}
</script>

<style lang="less">
@import './MainForm.less';
</style>
