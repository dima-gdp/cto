<!--TODO: Поправить мутации пропсов-->
<!--eslint-disable vue/no-mutating-props -->
<template>
  <div class="constructor-group">
    <div class="constructor-group-head">
      <div class="constructor-group-name">
        <template v-if="g.id !== null">
          <Input v-model="g.name" placeholder="Название группы" />
        </template>
        <template v-else>
          <p>{{ g.name }}</p>
        </template>
      </div>
      <div class="constructor-group-actions">
        <div>
          <Button
            v-if="g.id !== null"
            icon="md-close"
            size="small"
            class="constructor-group-actions__item"
            @click="removeGroup(g)"
          />
        </div>
      </div>
    </div>
    <div class="constructor-group-fields">
      <Draggable
        :list="g.fields"
        :group="{ name: 'fields', put: ['searchFields', 'fields'] }"
        tag="div"
        class="ivu-row-flex"
        style="margin-left: -7.5px; margin-right: -7.5px"
        @add="setAttributes(g)"
      >
        <slot></slot>
      </Draggable>
    </div>
  </div>
</template>

<script>
import Draggable from 'vuedraggable'

export default {
  name: 'Group',
  components: { Draggable },
  props: {
    g: {
      type: Object,
      default: () => ({}),
    },
  },
  watch: {
    g: {
      deep: true,
      handler(newValue, oldValue) {
        if (newValue) {
          this.setSort(newValue)
        }
      },
    },
  },
  methods: {
    removeGroup(group) {
      this.$emit('remove-group', group)
    },
    setAttributes(group) {
      const { id: groupId } = group
      group.fields = group.fields.map((f) => ({
        ...f,
        formLink: { ...f.formLink, groupId },
      }))
    },
    setSort(group) {
      group.fields.forEach((f, index) => {
        f.formLink.sort = index
      })
    },
  },
}
</script>

<style scoped></style>
