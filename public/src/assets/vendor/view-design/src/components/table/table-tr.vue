<template>
  <tr
    v-if="draggable"
    :class="rowClasses(row._index)"
    :draggable="draggable"
    @dragstart="onDrag($event, row._index)"
    @drop="onDrop($event, row._index)"
    @dragover="allowDrop($event)"
  >
    <slot></slot>
  </tr>
  <tr v-else :class="rowClasses(row._index)">
    <slot></slot>
  </tr>
</template>
<script>
export default {
  props: {
    row: Object,
    prefixCls: String,
    draggable: Boolean,
  },
  computed: {
    objData() {
      return this.$parent.objData
    },
  },
  methods: {
    onDrag(e, index) {
      e.dataTransfer.setData('index', index)
    },
    onDrop(e, index) {
      const dragIndex = e.dataTransfer.getData('index')
      this.$parent.$parent.dragAndDrop(dragIndex, index)
      e.preventDefault()
    },
    allowDrop(e) {
      e.preventDefault()
    },
    rowClasses(_index) {
      return [
        `${this.prefixCls}-row`,
        this.rowClsName(_index),
        {
          [`${this.prefixCls}-row-highlight`]:
            this.objData[_index] && this.objData[_index]._isHighlight,
          [`${this.prefixCls}-row-hover`]: this.objData[_index] && this.objData[_index]._isHover,
        },
      ]
    },
    rowClsName(_index) {
      return this.$parent.$parent.rowClassName(this.objData[_index], _index)
    },
  },
}
</script>
