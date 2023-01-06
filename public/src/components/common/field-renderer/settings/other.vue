<template>
  <div class="form-settings-field">
    <div v-if="!otherShow" class="form-settings-field__setting" @click="editOther">
      <feather type="edit" size="16" stroke="var(--s-black-color-80)" />
      <span class="s-btn">
        {{ $tr('fieldSettings.other') }}
      </span>
    </div>
    <div v-else class="form-settings-field__other">
      <Input :value="value" size="default" @input="updateValue" />
    </div>

    <div v-if="otherShow" class="form-settings-field__remove" @click="hideOther">
      <feather type="x" size="16" stroke="var(--s-black-color-80)" />
    </div>
  </div>
</template>

<script>
import UpdateValue from '@/components/common/field-renderer/mixins/update-value'

export default {
  mixins: [UpdateValue],
  props: {
    value: undefined,
    field: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      otherShow: false,
    }
  },
  computed: {
    options() {
      if (this.field.values) {
        return this.field.values.map((v) => v.value)
      }

      return []
    },
    isValueInOptions() {
      return this.options.includes(this.value)
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(v) {
        if (v && !this.isValueInOptions) {
          this.editOther()
        }
      },
    },
  },
  methods: {
    editOther() {
      this.otherShow = true
      this.$emit('editOther', { disabled: true })
    },
    hideOther() {
      this.otherShow = false
      this.$emit('hideOther', { disabled: false })
    },
  },
}
</script>

<style lang="scss">
@import '~@/styles/blocks/form-settings-fields.scss';
</style>
