<template>
  <div class="document-card s-card">
    <div class="document-card__image-block">
      <img src="@/assets/graphics/document.svg" alt="document" />
    </div>
    <div class="document-card__status document-card__status--ready">
      {{ $tr('document.status.ready') }}
    </div>
    <div class="document-card__title">{{ document.document.name }}</div>
    <div class="document-card__download">
      <Button
        size="small"
        type="primary"
        :to="`${document.file.baseUrl}${document.file.path}`"
        target="_blank"
      >
        {{ $tr('document.action.download') }}
      </Button>
      <div class="document-card__size-file">
        PDF, {{ fileSizeInMegabytes }} {{ $tr('document.other.megabytes') }}
      </div>
    </div>
    <Button type="primary" size="small" @click="$emit('create')">{{
      $tr('document.action.recreate')
    }}</Button>
  </div>
</template>

<script>
export default {
  props: {
    document: { type: Object, default: () => ({}) },
  },
  computed: {
    fileSizeInMegabytes() {
      if (!this.document.file) {
        return
      }
      const BYTES_IN_MEGA_BYTE = 1048576
      const megabytes = this.document.file.size / BYTES_IN_MEGA_BYTE
      return megabytes.toFixed(2)
    },
  },
}
</script>

<style lang="scss">
@import '~@/styles/blocks/document-card.scss';
</style>
