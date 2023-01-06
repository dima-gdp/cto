<template>
  <i-col :span="field.formLink.settings.col * 2 || 6" class="constructor-group-fields__col">
    <Card
      :class="{
        'field-card--selected': +selectedField.id === +field.id,
        'field-card--local': field.location === 'local',
      }"
      tabindex="0"
    >
      <div
        class="field-card"
        :class="{
          'field-card--linked': isLinked,
        }"
        @click="selectField(field)"
      >
        <div class="field-card__name">
          [{{ field.id }}]
          {{ field.name }}
          <span v-if="field.formLink.required" style="color: red">*</span>
        </div>
        <div class="field-card-actions">
          <Icon
            v-if="isLocal"
            size="18"
            type="md-create"
            class="field-card__icon"
            style="cursor: pointer; margin-right: 0"
            @click="$emit('make-local')"
          />
          <Button
            icon="md-close"
            size="small"
            class="field-card-actions__item"
            @click="removeField(field)"
          />
        </div>
      </div>
    </Card>
  </i-col>
</template>

<script>
import { ICON_MAP } from '../helpers'

export default {
  name: 'Field',
  props: {
    selectedField: { type: Object, default: () => ({}) },
    field: { type: Object, default: () => ({}) },
    isLocal: { type: Boolean, default: false },
    isLinked: { type: Boolean, default: false },
  },
  data() {
    return {
      iconMap: ICON_MAP,
    }
  },
  methods: {
    selectField(field) {
      this.$emit('select-field', field)
    },
    removeField(field) {
      this.$emit('remove-field', field)
    },
  },
}
</script>

<style scoped></style>
