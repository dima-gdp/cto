<template>
  <div :class="classNames">
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
import fieldMixin from '../mixins/fieldMixin'
import selectMixin from '../mixins/selectMixin'

export default {
  mixins: [selectMixin, fieldMixin],
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
}
</script>
