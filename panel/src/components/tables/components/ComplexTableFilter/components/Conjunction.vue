<template>
  <Button size="default" type="primary" ghost long class="conjunction" @click="onClick">
    {{ isValueAnd ? 'И' : 'ИЛИ' }}
  </Button>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: 'and',
    },
  },

  computed: {
    isValueAnd() {
      return this.value === 'and'
    },
  },

  methods: {
    onClick() {
      this.$emit('input', this.isValueAnd ? 'or' : 'and')
    },
  },
}
</script>

<style scoped lang="less">
.conjunction {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
