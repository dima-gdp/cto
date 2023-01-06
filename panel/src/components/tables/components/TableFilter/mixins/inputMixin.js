export default {
  methods: {
    handleInput(value) {
      this.$emit('input', value)
    },
    handleSearch() {
      this.$emit('search')
    },
    handleClear(e, key) {
      if (e.target.value === '') {
        this.$emit('clear', key)
      }
    },
  },
}
