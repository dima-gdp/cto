<template>
  <div style="position: relative; min-height: 350px">
    <div v-if="!isFormLoading && !disabled" class="registration-form">
      <Form ref="form" :model="formModel" :rules="validateFormRules">
        <div v-for="group in groupsWithFields" :key="group.id" class="registration-form-group">
          <h3 v-if="group.name" class="registration-form-group__title">
            {{ group.name }}
          </h3>
          <div class="row">
            <FormItem
              v-for="field in group.fields"
              :key="field.id"
              :prop="field.id"
              :label="field.formLink.showLabel ? field.name : ' '"
              :class="`col-lg-${field.formLink.settings.col} col-sm-6 col-12`"
              :tip="field.help"
            >
              <FieldRenderer
                v-model="formModel[field.id]"
                :field="field"
                :disabled="isFieldNeedDisable(field)"
                :country-id="getCountryId(field)"
              />

              <OtherSettings
                v-if="field.formLink.other"
                v-model="formModel[field.id]"
                :field="field"
                @editOther="editOther(field, $event)"
                @hideOther="hideOther(field, $event)"
              />

              <CopySettings
                v-if="field.formLink.copy"
                :field="field"
                @copyField="copyField(field)"
                @removeCopied="removeCopied(field)"
              />
            </FormItem>
          </div>
        </div>
        <div v-if="fieldsWithoutGroup.length > 0" class="registration-form-group">
          <div class="row">
            <FormItem
              v-for="field in fieldsWithoutGroup"
              :key="field.id"
              :prop="field.id"
              :label="field.formLink.showLabel ? field.name : ' '"
              :class="`col-lg-${field.formLink.settings.col} col-sm-6 col-12`"
              :tip="field.help"
            >
              <FieldRenderer
                v-model="formModel[field.id]"
                :field="field"
                :disabled="isFieldNeedDisable(field)"
                :country-id="getCountryId(field)"
              />

              <OtherSettings
                v-if="field.formLink.other"
                v-model="formModel[field.id]"
                :field="field"
                @editOther="editOther(field, $event)"
                @hideOther="hideOther(field, $event)"
              />

              <CopySettings
                v-if="field.formLink.copy"
                :field="field"
                @copyField="copyField(field)"
                @removeCopied="removeCopied(field)"
              />
            </FormItem>
          </div>
        </div>
      </Form>
      <slot name="submit" :submit="submit"></slot>
    </div>
    <Spin v-else fix></Spin>
  </div>
</template>

<script>
import FieldRenderer from '@/components/common/field-renderer/index'

import OtherSettings from '@/components/common/field-renderer/settings/other'
import CopySettings from '@/components/common/field-renderer/settings/copy'
import { FieldEventBus } from '@/components/common/field-renderer/field-event-bus'
import { nanoid } from 'nanoid'
import useForm from '@/domain/composables/use-form'
import { DateTime } from '@/plugins/luxon'
import { camelize } from '@/utils'

export default {
  components: {
    FieldRenderer,
    OtherSettings,
    CopySettings,
  },

  props: {
    formId: { type: [Number, null], default: null },
    getValuesFunction: { type: [Function, null], default: null },
    disabled: { type: Boolean, default: false },
    clearForm: { type: Boolean, default: false },
  },

  data() {
    return {
      formModel: {},
      fields: [],
      groups: [],
      validateFormRules: {},
      disabledFields: {},
      isFormLoading: false,
      entityId: null, // если форма апдейтится, то там будет айди
    }
  },

  computed: {
    groupsWithFields() {
      if (this.groups) {
        return this.groups.map((group) => {
          const fields = this.fields.filter((f) => +f.formLink.groupId === +group.id)

          return { ...group, fields }
        })
      }

      return []
    },
    fieldsWithoutGroup() {
      if (this.fields) {
        return this.fields.filter((f) => f.formLink.groupId === null)
      }

      return []
    },
    linkedLocationFieldsDisabledMap() {
      const locationFieldsWithLinks = this.fields.filter(
        (f) => f.type === 'location' && f.formLink && f.formLink.dependentFormFieldId,
      )
      if (!locationFieldsWithLinks.length) {
        return {}
      }

      return locationFieldsWithLinks.reduce((acc, curr) => {
        const linkedCountryField = this.getLinkedCountryField(curr)

        const isCountryFieldHasValue = !!this.formModel[linkedCountryField.id]

        return { [curr.id]: !isCountryFieldHasValue }
      }, {})
    },
  },

  watch: {
    formId() {
      this.initForm()
    },
  },

  async created() {
    await this.initForm()
  },

  beforeDestroy() {
    FieldEventBus.$off('initValidation')
  },
  methods: {
    async initForm() {
      if (process.env.NODE_ENV === 'development') {
        // как же я люблю наш field-renderer :)
        console.warn(
          '[AppForm]: Внимание: HMR в этом компоненте отваливает инициализацию валидации, обновляйте страницу!',
        )
      }
      FieldEventBus.$on('initValidation', ({ id, rule }) => {
        if (!this.validateFormRules[id]) {
          // специально теряю реактивность (а то required валидация сразу отрабатывает и отображает ошибку)
          // именно это ломает hmr, но при этом так нужно для работы field-renderer
          // (причина не установлена, но какие то танцы с async-validator)
          // из-за этого и теряется hmr
          this.validateFormRules[id] = []
        }
        this.validateFormRules[id].push(rule)
      })

      await this.getForm()
    },
    async submit() {
      if (this.$refs.form) {
        const isValid = await this.$refs.form.validate()
        if (isValid) {
          const form = this.prepareForm(this.formModel)
          this.$emit('submit', { form: camelize(form), entityId: this.entityId })

          if (this.clearForm) this.formModel = {}
        } else {
          this.$Message.error(this.$tr('errors.formError'))
          console.error('Форма невалидна')
        }
      }
    },
    async getForm() {
      const { getFormData } = useForm()
      this.isFormLoading = true
      const [formData, fieldValues] = await Promise.all([
        getFormData(this.formId),
        this.getValuesFunction ? this.getValuesFunction() : null,
      ]).finally(() => (this.isFormLoading = false))
      this.fields = formData.fields
      this.groups = formData.groups

      if (fieldValues) {
        const [{ entityId }] = fieldValues
        this.entityId = entityId
        this.initModel(fieldValues)
      }
    },
    initModel(fieldValues) {
      // тут происходит магия вне хогвартса, перенесено из старого паблика без изменений
      this.fields.forEach((f) => {
        const valueField = fieldValues.find(({ fieldId }) => +fieldId === +f.id)

        if (!valueField) {
          return
        }

        let { value } = valueField
        const { type } = f
        const copyTypes = ['text', 'string', 'select']
        const isValueArray = Array.isArray(value)

        if (type === 'datatime') {
          value = DateTime.fromSeconds(+value).toFormat('dd-MM-yyyy')
        }

        if (copyTypes.includes(type) && isValueArray) {
          this.exposeCopies(f, value)
          return
        }

        if (value !== null) {
          this.$set(this.formModel, f.id, value)
        }
      })
    },
    exposeCopies(field, value) {
      const [firstValue] = value.splice(0, 1)
      this.$set(this.formModel, field.id, firstValue)

      value.forEach((val) => {
        const { id } = this.copyField(field)
        this.$set(this.formModel, id, val)
      })
    },
    copyField(field) {
      const newField = {
        ...field,
        id: field.copied ? `${field.rootId}__${nanoid()}` : `${field.id}__${nanoid()}`,
        rootId: field.copied ? field.rootId : field.id,
        copied: true,
      }

      const index = this.fields.findIndex((f) => f.id === field.id)

      const left = this.fields.slice(0, index + 1)
      const right = this.fields.slice(index + 1)
      this.fields = [...left, newField, ...right]

      return newField
    },
    async removeCopied(field) {
      this.fields = this.fields.filter((f) => f.id !== field.id)
      delete this.formModel[field.id]
    },
    editOther(field, payload) {
      const { disabled } = payload
      const { id } = field

      this.$set(this.disabledFields, id, disabled)
    },
    hideOther(field, payload) {
      const { disabled } = payload
      const { id } = field

      this.$set(this.disabledFields, id, disabled)
      delete this.formModel[field.id]
    },
    getLinkedCountryField(field) {
      return this.fields.find((f) => f.formLink.id === field.formLink.dependentFormFieldId)
    },
    isFieldNeedDisable(field) {
      if (field.type === 'location') {
        return this.linkedLocationFieldsDisabledMap[field.id]
      }
      return this.disabledFields[field.id]
    },
    getCountryId(field) {
      if (field.type !== 'location') {
        return
      }
      if (this.isFieldNeedDisable(field)) {
        return
      }

      const linkedCountryField = this.getLinkedCountryField(field)

      if (!linkedCountryField) {
        return
      }

      const countryFieldValue = this.formModel[linkedCountryField.id]

      if (!countryFieldValue) {
        return
      }

      return countryFieldValue.id
    },
    prepareForm(rawModel) {
      // todo: нужна техническая документация того, что тут происходит
      const model = this.dateToStamp({ ...rawModel }, this.fields)
      return Object.entries(model).reduce((acc, [fieldId, value]) => {
        const [id, copy] = fieldId.split('__')

        if (!copy) {
          acc.push({ fieldId, value })
        } else {
          const root = acc.find((root) => +root.fieldId === +id)

          if(!root) {
            acc.push({ fieldId: id, value })
            return acc
          }

          if (Array.isArray(root.value)) {
            root.value.push(value)
          }
          if (typeof root.value === 'string') {
            root.value = [root.value, value]
          }
        }

        return acc
      }, [])
    },
    dateToStamp(model) {
      return Object.fromEntries(
        Object.entries(model).map(([fieldId, value]) => {
          // перенес из старого кода, понятия не имею зачем эта строчка
          const [id] = fieldId.split('__')

          const isDateField = this.fields.some((f) => f.type === 'datatime' && +f.id === +id)
          if (isDateField && value) {
            const dateValue = DateTime.fromFormat(value, 'dd-MM-yyyy').toSeconds()

            return [fieldId, dateValue]
          }

          if (!value) {
            console.error(`Неверная обработка поля ${fieldId}`)
          }

          return [fieldId, value]
        }),
      )
    },
  },
}
</script>

<style lang="scss">
@import '~@/styles/blocks/registration.scss';
</style>
