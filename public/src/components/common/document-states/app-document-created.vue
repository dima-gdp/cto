<template>
  <div class="document-card s-card">
    <div class="document-card__image-block">
      <img src="@/assets/graphics/document.svg" alt="document" />
    </div>
    <div class="document-card__status document-card__status--not-ready">
      {{ $tr('document.status.created') }}
    </div>
    <div class="document-card__title">{{ document.document.name }}</div>
    <div class="document-card__download">
      <Button size="small" type="success" target="_blank" @click="$emit('create')">
        {{ $tr('document.action.request') }}
      </Button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    document: { type: Object, default: () => ({}) },
  },
}
</script>

<style lang="scss">
@import '~@/styles/blocks/document-card.scss';
</style>
