export default {
  methods: {
    handleInput(value) {
      this.$emit('input', value)
    },
    handleSearch(value, key) {
      if (!('' + value)) {
        // value может быть массивом, это такая великолепная проверка
        // (потому что пустой массив это truthy)
        // #ялюблюjs
        this.$emit('clear', key)
      } else {
        this.$emit('search')
      }
    },
  },
}
