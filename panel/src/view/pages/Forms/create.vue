<template>
  <div>
    <Row type="flex" justify="center" align="middle" class-name="view-header">
      <i-col class-name="view-header__divider">
        <Divider orientation="left">
          <span style="font-size: 36px">Создание формы</span>
        </Divider>
      </i-col>
      <i-col class-name="view-header__back">
        <Button icon="ios-arrow-round-back" @click="$router.push('/forms/list')"> Назад </Button>
      </i-col>
    </Row>
    <MainForm :load="load" :form-data="formData" @on-submit="buildForm" />
  </div>
</template>

<script>
import MainForm from './components/MainForm'

import { createForm } from '@/api/forms'

export default {
  components: {
    MainForm,
  },
  data() {
    return {
      constructorModel: [],
      formData: {},
      load: false,
    }
  },
  methods: {
    async buildForm([formData, action]) {
      try {
        const id = await this.createForm(formData)

        this.$Message.success('Форма успешно создана!')

        if (action === 'accept') {
          await this.$router.push({ path: `/forms/edit/${id}` })
        }
        if (action === 'save') {
          await this.$router.push({ path: '/forms/list' })
        }
      } catch (e) {
        this.$Message.error('Ошибка при создании формы!')
        throw new Error(e)
      }
    },
    async createForm(formData) {
      try {
        const { data } = await createForm(formData)
        const { id } = data

        return id
      } catch (e) {
        throw new Error(e)
      }
    },
  },
}
</script>

<style></style>
