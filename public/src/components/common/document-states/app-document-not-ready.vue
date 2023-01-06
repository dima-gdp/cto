<template>
  <div class="document-card s-card">
    <div class="document-card__image-block">
      <img src="@/assets/graphics/document.svg" alt="document" />
    </div>
    <div class="document-card__status document-card__status--not-ready">
      {{ $tr('document.status.notReady') }}
    </div>
    <div class="document-card__title">{{ document.document.name }}</div>
    <div class="document-card__loader">
      <Spin size="large"></Spin>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    document: { type: Object, default: () => ({}) },
  },
  data() {
    return {
      refreshTimer: null,
    }
  },
  mounted() {
    this.refresh()
  },
  destroyed() {
    clearTimeout(this.refreshTimer)
  },
  methods: {
    refresh() {
      const timeDelay = 60 * 1000
      this.refreshTimer = setInterval(() => this.$emit('refresh'), timeDelay)
    },
  },
}
</script>

<style lang="scss">
@import '~@/styles/blocks/document-card.scss';
</style>
