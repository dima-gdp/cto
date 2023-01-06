<template>
  <Input
    v-model="phoneNumber"
    v-mask="dynamicMask"
    :disabled="disabled"
    :placeholder="field.placeholder"
    type="tel"
    clearable
  />
</template>

<script>
import InitValidation from '../mixins/init-validation'

const BASE_NUMBER_MASK = '################'

export default {
  mixins: [InitValidation],
  props: {
    value: {
      type: [Number, String],
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
      dynamicMask: null,
    }
  },
  computed: {
    phoneNumber: {
      get() {
        return this.value
      },
      set(number) {
        this.setPhoneMask(number)
      },
    },
  },

  methods: {
    setPhoneMask(number) {
      this.dynamicMask = BASE_NUMBER_MASK

      if (number.charAt(0) === '8') {
        this.dynamicMask = '8 (###)-###-##-##'
        this.$emit('input', number)
        return
      }

      if (number.charAt(0) === '7' || number.slice(0, 2) === '+7' || number.slice(0, 3) === '+ 7') {
        this.dynamicMask = '+ # (###)-###-##-##'
        this.$emit('input', number)
        return
      }

      if (number.charAt(0) === '+') {
        this.dynamicMask = `+${BASE_NUMBER_MASK}`
        this.$emit('input', number)
        return
      }

      // Если стерли значение
      if (number === '') {
        this.dynamicMask = null
        this.$emit('input', '')
        return
      }

      // Если любое другое число
      if (!isNaN(number)) {
        this.dynamicMask = `+${BASE_NUMBER_MASK}`
        this.$emit('input', number)
        return
      }

      this.$emit('input', number)
    },
  },
}
</script>

<style></style>
