<template>
  <Select ref="select" class="tree-select" v-bind="$attrs" multiple @on-change="handleChange">
    <TreeSelectTreeItem
      :selected-array="value"
      :data="data"
      :load-data="loadData"
      @on-clear="handleClear"
      @on-check="handleTreeCheck"
    ></TreeSelectTreeItem>
  </Select>
</template>

<script>
import Emitter from 'iview/src/mixins/emitter'
import TreeSelectTreeItem from './tree-select-tree.vue'
export default {
  name: 'TreeSelect',
  components: {
    TreeSelectTreeItem,
  },
  mixins: [Emitter],
  provide() {
    return {
      parent: this,
    }
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Array,
      default: () => [],
    },
    // TODO: Поставить значения по-умолчанию у пропсов
    /* eslint-disable vue/require-default-prop */
    loadData: Function,
    /* eslint-enable vue/require-default-prop */
  },
  data() {
    return {
      isChangedByTree: true,
      isInit: true,
    }
  },
  methods: {
    handleChange(selected) {
      if (!this.isChangedByTree) this.$emit('input', selected)
      this.isChangedByTree = false
    },
    handleTreeCheck(selectedArray) {
      this.isChangedByTree = true
      this.$emit(
        'input',
        selectedArray.map((item) => item.id)
      )
    },
    handleClear() {
      this.$refs.select.reset()
    },
  },
}
</script>

<style lang="less">
.tree-select {
  .ivu-select-dropdown {
    padding: 0 6px;
  }
}
</style>
