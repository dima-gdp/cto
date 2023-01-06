<template>
  <div class="main-info-wrap">
    <Card class="tag-create-form">
      <!-- <h3 class="tag-create-form__title">Создание тега</h3> -->
      <Form ref="tagCreate" :model="form" :rules="formRules" label-position="top">
        <Row type="flex">
          <i-col :lg="12" :md="24" :sm="24">
            <FormItem class="tag-create-form__item" label="Название тега" prop="name">
              <Input v-model="form.name" placeholder="Введите название тега" />
            </FormItem>
          </i-col>

          <i-col :lg="12" :md="24" :sm="24">
            <FormItem class="tag-create-form__item" label="Tag" prop="slug">
              <Input v-model="form.slug" placeholder="Введите Tag" />
            </FormItem>
          </i-col>
        </Row>
      </Form>
      <Spin v-if="load" fix></Spin>
    </Card>

    <Row type="flex" justify="end">
      <i-col :lg="3" :sm="6" class-name="tag-create-form-actions">
        <Button
          :disabled="load"
          class="tag-create-form-actions__btn"
          long
          @click="submitForm('tagCreate', 'accept')"
        >
          Применить
        </Button>
      </i-col>
      <i-col :lg="3" :sm="6" class-name="tag-create-form-actions">
        <Button
          :disabled="load"
          type="primary"
          class="tag-create-form-actions__btn"
          long
          @click="submitForm('tagCreate', 'save')"
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
    event: {
      type: Object || Boolean,
      default: false,
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
        slug: '',
      },
      formRules: {
        name: [{ required: true, message: 'Это поле обязательно!' }],
        slug: [{ required: true, message: 'Это поле обязательно!' }],
      },
    }
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
  },
}
</script>

<style lang="less">
@import '../create.less';
</style>
