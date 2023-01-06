<template>
  <div>
    <DatePicker
      :value="realValue"
      :placeholder="filter.placeholder"
      class="search-input"
      type="daterange"
      clearable
      :placement="filter.placement"
      @on-change="handleSearch"
    />
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  props: {
    filter: {
      type: Object,
      required: true,
    },
    value: {
      type: [Array, Object],
      default: () => [],
    },
  },
  computed: {
    realValue() {
      if (this.value.gte && this.value.lte) {
        return [dayjs.unix(this.value.gte).toDate(), dayjs.unix(this.value.lte).toDate()]
      }

      if (!this.value || !this.value.length) {
        return []
      }

      return this.value.map((el) => new Date(+el * 1000))
    },
  },
  methods: {
    handleSearch(value) {
      const [start, end] = value
      if (!start || !end) {
        this.$emit('input', [])
        this.$emit('clear', this.filter.key)
        return
      }

      const gte = dayjs(start).unix()
      const lte = start === end ? dayjs(start).endOf('day').unix() : dayjs(end).endOf('day').unix()

      const formattedValue = { gte, lte }
      this.$emit('input', formattedValue)
      this.$emit('search')
    },
  },
}
</script>
