<template>
  <Input
    v-model="realValue"
    v-mask="'##-##-####'"
    :disabled="disabled"
    :placeholder="field.placeholder"
    type="text"
  />
</template>

<script>
import InitValidation from '../mixins/init-validation'
import UpdateValue from '../mixins/update-value'

export default {
  mixins: [InitValidation, UpdateValue],
  props: {
    value: {
      type: [String, Number, null],
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
  data() {
    return {
      realValue: '',
    }
  },
  watch: {
    // Перенес таким образом для того чтобы использовать
    // v-model с v-mask вместо не v-bind:value и v-on:input
    // v-model рекомендуют использовать в доке v-mask https://www.npmjs.com/package/v-mask#rocket-usage
    value(v) {
      this.realValue = v
    },
    realValue(value) {
      this.$emit('input', value)
    },
  },
  mounted() {
    this.realValue = this.value
  },
}
</script>

<style></style>
