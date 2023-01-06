<template>
  <div>
    <Input
      :value="realValue"
      class="search-input"
      :placeholder="filter.placeholder"
      clearable
      @input="handleInput"
      @keyup.enter.native="$emit('search', filter.key)"
      @on-change="handleClear($event, filter.key)"
    />
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
      type: [Object, String],
      default: '',
      required: true,
    },
  },
  computed: {
    realValue() {
      if (typeof this.value === 'object') {
        return this.value[this.filter.mode]
      }
      return this.value
    },
  },

  methods: {
    handleInput(value) {
      if (this.filter.mode === 'ilike') {
        this.$emit('input', { ilike: value })
        return
      }
      this.$emit('input', value)
    },

    handleClear(e, key) {
      if (e.target.value === '') {
        this.$emit('clear', key)
      }
    },
  },
}
</script>
