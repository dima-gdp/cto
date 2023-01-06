<template>
  <div>
    <Row type="flex" justify="center" align="middle" class-name="view-header">
      <i-col class-name="view-header__divider">
        <Divider orientation="left">
          <span style="font-size: 36px">Редактирование поля</span>
        </Divider>
      </i-col>
      <i-col class-name="view-header__back">
        <Button icon="ios-arrow-round-back" @click="$router.push('/form-fields/list')">
          Назад
        </Button>
      </i-col>
    </Row>

    <FieldConstructor
      :field="field"
      :load="load"
      @on-submit="updateField"
      @remove-value="removeValue"
      @change-lang="getField"
    />
  </div>
</template>

<script>
import FieldConstructor from '@/components/FieldConstructor'

import { updateField, updateValue, createValue, deleteValue, getCurrentField } from '@/api/forms'

export default {
  name: 'EditField',
  components: { FieldConstructor },
  data() {
    return {
      load: false,
      lang: 'ru',
      field: {},
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    },
  },
  created() {
    this.getField()
  },
  methods: {
    async updateField([form, values, lang, action]) {
      this.load = true
      try {
        const params = { lang }
        const {
          data: { id },
        } = await updateField(this.id, form, params)
        values.forEach((val) => {
          val.fieldId = id
        })

        await this.updateAllValues(values, lang)
        this.$Message.success('Поле успешно обновлено')
      } catch (e) {
        console.error(e)
        this.load = false
      }

      if (action === 'save') {
        await this.$router.push({ path: '/form-fields/list' })
      }
      this.load = false
    },
    async updateAllValues(values, lang) {
      try {
        const params = { lang }
        const promiseArr = values.map(async (val, index) => {
          if (!val.id) {
            const {
              data: { id },
            } = await createValue(val, params)
            values[index]['id'] = id
          } else {
            updateValue(val.id, val, params)
          }
        })
        await Promise.all(promiseArr)
      } catch (e) {
        console.error(e)
      }
    },
    async getField(lang) {
      this.lang = lang
      this.load = true
      try {
        const params = {
          include: 'values',
          lang,
        }
        const { data } = await getCurrentField(this.id, params)
        this.field = data
        this.load = false
      } catch (e) {
        this.load = false
        throw new Error(e)
      }
    },
    async removeValue(value) {
      try {
        this.load = true
        const id = value
        await deleteValue(id)
        this.load = false
      } catch (e) {
        this.load = false
        throw new Error(e)
      }
    },
  },
}
</script>
