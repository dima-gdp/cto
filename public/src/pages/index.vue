<template>
  <div>
    <AppPreloader v-if="isLoading" class="landing-preloader" />
    <div v-html="html"></div>
  </div>
</template>

<script>
import useEventLanding from '@/domain/composables/use-event-landing'
import LangService from '@/domain/services/lang-service'
import ThemeService from '@/domain/services/theme-service'
import AppPreloader from '@/components/base/app-preloader'
import { AVAILABLE_LANGUAGES } from '@/utils/constants'
import { setDocumentTitle } from '@/utils'

export default {
  components: {
    AppPreloader,
  },

  data() {
    return {
      html: '',
      landingNotFound: false,
      isLoading: false,
    }
  },

  async created() {
    if (!this.$store.state.event.data.showLanding) {
      LangService.toLocalePath({ path: '/login' })
      return
    }

    try {
      this.isLoading = true
      setDocumentTitle(this.$store.state.event.data.displayName)
      await this.loadLanding()
    } catch (e) {
      console.error(e)
      await LangService.toLocalePath({ path: '/404' })
    } finally {
      this.isLoading = false
    }
  },

  methods: {
    async loadLanding() {
      const lang = this.$route.query.lang || AVAILABLE_LANGUAGES.ru
      const [landing] = await useEventLanding().getEventLandings({
        filter: { eventId: this.$store.state.event.data.id, lang },
      })

      if (!landing) {
        await LangService.toLocalePath({ path: '/404' })
        return
      }

      this.html = landing.body
      await ThemeService.loadLandingResources(landing)
    },
  },
}
</script>

<style lang="scss">
.landing-preloader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
}
</style>
