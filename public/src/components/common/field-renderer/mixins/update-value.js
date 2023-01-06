export default {
  methods: {
    updateValue(value) {
      this.$emit('input', value)
    },
  },
}
