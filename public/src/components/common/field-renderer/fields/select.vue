<template>
  <Select
    :value="value"
    :disabled="disabled"
    :placeholder="field.placeholder"
    clearable
    filterable
    @input="updateValue"
  >
    <Option v-for="fieldValue in field.values" :key="fieldValue.id" :value="fieldValue.value">
      {{ fieldValue.value }}
    </Option>
  </Select>
</template>

<script>
import debounce from 'lodash/debounce'
import InitValidation from '../mixins/init-validation'
import UpdateValue from '../mixins/update-value'

export default {
  mixins: [UpdateValue, InitValidation],
  props: {
    value: {
      type: String,
      default: '',
    },
    field: {
      type: Object,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style></style>
