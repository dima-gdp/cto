<template>
  <div
    :class="{ 'disabled-block': disabled }"
    @click="onClick"
    @mousedown="onClick"
    @mouseup="onClick"
    @keydown="onClick"
    @keypress="onClick"
    @keyup="onClick"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onClick(event) {
      if (!this.disabled) {
        return
      }
      event.stopPropagation()
      event.preventDefault()
    },
  },
}
</script>

<style lang="less">
.disabled-block {
  cursor: not-allowed !important;
  opacity: 0.5;
}
</style>
