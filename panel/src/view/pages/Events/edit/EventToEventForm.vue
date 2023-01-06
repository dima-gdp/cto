<template>
  <Card style="margin-bottom: 15px">
    <h3 style="margin-bottom: 15px">Связи между мероприятиями</h3>
    <Row :gutter="15">
      <i-col span="18">
        <Select
          v-model="selectedEventId"
          remote
          filterable
          placeholder="Техническое название мероприятия"
          :loading="loadingEvent"
          :remote-method="debounce(getEvents, 800)"
          not-found-text="Ничего не найдено"
        >
          <Option v-for="event in nonAddedEvents" :key="event.id" :value="event.id">
            {{ event.technicalName }}
          </Option>
        </Select>
      </i-col>
      <i-col span="6">
        <Button type="primary" ghost long @click="addEvent">Добавить</Button>
      </i-col>
    </Row>
    <div style="height: 15px"></div>
    <Row
      v-if="addedEventToEventList.length > 0"
      type="flex"
      align="middle"
      :gutter="15"
      class="added-events-header"
    >
      <i-col span="3">ID мероприятия</i-col>
      <i-col span="12">Название</i-col>
      <i-col span="3">Быстрая регистрация</i-col>
      <i-col span="3">Разрешить переход</i-col>
      <i-col span="3"></i-col>
    </Row>
    <div style="height: 15px"></div>
    <Row
      v-for="e in $options.sort((a, b) => +a.childId - b.childId, addedEventToEventList)"
      :key="e.childId"
      type="flex"
      align="middle"
      :gutter="15"
      class="added-events"
    >
      <i-col span="3" class="added-events__item">{{ e.childId }}</i-col>
      <i-col span="12" class="added-events__item">
        <router-link :to="`/events/edit/${e.childId}`">
          {{ e.child && e.child.technicalName }}
        </router-link>
      </i-col>
      <i-col span="3" class="added-events__item added-events__item--center">
        <Checkbox v-model="e.quickRegistration"></Checkbox>
      </i-col>
      <i-col span="3" class="added-events__item added-events__item--center">
        <i-switch v-if="e.quickRegistration" v-model="e.allowRedirect" size="large">
          <span slot="open">Да</span>
          <span slot="close">Нет</span>
        </i-switch>
        <span v-else>Всегда</span>
      </i-col>
      <i-col span="3" class="added-events__item">
        <Button long type="error" ghost @click="removeAddedEvent(e)">Удалить</Button>
      </i-col>
    </Row>
    <div style="height: 15px"></div>
    <Row>
      <i-col span="12" offset="12">
        <Button long type="primary" :disabled="isLoading" @click="updateEventToEventList">
          Обновить связи
        </Button>
      </i-col>
    </Row>
    <Spin v-if="isLoading" fix />
  </Card>
</template>

<script>
import { debounce } from '@/libs/util'
import { sort } from 'rambda'
import * as ApiEvent from '@/api/event'

export default {
  sort,
  name: 'EventToEventForm',
  data() {
    return {
      events: [],
      selectedEventId: null,
      isLoading: false,
      loadingEvent: false,
      addedEventToEventList: [],
    }
  },
  computed: {
    nonAddedEvents() {
      const addedEventsIds = this.addedEventToEventList.map((e) => +e.childId)

      return this.events.filter((e) => !addedEventsIds.includes(+e.id))
    },
  },
  async created() {
    this.isLoading = true
    await this.getAddedEvents().finally(() => (this.isLoading = false))
  },
  methods: {
    debounce(fn, time) {
      return debounce(fn, time)
    },
    async getEvents(query) {
      const eventParams = {
        'per-page': 0,
        fields: {
          event: ['id', 'technical-name'],
        },
        filter: [
          {
            technicalName: {
              ilike: query.trim(),
            },
            type: 'occasion',
          },
        ],
      }

      this.loadingEvent = true
      const { data: eventData } = await ApiEvent.getEvents(eventParams).finally(
        () => (this.loadingEvent = false)
      )
      this.events = eventData
    },

    async addEvent() {
      if (this.selectedEventId !== null) {
        const isAlreadyAdded = this.addedEventToEventList.find(
          (e) => +e.childId === +this.selectedEventId
        )

        if (!isAlreadyAdded) {
          this.isLoading = true
          const { data: eventLink } = await ApiEvent.createEventToEvent({
            parentId: +this.$route.params.id,
            childId: +this.selectedEventId,
            allowRedirect: true,
            quickRegistration: false,
          })

          eventLink.child = this.events.find((e) => +e.id === +this.selectedEventId)

          this.addedEventToEventList.push(eventLink)
          this.selectedEventId = null
          this.isLoading = false
        }
      }
    },

    async removeAddedEvent(event) {
      if (event.id) {
        this.isLoading = true
        await ApiEvent.deleteEventToEvent(event.id).finally(() => (this.isLoading = false))
        this.addedEventToEventList = this.addedEventToEventList.filter((e) => +e.id !== +event.id)
      }
    },

    async getAddedEvents() {
      const { data } = await ApiEvent.getEventToEventList({
        filter: {
          parentId: this.$route.params.id,
        },
        include: ['child'].join(''),
        fields: {
          event: ['technical-name'].join(''),
          'event-to-event': ['parent-id, child-id, quick-registration, allow-redirect'].join(''),
        },
        'per-page': 0,
      })

      this.addedEventToEventList = data
    },

    async updateEventToEventList() {
      this.isLoading = true

      const processAllowRedirect = (e2e) => {
        // переход должен всегда быть разрешен там, где нет быстрой регистрации
        return !e2e.quickRegistration ? { ...e2e, allowRedirect: true } : e2e
      }

      await Promise.all(
        this.addedEventToEventList.map((eventToEvent) =>
          ApiEvent.updateEventToEvent(eventToEvent.id, processAllowRedirect(eventToEvent))
        )
      )
      await this.getAddedEvents()
      this.isLoading = false
    },
  },
}
</script>

<style scoped>
.added-events-header {
  font-weight: bold;
}
</style>
