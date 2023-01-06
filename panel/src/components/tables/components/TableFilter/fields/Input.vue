<template>
  <div :class="classNames">
    <Input
      :value="realValue"
      class="search-input"
      :placeholder="filter.placeholder"
      clearable
      @input="handleInput"
      @keyup.enter.native="handleSearch"
      @on-change="handleClear($event, filter.key)"
    />
  </div>
</template>

<script>
import fieldMixin from '../mixins/fieldMixin'
import inputMixin from '../mixins/inputMixin'

export default {
  mixins: [inputMixin, fieldMixin],
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
      if (typeof this.value === 'object') {
        const [value] = Object.values(this.value)
        return value
      }
      return this.value
    },
  },
}
</script>
