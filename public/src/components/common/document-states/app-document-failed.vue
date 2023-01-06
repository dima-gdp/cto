<template>
  <div class="document-card s-card">
    <div class="document-card__image-block">
      <img src="@/assets/graphics/document.svg" alt="document" />
    </div>
    <div class="document-card__status document-card__status--failed">
      {{ $tr('document.status.failed') }}
    </div>
    <div class="document-card__title">{{ document.document.name }}</div>
    <div class="document-card__action">
      <Button type="primary" size="small" @click="$emit('create')">{{
        $tr('document.action.recreate')
      }}</Button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    document: { type: Object, required: true },
  },
}
</script>

<style lang="scss">
@import '~@/styles/blocks/document-card.scss';
</style>
