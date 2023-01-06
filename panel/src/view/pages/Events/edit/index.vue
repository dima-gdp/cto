<template>
  <div>
    <Row type="flex" justify="center" align="middle" class-name="view-header">
      <i-col class-name="view-header__divider">
        <Divider orientation="left">
          <span style="font-size: 36px">Редактирование мероприятия</span>
        </Divider>
      </i-col>
      <i-col class-name="view-header__back">
        <Button icon="ios-arrow-round-back" @click="$router.push('/events/list')"> Назад </Button>
      </i-col>
    </Row>

    <div v-if="!isLoading">
      <FormEvent
        v-model="form.eventMainData"
        :event-types="$options.$constants.EVENT_TYPES"
        :legal-entity-options="legalEntityOptions"
        :themes-options="themesOptions"
        :is-loading="isLoading"
        @save="save"
      >
        <template v-if="eventType">
          <div style="height: 30px"></div>
          <keep-alive>
            <component :is="typeComponent" v-model="form.formTypeEvent"></component>
          </keep-alive>
          <div style="height: 30px"></div>
        </template>
      </FormEvent>
    </div>

    <div style="height: 30px"></div>

    <EventToEventForm v-if="eventType === 'cabinet'" />

    <div style="height: 30px"></div>

    <AdditionalInfoList :load="isLoading" :event="eventPayload" />
  </div>
</template>

<script>
import { getManyThemes } from '@/api/themes'
import FormCabinet from '@/view/pages/Events/FormCabinet'
import FormOccasion from '@/view/pages/Events/FormOccasion'
import FormEvent from '@/view/pages/Events/FormEvent'
import EventToEventForm from '@/view/pages/Events/edit/EventToEventForm'

import { EVENT_TYPES } from '@/domain/event-related'

import AdditionalInfoList from './MainInfo/AdditionalInfoList'
import { getAllLegalEntities } from '@/api/legalEntities'
import * as ApiEvent from '@/api/event'

export default {
  name: 'EditEvent',
  components: {
    AdditionalInfoList,
    FormEvent,
    EventToEventForm,
  },
  $constants: {
    EVENT_TYPES,
  },
  data() {
    return {
      form: {
        eventMainData: {},
        formTypeEvent: {},
      },
      eventPayload: {},
      isLoading: false,
      themeEventId: '',
      legalEntityOptions: [],
      themesOptions: [],
      existingLangs: [],
    }
  },
  computed: {
    eventType() {
      return this.form.eventMainData?.type || ''
    },
    typeComponent() {
      if (!EVENT_TYPES.map((t) => t.value).includes(this.eventType)) {
        return null
      }
      if (this.eventType === 'occasion') {
        return FormOccasion
      }
      return FormCabinet
    },
    eventId() {
      return this.$route.params.id
    },
  },
  watch: {
    $route: {
      handler(newRoute, oldRoute) {
        if (newRoute.name === oldRoute.name) {
          this.initForm()
        }
      },
      deep: true,
    },
  },
  created() {
    this.initForm()
  },
  methods: {
    async initForm() {
      this.form = {
        eventMainData: {},
        formTypeEvent: {},
      }
      this.eventPayload = {}
      this.isLoading = false
      this.themeEventId = ''
      this.legalEntityOptions = []
      this.themesOptions = []
      this.existingLangs = []
      this.isLoading = true
      await Promise.all([
        this.fetchLegalEntityOptions(),
        this.fetchThemesOptions(),
        this.getEvent(this.$route.params.id),
        this.fetchExistingLangs(),
      ])
      this.isLoading = false
    },
    validateForm() {
      // специально строгое сравнение с false! (nullish coalescing для бедных)
      const isMainValid = this.form.eventMainData.isValid !== false
      const isTypeFormValid = this.form.formTypeEvent.isValid !== false
      return isMainValid && isTypeFormValid
    },

    async fetchExistingLangs() {
      const { data } = await ApiEvent.getEventFormLink({
        filter: {
          eventId: this.eventId,
        },
      })
      this.existingLangs = data.map((f) => f.lang)
    },

    async fetchLegalEntityOptions() {
      const params = { 'per-page': 0 }
      const { data } = await getAllLegalEntities(params).catch((e) => {
        throw new Error(e)
      })

      this.legalEntityOptions = data.filter((o) => o)
    },

    async fetchThemesOptions() {
      const params = { 'per-page': 0 }
      const { data } = await getManyThemes(params).catch((e) => {
        throw new Error(e)
      })

      this.themesOptions = data.filter((t) => t)
    },

    async save(after) {
      if (!(await this.validateForm())) {
        return
      }

      try {
        this.isLoading = true
        const event = await this.updateEvent()

        await this.updateEventType(event)

        this.checkLackedLangs(event)

        if (after === 'list') {
          await this.$router.push({ path: '/events/list' })
        } else if (after === 'edit') {
          this.$Message.success('Изменения сохранены!')
          // await this.$router.push({ path: `/events/edit/${event.id}` })
        }
      } catch (e) {
        throw e
      } finally {
        this.isLoading = false
      }
    },

    async updateEvent() {
      const eventPayload = this.form.eventMainData

      delete eventPayload.isValid

      const { data: event } = await ApiEvent.updateEvent(this.eventId, eventPayload)

      return event
    },

    async updateEventType(event) {
      const eventId = event.id
      if (!eventId) {
        throw new Error('не найдено id мероприятия!')
      }

      const updateEventDataByType = {
        cabinet: ApiEvent.updateEventCabinet,
        occasion: ApiEvent.updateEventOccasion,
      }

      const createEventDataByType = {
        cabinet: ApiEvent.createEventCabinet,
        occasion: ApiEvent.createEventOccasion,
      }

      const eventTypeData = this.form.formTypeEvent
      eventTypeData.eventId = eventId
      const eventTypeId = eventTypeData.id

      const {
        data: { isExisted: isEntityExist },
      } = await ApiEvent.checkIsEventTypeEntityIsExisted(eventTypeId, event.type)

      delete eventTypeData.isValid

      if (isEntityExist) {
        await updateEventDataByType[event.type](eventTypeId, eventTypeData)
      } else {
        console.info('сущность не найдена, создаю новую')
        await createEventDataByType[event.type](eventTypeData)
      }
    },

    async getEvent(id) {
      try {
        this.isLoading = true
        const params = { include: 'form-link,theme-event,event-cabinet,event-occasion' }
        const { data } = await ApiEvent.getEvent(id, params)
        this.eventPayload = data

        const eventMainData = data

        if (data.themeEvent?.colorThemeId) {
          eventMainData.colorThemeId = data.themeEvent.colorThemeId
          this.themeEventId = data.themeEvent.id
          delete data.themeEvent
        }

        let formTypeEvent
        if (data.type === 'occasion') {
          formTypeEvent = data.eventOccasion
          delete eventMainData.eventOccasion
        } else if (data.type === 'cabinet') {
          formTypeEvent = data.eventCabinet
          delete eventMainData.eventCabinet
        } else {
          throw new Error('неверный тип мероприятия!')
        }

        this.form.eventMainData = eventMainData
        this.form.formTypeEvent = formTypeEvent
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },
    checkLackedLangs(event) {
      const selectedLangs = event.availableLanguages
      const lackedLangs = selectedLangs.filter((lang) => !this.existingLangs.includes(lang))

      if (lackedLangs.length) {
        this.$Message.warning('Отсутствуют формы для следующих языков: ' + lackedLangs.join(', '))
      }
    },
  },
}
</script>

<style></style>
