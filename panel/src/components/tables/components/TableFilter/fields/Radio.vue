<!--TODO: Поправить мутации пропсов-->
<!--eslint-disable vue/no-mutating-props -->
<template>
  <div :class="classNames">
    <RadioGroup
      v-model="filter.default"
      size="small"
      class="search-input"
      @input="handleInput"
      @on-change="handleSearch"
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
import fieldMixin from '../mixins/fieldMixin'
import radioMixin from '../mixins/radioMixin'

export default {
  mixins: [radioMixin, fieldMixin],
  props: {
    filter: {
      type: Object,
      required: true,
    },
    // TODO: Поставить тип по-умолчанию у пропсов
    /* eslint-disable vue/require-prop-types */
    value: {
      required: true,
      default: '',
    },
    /* eslint-enable vue/require-prop-types */
  },
}
</script>
