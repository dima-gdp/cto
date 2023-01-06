<template>
  <div :class="classNames">
    <DatePicker
      :value="realValue"
      :placeholder="filter.placeholder"
      class="search-input"
      type="daterange"
      clearable
      :placement="filter.placement"
      @input="handleInput"
      @on-change="handleSearch"
    />
  </div>
</template>

<script>
import dayjs from 'dayjs'
import fieldMixin from '../mixins/fieldMixin'

export default {
  mixins: [fieldMixin],
  props: {
    filter: {
      type: Object,
      required: true,
    },
    // TODO: Поставить тип по-умолчанию у пропсов
    /* eslint-disable vue/require-prop-types */
    value: {
      required: true,
    },
    /* eslint-enable vue/require-prop-types */
  },
  computed: {
    realValue() {
      if (!this.value || !this.value.length) {
        return []
      }
      return this.value.map((el) => new Date(+el * 1000))
    },
  },
  methods: {
    handleInput(value) {
      const [start, end] = value
      if (!start || !end) {
        return
      }
      const formatedValue = [dayjs(start).unix(), dayjs(end).unix()]

      this.$emit('input', formatedValue)
    },
    handleSearch(value) {
      const isEmpty = value.includes('')

      if (isEmpty) {
        this.$emit('clear', this.filter.key)
      } else {
        this.$emit('search')
      }
    },
  },
}
</script>
