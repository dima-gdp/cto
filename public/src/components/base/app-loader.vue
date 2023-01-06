<template>
  <div>
    <div v-if="!appIsLoading">
      <slot></slot>
    </div>
    <div v-else>
      <AppPreloader />
    </div>
  </div>
</template>

<script>
import AppPreloader from '@/components/base/app-preloader'
import AppLoadService from '@/domain/services/app-load-service'
import { addPagesToRules, checkAccessByRoute } from '@/domain/services/page-service'
import AccessError from '@/domain/errors/access-error'
import AuthService from '@/domain/services/auth-service'
import LangService from '@/domain/services/lang-service'
import EventService from '@/domain/services/event-service'
import useLocaleChange from '@/domain/composables/use-locale-change'
import ThemeService from '@/domain/services/theme-service'
import { mapGetters, mapState } from 'vuex'
import useMetric from '@/domain/composables/use-metric'

const routesForUncompletedRegistration = ['registration', 'content-item']

export default {
  components: {
    AppPreloader,
  },

  computed: {
    ...mapState({ appIsLoading: (state) => state.appIsLoading }),
    ...mapGetters('event', ['currentEventId']),
  },

  async created() {
    this.$store.commit('SET_APP_IS_LOADING', true)
    try {
      await this.loadAppData()
    } catch (e) {
      console.error(e)
      await LangService.toLocalePath({ path: '/404' })
    } finally {
      this.$store.commit('SET_APP_IS_LOADING', false)
    }
  },

  provide() {
    return {
      loadFullEvent: this.loadFullEvent.bind(this),
    }
  },

  methods: {
    isUncompletedRegistration() {
      return (
        !this.$store.state.auth.userData.lastName &&
        !routesForUncompletedRegistration.includes(this.$route.name)
      )
    },

    async loadAppData() {
      await this.$nextTick()
      await this.$store.dispatch('domain/fetchDomain', { hostName: location.hostname })
      const domain = this.$store.state.domain.data
      await AppLoadService.setDomain(domain)
      const authService = new AuthService()

      const eventId = this.defineEventId(domain, authService.isUserHasActiveSession)

      const isLanding = await this.loadFullEvent(eventId)

      this.initMetrics({ filter: { eventId } })

      if (isLanding) return
      if (authService.isUserHasActiveSession) {
        await authService.setAuthData()

        if (this.isUncompletedRegistration()) {
          await LangService.toLocalePath({ path: '/registration' })
          return
        }

        if (this.$route.name === 'login') {
          const event = this.$store.state.event.data
          const pages = this.$store.state.pages.data
          const startPagePath = EventService.defineStartPagePath(event, pages)
          await this.$router.replace(this.localePath({ path: startPagePath }))
        }
      } else if (this.$route.meta.auth) {
        console.warn('попытка загрузки доступной только с авторизацией страницы!')
        await LangService.toLocalePath({ path: '/login' })
      }

      const isAccess = checkAccessByRoute(this.$route)
      if (!isAccess) {
        throw new AccessError(this.$route)
      }
    },

    defineEventId(domain, isUserHasActiveSession) {
      const { eventId: routeEventId } = this.$route.params

      if (routeEventId && isUserHasActiveSession) {
        return routeEventId
      }

      return domain.eventId
    },

    isLanding() {
      return this.$route.name === 'main' && this.$store.state.event.data.showLanding
    },

    async loadFullEvent(eventId) {
      await this.$store.dispatch('event/fetchLocaleRelatedEventData', {
        eventId,
        locale: this.$i18n.locale,
      })
      const { colorThemeId } = this.$store.state.event.data
      const remoteMessages = await useLocaleChange().getLocales(eventId, this.$i18n.locale)
      this.$i18n.mergeLocaleMessage(this.$i18n.locale, remoteMessages)
      await ThemeService.setTheme(colorThemeId)
      if (this.isLanding()) {
        return true
      }

      // todo: возможен дублирющий запрос (страницы уже загружены)
      // нужно или закешировать (мемоизировать) или, что лучше, пересмотреть алгоритм загрузки
      await this.$store.dispatch('pages/fetchPages', { eventId })
      addPagesToRules(this.$store.state.pages.data)
      return false
    },

    async initMetrics(params) {
      try {
        const metric = await useMetric().getMetricCounters(params)
        if (metric) {
          await useMetric().initMetrics(metric)
        }
      } catch (e) {
        console.error(e)
      }
    },
  },
}
</script>
