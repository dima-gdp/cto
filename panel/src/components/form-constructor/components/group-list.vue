<template>
  <Draggable
    :list="groups"
    :group="{ name: 'groups' }"
    :move="checkEmptyGroup"
    handle=".constructor-group-head"
  >
    <slot></slot>
  </Draggable>
</template>

<script>
import Draggable from 'vuedraggable'

export default {
  name: 'GroupList',
  components: { Draggable },
  props: {
    groups: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    groups: {
      deep: true,
      handler(newValue, oldValue) {
        if (newValue) {
          this.setSort(newValue)
        }
      },
    },
  },
  methods: {
    checkEmptyGroup(ctx) {
      const {
        draggedContext: { element: group },
      } = ctx
      if (group.id === null) {
        return false
      }
    },
    setSort(groups) {
      groups.forEach((g, index) => {
        g.sort = index
      })
    },
  },
}
</script>

<style scoped></style>
