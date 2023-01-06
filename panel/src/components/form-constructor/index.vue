<!--TODO: Поправить мутации пропсов-->
<!--eslint-disable vue/no-mutating-props -->
<template>
  <div class="constructor">
    <Row type="flex" :gutter="15">
      <i-col span="18">
        <Constructor :form="form" @add-group="addGroup">
          <GroupList :groups="value">
            <Group
              v-for="(g, gIndex) in value"
              :key="g.id"
              :g="g"
              @remove-group="removeGroup($event, gIndex)"
            >
              <Field
                v-for="(f, fIndex) in g.fields"
                :key="f.id"
                ref="fields"
                :field="f"
                :selected-field="selectedField"
                :is-local="isLocal"
                :is-linked="f.formLink.id === linkedFieldId"
                @make-local="$emit('make-local', f)"
                @select-field="onSelectField"
                @remove-field="removeField($event, g, fIndex)"
              />
            </Group>
          </GroupList>
        </Constructor>
      </i-col>
      <i-col span="6">
        <div class="constructor-side">
          <div class="constructor-fields-all">
            <FieldsSelector
              :form-id="form.id"
              :all-fields="allFields"
              :used-fields="usedFields"
            />
          </div>
          <div ref="settings" class="constructor-field-settings">
            <FieldSettings
              :selected-field="selectedField"
              :selected-field-list="value.map(g => [...g.fields]).flat()"
            />
          </div>
        </div>
      </i-col>
    </Row>
    <Spin v-if="loading" fix></Spin>
  </div>
</template>

<script>
// TODO: Поправить мутации пропсов
/* eslint-disable vue/no-mutating-props */
import Constructor from './components/constructor'
import GroupList from './components/group-list'
import Group from './components/group'
import FieldsSelector from './components/fields-selector'
import FieldSettings from './components/field-settings'
import Field from './components/field'

export default {
  name: 'FormConstructor',
  components: {
    Constructor,
    FieldSettings,
    FieldsSelector,
    GroupList,
    Group,
    Field,
  },
  props: {
    form: { type: Object, default: () => ({}) },
    value: { type: Array, default: () => [] },
    allFields: { type: Array, default: () => [] },
    loading: { type: Boolean, default: false },
    remoteMethods: { type: Object, default: () => ({}) },
    isLocal: { type: Boolean, default: false },
  },
  data () {
    return {
      selectedField: {},
      linkedFieldId: null,
    }
  },
  computed: {
    usedFields () {
      if (this.value.length <= 0) { return [] }
      return this.value
        .reduce((acc, current) => {
          return [...acc, ...current.fields]
        }, [])
        .map(f => +f.id)
    },
  },
  watch: {
    value: {
      deep: true,
      handler (newValue) {
        if (newValue) { this.$emit('input', newValue) }
      },
    },
  },
  methods: {
    // Fields
    clearSelected () {
      this.selectedField = {}
    },
    onSelectField (field) {
      this.linkedFieldId = field.formLink.dependentFormFieldId
      this.editFieldSettings(field)
    },
    editFieldSettings (field) {
      this.clearSelected()
      Object.entries(field).forEach(([key, value]) => {
        this.$set(this.selectedField, key, value)
      })
    },
    async removeField (field, group, fIndex) {
      const { formLink: { id } } = field

      if (!id) {
        group.fields.splice(fIndex, 1)
      } else {
        await this.remoteMethods.removeFormLink(id)
        group.fields.splice(fIndex, 1)
      }
      this.clearSelected()
    },
    // Groups
    async addGroup (groupModel) {
      const { data: group } = await this.remoteMethods.addGroup(groupModel)
      this.value.splice(0, 0, { ...group, fields: [] })
      this.clearSelected()
    },
    async removeGroup (group, gIndex) {
      const { id: groupId } = group
      if (!groupId) {
        this.value.splice(gIndex, 1)
      } else {
        await this.remoteMethods.removeGroup(groupId)
        this.value.splice(gIndex, 1)
      }
      this.clearSelected()
    },
  },
}
</script>

<style lang="less">
  .constructor {
    position: relative;
  }

  .constructor-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 25px;

    &__title {

    }

    .constructor-head-actions {

    }
  }

  .constructor-group {
    margin-bottom: 15px;
    border-radius: 4px;
    background-color: rgb(223, 223, 223);

    .constructor-group-head {
      display: flex;
      align-items: center;
      // justify-content: space-between;
      padding: 16px;
      cursor: grab;

      .constructor-group-name {
        flex-grow: 1;
      }

      .constructor-group-actions {
        flex-grow: 1;
        text-align: right;

        &__item {
          margin-left: 8px;
          cursor: pointer;
        }
      }
    }

    .constructor-group-fields {
      min-height: 50px;
      padding: 15px;
      background-color: white;
      border: 2px solid rgb(223, 223, 223);
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;

      &__col {
        margin-bottom: 15px;
        padding: 0 7.5px;

        & > .ivu-card  {
          display: flex;
          height: 100%;
          box-sizing: border-box;
          outline: none;

          &:focus {
            border: 2px solid #54a6fd;
          }

          .ivu-card-body {
            display: flex;
            align-items: center;
            flex-grow: 1;
            padding: 0;
          }
        }
      }
    }

    .field-card {
      display: flex;
      align-items: center;
      flex-grow: 1;
      padding: 10px 15px;
      height: 100%;

      &--local {
        border-color: #7b68ee;
      }

      &--selected {
        border: 2px solid #54a6fd;

        &:hover {
          border: 2px solid #54a6fd;
        }
      }

      &--linked {
        background: #f0f8ff;
      }

      &__icon {
        margin-right: 8px;
      }

      &__name {
        flex-grow: 1;
      }

      .field-card-actions {
        display: flex;
        align-items: center;

        &__item {
          margin-left: 8px;
        }
      }
    }
  }

  .constructor-side {
    position: sticky;
    top: 15px;

    .constructor-fields-all-items {
      max-height: 250px;
      overflow-y: auto;
      padding-right: 5px;

      &::-webkit-scrollbar {
        width: 5px;
        background-color: #f1f1f1;
        border-radius: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background-color: #308ceeb2;
        border-radius: 4px;
      }

      &__item {
        margin-bottom: 8px;
        cursor: grab;

        &--disabled {
          cursor: not-allowed;

          & > .ivu-card {
            background-color: #dfdfdf;
          }
        }
      }
    }

    .constructor-fields-all-items-search {
      margin-bottom: 15px;
    }

    .constructor-fields-all {
      margin-bottom: 15px;

      > .ivu-card {
        border: 2px solid rgb(223, 223, 223);
      }
    }

    .constructor-field-settings {
      > .ivu-card {
        border: 2px solid rgb(223, 223, 223);
      }
    }
  }
  .constructor-field-settings-actions {
    margin-bottom: 0px !important;

    & > .ivu-form-item-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
</style>
