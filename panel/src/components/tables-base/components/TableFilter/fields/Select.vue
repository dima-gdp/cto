<template>
  <div>
    <Select
      class="search-input"
      :value="value"
      :placeholder="filter.placeholder"
      :multiple="filter.multiple"
      filterable
      clearable
      @input="handleInput"
      @on-change="handleSearch($event, filter.key)"
    >
      <Option v-for="item in filter.data" :key="item.value" :value="item.value">
        {{ item.name }}
      </Option>
    </Select>
  </div>
</template>

<script>
export default {
  props: {
    filter: {
      type: Object,
      required: true,
    },
    value: {
      type: [Array, String],
      default: '',
    },
  },

  methods: {
    handleInput(value) {
      this.$emit('input', value)
    },
    handleSearch(value, key) {
      if (!value?.length) {
        this.$emit('clear', key)
      } else {
        this.$emit('search')
      }
    },
  },
}
</script>
