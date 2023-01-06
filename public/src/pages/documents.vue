<template>
  <div class="document-page">
    <div v-if="isLoading" class="document-page__loading">
      <Spin fix></Spin>
    </div>
    <component
      :is="currentDocumentState"
      v-else
      :document="document"
      @refresh="getDocument"
      @create="setUserDocument"
    />
  </div>
</template>
<script>
import useDocument from '@/domain/composables/use-document'
import DocumentCreated from '@/components/common/document-states/app-document-created'
import DocumentNotReady from '@/components/common/document-states/app-document-not-ready'
import DocumentReady from '@/components/common/document-states/app-document-ready'
import DocumentFailed from '@/components/common/document-states/app-document-failed'
import { DOCUMENT_STATUS_ENUM } from '@/utils/constants'

export default {
  components: {
    DocumentNotReady,
    DocumentReady,
    DocumentFailed,
    DocumentCreated,
  },
  data() {
    return {
      document: null,
      isLoading: false,
    }
  },
  computed: {
    currentDocumentState() {
      if (!this.document) {
        return null
      }
      const status = this.document?.status
      if (status === DOCUMENT_STATUS_ENUM.COMPLETED) {
        return DocumentReady
      } else if (status === DOCUMENT_STATUS_ENUM.FAILED) {
        return DocumentFailed
      } else if (status === DOCUMENT_STATUS_ENUM.CREATED || status === DOCUMENT_STATUS_ENUM.OLD) {
        return DocumentCreated
      }
      return DocumentNotReady
    },
  },
  watch: {
    '$route.params.documentTemplateId': {
      handler() {
        this.getDocument()
      },
      immediate: true,
    },
  },
  methods: {
    async getDocument() {
      const eventId = this.$store.getters['event/currentEventId']
      const userId = this.$store.state.auth.userId
      const templateId = this.$route.params.documentTemplateId

      this.isLoading = true
      try {
        const { document } = await useDocument().getDocument(eventId, userId, templateId)
        this.document = document
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },

    async setUserDocument() {
      this.isLoading = true
      try {
        const { document } = await useDocument().setUserDocument(this.document.id)
        this.document = document
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>
<style lang="scss">
.document-page {
  display: grid;
  grid-template-columns: repeat(4, 3fr);
  gap: 15px;

  @include media-breakpoint-down(sm) {
    grid-template-columns: 1fr;
  }

  &__loading {
    position: relative;
    min-height: 425px;
    max-width: 336px;
  }
}
</style>
