export default {
  computed: {
    classNames() {
      const defaultClass = 'table-filter__item'

      if (this.filter.hasOwnProperty('className')) {
        const className = this.filter.className

        return Array.isArray(className)
          ? [defaultClass].concat(this.field.className)
          : [defaultClass].push(className)
      } else {
        return [defaultClass]
      }
    },
  },
}
