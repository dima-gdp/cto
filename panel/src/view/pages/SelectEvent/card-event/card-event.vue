<template>
  <div class="card">
    <div class="card__logo-block">
      <div class="card__logo">
        <img
          v-if="event.event.imageUrl"
          :src="event.event.imageUrl"
          class="card__logo-img"
          alt="logo"
        />
        <img v-else src="@/assets/images/plug-event-logo.svg" class="card__logo-img" alt="logo" />
      </div>
      <div class="card__mobile-button">
        <Button class="card__more-button" type="primary" @click="toEvent(event)">Подробнее</Button>
      </div>
    </div>
    <div class="card__event">
      <div class="card__title card__limit-text">{{ event.event.technicalName }}</div>
      <div v-if="event.event.status" class="card__status">
        <Alert
          v-if="event.event.status === $options.EVENT_STATUS.during"
          type="success"
          show-icon
          class="card__status-success"
          >Регистрация идет</Alert
        >
        <Alert
          v-if="event.event.status === $options.EVENT_STATUS.before"
          type="success"
          show-icon
          class="card__status-success"
          >Регистрация скоро начнется</Alert
        >
        <Alert
          v-if="event.event.status === $options.EVENT_STATUS.after"
          type="warning"
          show-icon
          class="card__status-warning"
          >Регистрация завершена</Alert
        >
      </div>

      <div class="card__more">
        <div class="card__button">
          <Button class="card__more-button" type="primary" @click="toEvent(event)"
            >Подробнее</Button
          >
        </div>

        <div v-if="event.event.startedAt" class="card__date-block">
          <div class="card__created-at">Начало</div>

          <div class="card__date">{{ event.event.startedAt }}</div>
        </div>

        <div v-if="event.event.endedAt" class="card__date-block">
          <div class="card__created-at">Окончание</div>

          <div class="card__date">{{ event.event.endedAt }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { EVENT_STATUS } from '@/domain/event'

export default {
  EVENT_STATUS,

  props: {
    event: { type: Object, default: () => ({}) },
  },

  methods: {
    async toEvent(event) {
      this.$emit('to-event', event)
    },
  },
}
</script>

<style lang="less">
@import './card-event.less';
</style>
