<template>
  <div class="main-info-wrap">
    <Card class="form-data">
      <h3 class="form-data__title">Организационная информация</h3>
      <Form ref="formData" :model="form" :rules="formRules" label-position="top">
        <Row type="flex">
          <i-col :lg="8" :md="24" :sm="24">
            <FormItem class="form-data__item" label="Название" prop="name">
              <Input v-model="form.name" placeholder="Имя в системе" />
            </FormItem>
          </i-col>

          <i-col :lg="8" :md="24" :sm="24">
            <FormItem class="form-data__item" label="Тип формы" prop="type">
              <Select v-model="form.type" placeholder="Выберите тип">
                <Option v-for="(type, index) in formTypes" :key="index" :value="type.value">
                  {{ type.name }}
                </Option>
              </Select>
            </FormItem>
          </i-col>

          <i-col :lg="3" :md="24" :sm="24">
            <FormItem class="form-data__item" label="Активность" prop="legalEntityId">
              <Checkbox v-model="form.active">
                {{ '' }}
              </Checkbox>
            </FormItem>
          </i-col>

          <i-col :lg="5" :md="24" :sm="24">
            <Row type="flex" justify="end">
              <i-col :sm="24" class-name="form-data-actions">
                <Button
                  :disabled="load"
                  class="form-data-actions__btn"
                  long
                  @click="submitForm('formData', 'accept')"
                >
                  Применить
                </Button>
              </i-col>
              <i-col :sm="24" class-name="form-data-actions">
                <Button
                  :disabled="load"
                  type="primary"
                  class="form-data-actions__btn"
                  long
                  @click="submitForm('formData', 'save')"
                >
                  Сохранить
                </Button>
              </i-col>
            </Row>
          </i-col>
        </Row>
      </Form>
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
        type: '',
        location: 'global',
        active: true,
      },
      formTypes: [
        { name: 'Форма регистрации', value: 'registration' },
        { name: 'Форма материала', value: 'request' },
      ],
      formRules: {
        name: [{ required: true, message: 'Это поле обязательно!' }],
        type: [{ required: true, message: 'Это поле обязательно!' }],
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
      for (const key in this.formData) {
        this.$set(this.form, key, this.formData[key])
      }
    },
  },
}
</script>

<style lang="less">
@import './MainForm.less';
</style>
