<template>
  <div>
    <div class="constructor-head">
      <h2 v-if="form.name">
        {{ form.name }}
      </h2>
      <div v-else></div>
      <div class="constructor-head-actions">
        <Button type="primary" size="small" @click="addGroup"> Добавить группу </Button>
      </div>
    </div>
    <div class="constructor-container">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Constructor',
  props: {
    form: {
      type: Object,
      default: () => ({}),
    },
  },
  methods: {
    addGroup() {
      const groupModel = {
        fields: [],
        formId: this.form.id,
        name: 'Введите название группы',
        sort: 0,
      }

      this.$emit('add-group', groupModel)
    },
    checkEmptyGroup(ctx) {},
  },
}
</script>

<style scoped></style>
