<template>
  <CheckboxGroup :value="value" :disabled="disabled" @input="updateValue">
    <Checkbox v-for="fieldValue in field.values" :key="fieldValue.id" :label="fieldValue.value">
      {{ fieldValue.value }}
    </Checkbox>
  </CheckboxGroup>
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
