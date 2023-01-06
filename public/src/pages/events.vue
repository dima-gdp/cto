<template>
  <div class="other-events">
    <AppEventTab v-model="selectedId" :list="tabs" />
    <div class="row">
      <template v-if="!isLoading">
        <AppEventCard
          v-for="eventToEvent in visibleEvents"
          :key="eventToEvent.id"
          :event-to-event="eventToEvent"
          :action-disabled="loadingDataIds.includes(eventToEvent.id)"
          :registration-exist="eventsWithRegistration.includes(+eventToEvent.child.id)"
          class="col-12 col-xlg-3 col-lg-4 col-sm-6"
          @register="onRegister"
          @to-event="onToEvent"
        />
      </template>
      <div v-else class="s-card col-12" style="position: relative; min-height: 200px">
        <Spin fix />
      </div>
    </div>
  </div>
</template>

<script>
import { sort } from 'rambda'

import AppEventCard from '@/components/common/app-event-card'
import AppEventTab from '@/components/common/app-event-tab'
import useEvent from '@/domain/composables/use-event'
import EventDateService from '@/domain/services/event-date-service'
import { TIME_STATUSES } from '@/utils'
import useRegistration from '@/domain/composables/use-registration'
import LangService from '@/domain/services/lang-service'
import EventService from '@/domain/services/event-service'

// вынести сервис
export default {
  middleware: ['main-event-init', 'only-en-guard'],
  components: {
    AppEventCard,
    AppEventTab,
  },
  data() {
    return {
      selectedId: 1,
      tabs: [
        { name: 'actual', label: this.$tr('events.tabs.actual'), id: 1 },
        { name: 'past', label: this.$tr('events.tabs.past'), id: 2 },
      ],
      splitEvents: {},
      eventsWithRegistration: [],
      loadingDataIds: [],
      isLoading: false,
    }
  },

  inject: ['loadFullEvent'],

  computed: {
    visibleEvents() {
      const getStartDate = (e2e) => new EventDateService(e2e.child).startEventTime

      return sort((a, b) => (getStartDate(a) < getStartDate(b) ? -1 : 1), this.filteredEvents)
    },

    filteredEvents() {
      const { name } = this.tabs.find((tab) => tab.id === this.selectedId)
      const { inProgress = [], willStart = [], past = [] } = this.splitEvents

      if (name === 'actual') {
        return [...inProgress, ...willStart]
      }

      return [...past]
    },
  },
  async created() {
    try {
      if (this.$store.getters['isActiveEventIsChild']) {
        const parentEventId = this.$store.getters['domain/parentEventId']
        this.$store.commit('SET_APP_IS_LOADING', true)
        await this.loadFullEvent(parentEventId)
        this.$store.commit('SET_APP_IS_LOADING', false)
      }

      this.isLoading = true

      const eventLinksWithEventData = await this.getChildrenEvents()
      if (!eventLinksWithEventData.length) {
        throw new Error('Нет связанных мероприятий')
      }
      await this.getEventsWithRegistrationsByThisUser(
        eventLinksWithEventData.map(({ child }) => child.id),
      )
      this.makeSplitEvents(eventLinksWithEventData)
    } catch (e) {
      console.error(e)
      await LangService.toLocalePath({ path: '/404' })
    } finally {
      this.$store.commit('SET_APP_IS_LOADING', false)
      this.isLoading = false
    }
  },
  methods: {
    async getChildrenEvents() {
      const { getChildrenForCabinet } = useEvent()

      const eventLinksWithEventData = await getChildrenForCabinet(
        this.$store.getters['domain/parentEventId'],
        this.$i18n.locale,
      ).catch((e) => {
        console.error(e)
        return []
      })
      return eventLinksWithEventData
    },

    makeSplitEvents(eventLinksWithEventData) {
      this.splitEvents = eventLinksWithEventData.reduce(
        (accum, current) => {
          const timeStatus = current.child.eventOccasion.timeStatus

          if (timeStatus === TIME_STATUSES.WILL_START) {
            accum.willStart.push(current)
          }
          if (timeStatus === TIME_STATUSES.IN_PROGRESS) {
            accum.inProgress.push(current)
          }
          if (timeStatus === TIME_STATUSES.ENDED) {
            accum.past.push(current)
          }

          return accum
        },
        { inProgress: [], willStart: [], past: [] },
      )
    },

    async getEventsWithRegistrationsByThisUser(eventIds) {
      const { getRegistrationsByUser } = useRegistration()
      const userId = this.$store.state.auth.userId
      const registration = await getRegistrationsByUser(eventIds, userId)
      this.eventsWithRegistration = registration.map((r) => r.eventId)
    },

    async onRegister(eventToEvent) {
      if (eventToEvent.quickRegistration) {
        await this.quickRegistration(eventToEvent)
      } else {
        await this.toFullRegistration(eventToEvent)
      }
    },

    async onToEvent(eventToEvent) {
      if (!eventToEvent.allowRedirect) {
        console.error('Нельзя перейти к другому евенту!')
        return
      }
      await this.toEvent(eventToEvent)
    },

    async quickRegistration(eventToEvent) {
      if (!eventToEvent.quickRegistration) {
        console.error('Быстрая регистрация невозможна')
        return
      }

      try {
        const fromEventId = this.$store.getters['event/currentEventId']
        const { quickRegistration } = useRegistration()
        this.loadingDataIds.push(eventToEvent.id)
        await quickRegistration(eventToEvent.child.id, fromEventId)
        this.eventsWithRegistration.push(eventToEvent.child.id)
        await this.onToEvent(eventToEvent)
      } catch (e) {
        console.error(e.message)
      } finally {
        this.loadingDataIds = this.loadingDataIds.filter((id) => id !== eventToEvent.id)
        this.getEventsWithRegistrationsByThisUser(this.visibleEvents.map((e2e) => e2e.childId))
      }
    },

    async toFullRegistration(eventToEvent) {
      try {
        this.$store.commit('SET_APP_IS_LOADING', true)
        await this.loadFullEvent(eventToEvent.child.id)
        await LangService.toLocalePath({ path: '/registration' })
      } catch (e) {
        console.error(e)
        await LangService.toLocalePath({ path: '/404' })
      } finally {
        this.$store.commit('SET_APP_IS_LOADING', false)
      }
    },

    async toEvent(eventToEvent) {
      try {
        this.$store.commit('SET_APP_IS_LOADING', true)
        await this.loadFullEvent(eventToEvent.child.id)
        const pages = this.$store.state.pages.data
        const startPagePath = EventService.defineStartPagePath(eventToEvent.child, pages)
        await LangService.toLocalePath({ path: startPagePath })
      } catch (e) {
        console.error(e)
        await LangService.toLocalePath({ path: '/404' })
      } finally {
        this.$store.commit('SET_APP_IS_LOADING', false)
      }
    },
  },
}
</script>

<style lang="scss">
.other-events {
  position: relative;
  &__title {
    color: var(--s-black-color-80);
    margin-bottom: 24px;
  }

  &__event-time-line {
    margin-bottom: 24px;
  }
}
</style>
