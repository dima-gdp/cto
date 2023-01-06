export default {
  methods: {
    handleInput(value) {
      this.$emit('input', value)
    },
    handleSearch(value, key) {
      this.$emit('search')
    },
  },
}
