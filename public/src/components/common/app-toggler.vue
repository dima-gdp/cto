<template>
  <div class="s-toggler" @click="$emit('onClick')">
    <slot></slot>
  </div>
</template>
<style lang="scss">
.s-toggler {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  background-color: var(--s-primary-color);
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  cursor: pointer;

  &--sidebar {
    margin-bottom: 24px;
  }
}
</style>
