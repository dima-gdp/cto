<template>
  <div class="title">
    <div class="title__line title__line--left"></div>
    <h1 class="title__content">
      {{ value }}
    </h1>
    <div class="title__line"></div>
  </div>
</template>

<script>
export default {
  props: {
    value: { type: String, default: '' },
  },
}
</script>

<style scoped lang="less">
.title {
  display: flex;
  margin: 24px 0px;

  &__line {
    height: 16px;
    border-bottom: 1px solid #e8eaec;
    flex-grow: 1;

    &--left {
      max-width: 50px;
    }
  }

  &__content {
    padding: 0px 10px;
    font-weight: 500;
    line-height: 1;
    color: #17233d;
    font-size: 32px;
  }
}
</style>
