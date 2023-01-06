<template>
  <div>
    <Row type="flex" justify="center" align="middle" class-name="view-header">
      <i-col class-name="view-header__divider">
        <Divider orientation="left">
          <span style="font-size: 36px">Создание поля</span>
        </Divider>
      </i-col>
      <i-col class-name="view-header__back">
        <Button icon="ios-arrow-round-back" @click="$router.push('/form-fields/list')">
          Назад
        </Button>
      </i-col>
    </Row>

    <FieldConstructor :load="load" @on-submit="createField" />
  </div>
</template>

<script>
import { createField, createValue } from '@/api/forms'

import FieldConstructor from '@/components/FieldConstructor'

export default {
  name: 'CreateField',
  components: { FieldConstructor },
  data() {
    return {
      load: false,
    }
  },
  methods: {
    async createField([form, values, action]) {
      this.load = true
      try {
        const {
          data: { id },
        } = await createField(form)

        values.forEach((val) => {
          val.field_id = id
        })

        await this.createAllValues(values)
        this.$Message.success('Поле успешно создано')
        await this.$router.push({ path: `/form-fields/edit/${id}` })
      } catch (e) {
        console.error(e)
        this.load = false
      }

      if (action === 'save') {
        await this.$router.push({ path: '/form-fields/list' })
      }
      this.load = false
    },
    async createAllValues(values) {
      try {
        const promiseArr = values.map((val) => createValue(val))
        await Promise.all(promiseArr)
      } catch (e) {
        console.error(e)
      }
    },
  },
}
</script>
