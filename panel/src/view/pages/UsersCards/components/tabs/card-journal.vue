<template>
  <Row type="flex" :gutter="15" style="padding: 15px">
    <i-col span="12">
      <div class="card-info">
        <h2>Действия клиента</h2>
        <Divider />
        <div v-for="(activity, index) in activities" :key="index" class="card-info-section">
          <Row type="flex" :gutter="15">
            <i-col span="24">
              <div class="card-info-section-item-label">
                {{ getDate(activity.createdAt) }}
              </div>
              <div v-if="activity.activityType === 'registration'" class="card-info-section-item">
                Регистрация на мероприятие <span>{{ activity.eventId }}</span> / отправлена анкета
                <a :href="`/worksheets/${activity.id}`">{{
                  activity.event ? activity.event.name : ''
                }}</a>
              </div>
              <div v-if="activity.activityType === 'order'" class="card-info-section-item">
                Создание заказа <a :href="`/orders/${activity.id}`">{{ activity.id }}</a>
              </div>
            </i-col>
          </Row>
          <Divider />
        </div>
      </div>
    </i-col>
    <i-col span="12">
      <h2>Действия c клиентом</h2>
    </i-col>
  </Row>
</template>

<script>
import { getDate } from '@/libs/tools'

export default {
  props: {
    activities: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    getDate,
  },
}
</script>
