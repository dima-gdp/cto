<template>
  <div>
    <RadioGroup
      v-model="radioValue"
      size="small"
      class="search-input"
      @input="$emit('input', radioValue)"
      @on-change="handleChange"
    >
      <template v-for="item in filter.data">
        <Radio :key="item.value" :label="item.value">
          <span>{{ item.name }}</span>
        </Radio>
      </template>
    </RadioGroup>
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
      type: String,
      required: true,
      default: '',
    },
  },
  data() {
    return {
      radioValue: this.filter.default,
    }
  },
  watch: {
    filter: {
      handler(val) {
        this.radioValue = val.default
      },
      immediate: true,
    },

    value(val) {
      this.radioValue = val
    },
  },

  methods: {
    handleInput(value) {
      this.$emit('input', value)
    },

    handleChange(val) {
      if (val) {
        this.$emit('search')
        return
      }
      this.$emit('clear', this.filter.key)
    },
  },
}
</script>
