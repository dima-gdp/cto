<template>
  <RadioGroup :value="value" :disabled="disabled" @input="updateValue">
    <Radio v-for="fieldValue in field.values" :key="fieldValue.id" :label="fieldValue.value">
      {{ fieldValue.value }}
    </Radio>
  </RadioGroup>
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
