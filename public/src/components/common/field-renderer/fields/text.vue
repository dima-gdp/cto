<template>
  <Input
    :value="value"
    :disabled="disabled"
    :placeholder="field.placeholder"
    type="textarea"
    autosize
    @input="updateValue"
  />
</template>

<script>
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
