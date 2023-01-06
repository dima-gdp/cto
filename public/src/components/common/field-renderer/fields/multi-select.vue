<template>
  <Select
    :value="value"
    :disabled="disabled"
    :placeholder="field.placeholder"
    multiple
    @input="updateValue"
  >
    <Option v-for="fieldValue in field.values" :key="fieldValue.id" :value="fieldValue.value">
      {{ fieldValue.value }}
    </Option>
  </Select>
</template>

<script>
import InitValidation from '../mixins/init-validation'
import UpdateValue from '../mixins/update-value'

export default {
  mixins: [UpdateValue, InitValidation],
  props: {
    value: {
      type: Array,
      default: () => [],
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
