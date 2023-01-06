<template>
  <div class="event-card">
    <div class="s-card s-card--no-padding">
      <Alert :type="statusAlert.type" style="text-align: center" banner>
        {{ statusAlert.text }}
      </Alert>
      <AppEventInfo :event="eventToEvent.child" type="event" />
      <div>
        <Alert
          v-if="registrationExist && !eventToEvent.allowRedirect"
          style="margin-top: 15px; text-align: center"
          type="success"
        >
          Вы успешно зарегистрировались
        </Alert>
        <Button
          v-if="isRegVisible"
          :disabled="isRegDisabled || actionDisabled"
          type="primary"
          class="event-card__btn"
          @click="$emit('register', eventToEvent)"
        >
          {{ $tr('events.registration') }}
        </Button>
        <Button
          v-if="isToEventVisible"
          type="primary"
          :disabled="actionDisabled"
          class="event-card__btn"
          @click="$emit('to-event', eventToEvent)"
        >
          {{ $tr('events.toEvent') }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import { TIME_STATUSES } from '@/utils'
import AppEventInfo from '@/components/base/app-event-info'

export default {
  components: {
    AppEventInfo,
  },
  props: {
    eventToEvent: { type: Object, default: () => {} },
    registrationExist: { type: Boolean, default: false },
    actionDisabled: { type: Boolean, default: false },
  },
  computed: {
    statusAlert() {
      if (this.registrationStatus === TIME_STATUSES.IN_PROGRESS) {
        return { type: 'success', text: this.$tr('eventCard.duringRegistration') }
      }
      if (this.registrationStatus === TIME_STATUSES.WILL_START) {
        return { type: 'warning', text: this.$tr('eventCard.beforeRegistration') }
      }
      if (this.registrationStatus === TIME_STATUSES.ENDED) {
        return { type: 'error', text: this.$tr('eventCard.endedRegistration') }
      }
      return { type: 'info', text: '' }
    },

    registrationStatus() {
      return this.eventToEvent.child.registrationTimeStatus
    },

    isRegDisabled() {
      return (
        this.registrationStatus === TIME_STATUSES.WILL_START ||
        (this.registrationStatus === TIME_STATUSES.ENDED && !this.registrationExist)
      )
    },
    isRegVisible() {
      return this.registrationStatus === TIME_STATUSES.IN_PROGRESS && !this.registrationExist
    },
    isToEventVisible() {
      return this.registrationExist && this.eventToEvent.allowRedirect
    },
  },
}
</script>

<style scoped lang="scss">
.ivu-alert {
  padding: 9px 24px 9px 24px;
}
.event-card {
  margin-bottom: 16px;

  .s-card {
    height: 100%;
    padding-bottom: 16px !important;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &__btn {
    margin: 24px 24px 0;
    width: calc(100% - 48px);
  }

  & .event-info-main__caption {
    font-size: 14px;
    font-family: var(--s-regular-font);
    font-weight: 400;
    line-height: 1.57;
  }
}
</style>
