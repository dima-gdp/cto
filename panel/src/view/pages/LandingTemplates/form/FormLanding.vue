<template>
  <Form ref="form" :model="formLanding" :rules="$options.formRules" label-position="top">
    <Row :gutter="12" type="flex" align="middle">
      <i-col span="8">
        <FormItem prop="name" label="Название">
          <Input v-model="formLanding.name" />
        </FormItem>
      </i-col>
      <i-col span="12">
        <FormItem prop="description" label="Описание">
          <Input v-model="formLanding.description" />
        </FormItem>
      </i-col>
    </Row>
    <div>
      <LandingEditor :code="codeLanding" @save="submitForm" />
    </div>
  </Form>
</template>

<script>
import LandingEditor from '@/components/landing-editor/landing-editor'

export default {
  components: { LandingEditor },

  props: {
    form: { type: Object, default: () => ({}) },
    code: { type: Object, default: () => ({ html: '', css: '', js: '' }), required: false },
  },

  formRules: {
    name: [{ required: true, message: 'Поле обязательно для заполнения!' }],
    lang: [{ required: true, message: 'Поле обязательно для заполнения!' }],
  },

  data() {
    return {
      formLanding: { name: '', description: '' },
      codeLanding: { html: '', css: '', js: '' },
    }
  },

  watch: {
    form(val) {
      this.formLanding = { ...val }
      this.codeLanding = { html: val.body, css: val.css, js: val.js }
    },
  },

  methods: {
    async submitForm(code, isExit) {
      const isFormValid = await this.$refs['form'].validate()

      if (isFormValid) {
        this.codeLanding = code
        this.$emit('submit', {
          form: { ...this.formLanding },
          code: { ...this.codeLanding },
          isExit,
        })
      }
    },
  },
}
</script>

<style scoped></style>
