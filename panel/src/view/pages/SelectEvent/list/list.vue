<template>
  <div class="list">
    <ul>
      <li v-for="(event, idx) in events" :key="idx" class="list-container">
        <CardEvent :event="event" @to-event="toEvent" />
      </li>
    </ul>
  </div>
</template>

<script>
import CardEvent from '@/view/pages/SelectEvent/card-event/card-event'

export default {
  components: { CardEvent },

  props: {
    events: { type: Array, default: () => [] },
  },

  methods: {
    async toEvent(event) {
      this.$emit('to-event', event)
    },
  },
}
</script>

<style lang="less">
@import './list.less';
</style>
