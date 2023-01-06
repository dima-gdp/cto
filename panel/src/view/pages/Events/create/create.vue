<template>
  <div class="org-form">
    <Spin v-if="isLoading" fix />
    <Row type="flex" justify="center" align="middle" class-name="view-header">
      <i-col class-name="view-header__divider">
        <Divider orientation="left">
          <span style="font-size: 36px">Создание мероприятия</span>
        </Divider>
      </i-col>
      <i-col class-name="view-header__back">
        <Button icon="ios-arrow-round-back" @click="$router.push('/events/list')"> Назад </Button>
      </i-col>
    </Row>

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
      </template>
      <div style="height: 30px"></div>
    </FormEvent>
  </div>
</template>

<script>
import { getAllLegalEntities } from '@/api/legalEntities'
import { getManyThemes } from '@/api/themes'
import * as ApiEvent from '@/api/event'
import FormCabinet from '@/view/pages/Events/FormCabinet'
import FormOccasion from '@/view/pages/Events/FormOccasion'
import FormEvent from '@/view/pages/Events/FormEvent'

import { EVENT_TYPES } from '@/domain/event-related'

export default {
  name: 'CreateEvent',
  components: {
    FormEvent,
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
      isLoading: false,
      legalEntityOptions: [],
      themesOptions: [],
    }
  },
  computed: {
    eventType() {
      return this.form.eventMainData.type
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
  },

  async created() {
    this.isLoading = true
    await Promise.all([this.fetchLegalEntityOptions(), this.fetchThemesOptions()])
    this.isLoading = false
  },
  // todo: создавать контентный пункт с политикой конфиденциальности при создании евента
  methods: {
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

    validateForm() {
      // специально строгое сравнение с false! (nullish coalescing для бедных)
      const isMainValid = this.form.eventMainData.isValid !== false
      const isTypeFormValid = this.form.formTypeEvent.isValid !== false
      return isMainValid && isTypeFormValid
    },

    async save(after) {
      if (!(await this.validateForm())) {
        return
      }
      this.isLoading = true
      try {
        const event = await this.createEvent()

        await this.createEventType(event.id)

        if (after === 'list') {
          await this.$router.push({ path: '/events/list' })
        } else if (after === 'edit') {
          await this.$router.push({ path: `/events/edit/${event.id}` })
        }
      } catch (e) {
        // throw new Error('Произошла ошибка!')
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },

    async createEvent() {
      const eventPayload = this.form.eventMainData

      delete eventPayload.isValid

      const { data: event } = await ApiEvent.createEvent(eventPayload)

      return event
    },

    async createEventType(eventId) {
      if (!eventId) {
        throw new Error('не найдено id мероприятия!')
      }

      const createEventDataByType = {
        cabinet: ApiEvent.createEventCabinet,
        occasion: ApiEvent.createEventOccasion,
      }
      const eventTypeData = this.form.formTypeEvent

      delete eventTypeData.isValid
      eventTypeData.eventId = eventId

      await createEventDataByType[this.eventType](eventTypeData)
    },
  },
}
</script>

<style></style>
