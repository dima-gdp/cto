<!--TODO: Поправить мутации пропсов-->
<!--eslint-disable vue/no-mutating-props -->
<template>
  <Card v-if="Object.keys(selectedField).length" dis-hover class="settings-field">
    <Form label-position="top" :model="selectedField">
      <Row>
        <i-col span="11">
          <FormItem v-if="fieldsSettingsMap[selectedField.type].required" label="Обязательность">
            <i-switch v-model="selectedField.formLink.required" size="large">
              <span slot="open">Да</span>
              <span slot="close">Нет</span>
            </i-switch>
          </FormItem>
        </i-col>
        <i-col span="13">
          <FormItem v-if="fieldsSettingsMap[selectedField.type].copy" label="Копирование">
            <i-switch v-model="selectedField.formLink.copy" size="large">
              <span slot="open">Да</span>
              <span slot="close">Нет</span>
            </i-switch>
          </FormItem>
        </i-col>
      </Row>
      <Row>
        <i-col span="11">
          <FormItem v-if="fieldsSettingsMap[selectedField.type].other" label='Опция "Другое"'>
            <i-switch v-model="selectedField.formLink.other" size="large">
              <span slot="open">Да</span>
              <span slot="close">Нет</span>
            </i-switch>
          </FormItem>
        </i-col>
        <i-col span="13">
          <FormItem v-if="fieldsSettingsMap[selectedField.type].showLabel" label="Отображать лейбл">
            <i-switch v-model="selectedField.formLink.showLabel" size="large">
              <span slot="open">Да</span>
              <span slot="close">Нет</span>
            </i-switch>
          </FormItem>
        </i-col>
      </Row>
      <FormItem
        v-if="fieldsSettingsMap[selectedField.type].extensions"
        label="Список возможных расширений"
      >
        <Input v-model="selectedField.formLink.extensions" placeholder="jpg, docx, mp4" />
      </FormItem>
      <FormItem v-if="fieldsSettingsMap[selectedField.type].settings.col" label="Ширина поля">
        <Select v-model="selectedField.formLink.settings.col" placeholder="Выберите ширину поля">
          <Option v-for="num in 12" :key="num" :value="num">
            {{ num }}
          </Option>
        </Select>
      </FormItem>
      <FormItem
        v-if="fieldsSettingsMap[selectedField.type].dependentFormFieldId"
        label="Привязать поле"
      >
        <Select
          v-model="selectedField.formLink.dependentFormFieldId"
          placeholder="Выберите поле типа страна"
          clearable
        >
          <Option v-for="field in countryFields" :key="field.id" :value="field.formLink.id">
            {{ `Поле с ID ${field.id}` }}
          </Option>
        </Select>
      </FormItem>
    </Form>
  </Card>
</template>

<script>
import { FIELDS_SETTINGS_MAP } from '../helpers'

export default {
  name: 'FieldSettings',
  props: {
    selectedField: { type: Object, default: () => ({}) },
    selectedFieldList: { type: Array, default: () => [] },
  },
  data() {
    return {
      fieldsSettingsMap: FIELDS_SETTINGS_MAP,
    }
  },
  computed: {
    countryFields() {
      if (this.selectedField.type !== 'location') {
        return []
      }

      return this.selectedFieldList.filter((f) => f.type === 'country')
    },
  },
}
</script>

<style>
.settings-field .ivu-form .ivu-form-item-label {
  text-align: left;
}
</style>
