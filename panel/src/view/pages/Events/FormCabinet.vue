<template>
  <div></div>
</template>
<script>
export default {
  model: {
    prop: 'formTypeEvent',
    event: 'updateFormTypeEvent',
  },
  props: {
    formTypeEvent: {
      type: Object,
      default: () => ({}),
    },
  },
}
</script>
