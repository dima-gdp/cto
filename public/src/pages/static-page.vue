<template>
  <div class="static-page">
    <div class="s-card">
      <div
        v-if="!pageIsLoading"
        class="static-page-content arx-content"
        v-html="staticPageContent"
      ></div>
      <Spin v-else fix></Spin>
    </div>
  </div>
</template>

<script>
import useStaticPage from '@/domain/composables/use-static-page'
import LangService from '@/domain/services/lang-service'
import { TIME_STATUSES } from '@/utils'

export default {
  data() {
    return {
      page: {},
      pageIsLoading: false,
    }
  },

  computed: {
    staticPageContent() {
      return this.page?.content?.html
    },
  },

  watch: {
    '$route.params.staticPageId': {
      handler() {
        this.fetchStaticPage()
      },
      immediate: true,
    },
  },

  methods: {
    async fetchStaticPage() {
      const staticPageId = this.$route.params.staticPageId
      this.pageIsLoading = true
      const { getStaticPage } = useStaticPage()
      const staticPage = await getStaticPage(staticPageId).finally(async () => {
        this.pageIsLoading = false
      })
      if (
        staticPage.autoActiveTimeStatus !== TIME_STATUSES.IN_PROGRESS ||
        staticPage.active !== true
      ) {
        await LangService.toLocalePath({ path: '/404' })
        return
      }
      this.page = staticPage
    },
  },
}
</script>

<style lang="scss">
@import '~@/styles/pages/static-page.scss';
@import '~@s256/article-editor/article-editor.min.css';
</style>
