<template>
  <div class="juridical-page">
    <template v-if="!isLoading">
      <h1 class="juridical-page__title">
        {{ contentItem.name }}
      </h1>
      <div class="juridical-page__card s-card row">
        <div class="juridical-page__text">
          <AppMarkDown :text="contentItem.content" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import AppMarkDown from '@/components/common/app-markdown'
import useDomainContent from '@/domain/composables/use-domain-content'

export default {
  components: {
    AppMarkDown,
  },
  data() {
    return {
      contentId: this.$route.params.id,
      contentItem: null,
      isLoading: false,
    }
  },
  async created() {
    await this.getContentItem(this.contentId)
    document.title = this.contentItem.name
  },
  methods: {
    async getContentItem(id) {
      try {
        this.isLoading = true
        this.contentItem = await useDomainContent().getContentItem(id)
      } catch (e) {
        console.error(e)
        await this.$router.push(this.localePath({ name: 'not-found' }))
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>
<style lang="scss">
@import '~@/styles/pages/juridical-page.scss';
</style>
