<template>
  <Card dis-hover>
    <Input
      v-model="searchFieldValue"
      class="constructor-fields-all-items-search"
      placeholder="Введите id или название поля"
    />

    <div class="constructor-fields-all-items">
      <Draggable
        :list="searchFields"
        v-bind="{ ...searchFieldsDragSettings }"
        :move="transformFieldBeforeMove"
      >
        <div
          v-for="field in searchFields"
          :key="field.id"
          class="constructor-fields-all-items__item"
          :class="{
            'constructor-fields-all-items__item--disabled': usedFields.includes(+field.id),
          }"
        >
          <Card dis-hover>
            <!--            <Icon size="16" :type="iconMap[field.type]" class="field-card__icon" />-->
            [{{ field.id }}]
            {{ field.name }}
          </Card>
        </div>
      </Draggable>
    </div>
  </Card>
</template>

<script>
import Draggable from 'vuedraggable'
import { ICON_MAP } from '../helpers'

export default {
  name: 'FieldsSelector',
  components: { Draggable },
  props: {
    // TODO: Поставить тип по-умолчанию у пропсов
    /* eslint-disable vue/require-prop-types */
    formId: {
      required: true,
    },
    /* eslint-enable vue/require-prop-types */
    allFields: {
      type: Array,
      default: () => [],
    },
    usedFields: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      iconMap: ICON_MAP,
      searchFieldValue: '',
      searchFieldsDragSettings: {
        group: {
          name: 'searchFields',
          put: false,
          pull: 'clone',
        },
        sort: false,
      },
    }
  },
  computed: {
    searchFields() {
      return this.allFields.filter((f) => {
        const search = this.searchFieldValue.trim()
        const isNumber = isFinite(search)

        if (search === '') {
          return true
        }
        if (isNumber) {
          return +f.id === +search
        }

        return f.name.toLowerCase().includes(search.toLowerCase())
      })
    },
  },
  methods: {
    isFieldUsed(field) {
      return this.usedFields.includes(+field.id)
    },
    transformFieldBeforeMove(ctx) {
      const {
        draggedContext: { element: field },
      } = ctx

      if (this.isFieldUsed(field)) {
        return false
      }

      field.formLink = {
        formId: this.formId,
        fieldId: field.id,
        settings: { col: 3 },
      }
    },
  },
}
</script>

<style scoped></style>
