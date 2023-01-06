<template>
  <div class="form-settings-field">
    <div class="form-settings-field__setting" @click="$emit('copyField')">
      <feather type="copy" size="16" stroke="var(--s-black-color-80)" />
      <span class="s-btn">
        {{ $tr('fieldSettings.copy') }}
      </span>
    </div>
    <div v-if="field.copied" class="form-settings-field__remove" @click="$emit('removeCopied')">
      <feather type="trash" size="16" stroke="var(--s-black-color-80)" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    field: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>
<style lang="scss">
@import '~@/styles/blocks/form-settings-fields.scss';
</style>
