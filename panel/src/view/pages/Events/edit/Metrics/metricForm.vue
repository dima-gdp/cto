<template>
  <div>
    <Card style="margin-bottom: 15px">
      <Form
        v-if="!isLoading"
        ref="metricForm"
        label-position="top"
        :model="form"
        :rules="formRules"
      >
        <FormItem label="Метрика" prop="name">
          <Input v-model="form.name" placeholder="Введите название метрики" />
        </FormItem>
        <FormItem label="Тип" prop="type">
          <Select v-model="form.type" remote filterable placeholder="Выберите тип">
            <Option
              v-for="metricType in metricTypes"
              :key="metricType.metricName"
              :value="metricType.metricName"
              >{{ metricType.metricName }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="Ключ" prop="key">
          <Input v-model="form.key" placeholder="Введите ключ" />
        </FormItem>
      </Form>
      <Spin v-else fix />
    </Card>
    <Card v-if="isEdit" dis-hover>
      <Row :gutter="24">
        <i-col span="12">
          <Button long :disabled="isLoading" @click="save(false)">
            Сохранить и остаться на странице
          </Button>
        </i-col>
        <i-col span="12">
          <Button long type="primary" :disabled="isLoading" @click="save(true)">
            Сохранить и вернуться к списку метрик
          </Button>
        </i-col>
      </Row>
    </Card>
    <Card dis-hover v-else>
      <Row :gutter="24">
        <i-col span="24">
          <Button long :disabled="isLoading" type="primary" @click="save"> Создать </Button>
        </i-col>
      </Row>
    </Card>
  </div>
</template>

<script>
export default {
  props: {
    metricForm: { type: Object, default: () => ({}) },
    isLoading: { type: Boolean, default: false },
    isEdit: { type: Boolean, default: false },
  },

  data() {
    return {
      form: {
        name: '',
        key: '',
        type: '',
      },
      formRules: {
        key: [{ required: true, message: 'Поле обязательно для заполнения!' }],
        type: [{ required: true, message: 'Поле обязательно для заполнения!' }],
        name: [{ required: true, message: 'Поле обязательно для заполнения!' }],
      },
      metricTypes: [
        {
          metricName: 'yandex',
        },
        {
          metricName: 'google',
        },
      ],
    }
  },

  watch: {
    metricForm(form) {
      this.form = { ...form }
    },
  },

  methods: {
    async save(isExit) {
      const isFormValid = await this.$refs['metricForm'].validate()
      if (isFormValid) {
        const form = { ...this.form, isExit }
        this.$emit('save', form)
      }
    },
  },
}
</script>
