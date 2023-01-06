<template>
  <div class="main-info-wrap">
    <Card class="tag-edit-form">
      <!-- <h3 class="tag-edit-form__title">Редактирование  тега</h3> -->
      <Form ref="tagEdit" :model="form" :rules="formRules" label-position="top">
        <Row type="flex">
          <i-col :lg="12" :md="24" :sm="24">
            <FormItem class="tag-edit-form__item" label="Название тега" prop="name">
              <Input v-model="form.name" placeholder="Введите название тега" />
            </FormItem>
          </i-col>

          <i-col :lg="12" :md="24" :sm="24">
            <FormItem class="tag-edit-form__item" label="Tag" prop="slug">
              <Input v-model="form.slug" placeholder="Введите Tag" />
            </FormItem>
          </i-col>
        </Row>
      </Form>
      <Spin v-if="load" fix></Spin>
    </Card>

    <Row type="flex" justify="end">
      <i-col :lg="3" :sm="6" class-name="tag-edit-form-actions">
        <Button
          :disabled="load"
          class="tag-edit-form-actions__btn"
          long
          @click="submitForm('tagEdit', 'accept')"
        >
          Применить
        </Button>
      </i-col>
      <i-col :lg="3" :sm="6" class-name="tag-edit-form-actions">
        <Button
          :disabled="load"
          type="primary"
          class="tag-edit-form-actions__btn"
          long
          @click="submitForm('tagEdit', 'save')"
        >
          Сохранить
        </Button>
      </i-col>
    </Row>
  </div>
</template>

<script>
export default {
  props: {
    load: {
      type: Boolean,
      default: false,
    },
    // TODO: Поставить значения по-умолчанию у пропсов
    /* eslint-disable vue/require-default-prop */
    tag: {
      type: Object,
    },
    /* eslint-enable vue/require-default-prop */
  },
  data() {
    return {
      form: {
        name: '',
        slug: '',
      },
      formRules: {
        name: [{ required: true, message: 'Это поле обязательно!' }],
        slug: [{ required: true, message: 'Это поле обязательно!' }],
      },
    }
  },
  watch: {
    tag(newValue) {
      if (newValue) {
        this.initForm()
      }
    },
  },
  methods: {
    async validateForm(name) {
      const valid = await this.$refs[name].validate()
      return valid
    },
    async submitForm(formRef, action) {
      const valid = await this.validateForm(formRef)
      if (valid) {
        this.$emit('on-submit', [this.form, action])
      }
    },
    initForm() {
      for (const key in this.form) {
        if (this.tag.hasOwnProperty(key)) {
          this.form[key] = this.tag[key]
        }
      }
    },
  },
}
</script>

<style lang="less">
@import '../edit.less';
</style>
