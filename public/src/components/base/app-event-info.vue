<template>
  <div class="event-info-main">
    <div v-if="logoUrl" class="logo-wrapper">
      <a
        v-if="withExternalLink && externalLink"
        :href="externalLink"
        target="_blank"
        class="logo-wrapper__logo"
        style="display: block"
      >
        <img ref="img" :src="logoUrl" alt="logo" />
      </a>
      <div v-else class="logo-wrapper__logo">
        <img :src="logoUrl" alt="logo" />
      </div>
    </div>
    <div v-if="messageAlert" class="event-info-main__status">
      <Alert :type="typeAlert">
        {{ messageAlert }}
      </Alert>
    </div>
    <div v-if="event.displayName" class="event-info-main__caption s-subtitle-secondary">
      {{ event.displayName }}
    </div>
  </div>
</template>

<script>
import EventDateService from '@/domain/services/event-date-service'
import EventService from '@/domain/services/event-service'

export default {
  props: {
    type: {
      validator(value) {
        return ['event', 'registration'].includes(value)
      },
      default: 'registration',
    },
    showDate: { type: Boolean, default: true },
    event: { type: Object, default: () => {} },
    withExternalLink: { type: Boolean, default: false },
  },

  computed: {
    logoUrl() {
      return EventService.extractLogoUrl(this.event)
    },

    status() {
      if (this.type === 'registration') {
        return this.eventRegistrationStatus()
      }
      return this.eventStatus()
    },

    messageAlert() {
      const dateStr = this.status.message
      const locationStr = this.event.location || ''
      if (dateStr && locationStr) {
        return `${dateStr}, ${locationStr}`
      } else if (dateStr && !locationStr) {
        return dateStr
      } else if (!dateStr && locationStr) {
        return locationStr
      }
      return ''
    },

    typeAlert() {
      if (this.status.state === 'after') {
        return 'warning'
      }

      if (this.type === 'event') {
        return 'info'
      }

      return 'success'
    },

    externalLink() {
      return this.event.formLink?.externalUrl || ''
    },
  },
  methods: {
    eventStatus() {
      const months = this.$tr('months')
      // todo: записать код красивее (придумать как)
      const dateService = new EventDateService(this.event)
      if (
        dateService.startEventTime === EventDateService.MIN_DATE &&
        dateService.endEventTime === EventDateService.MAX_DATE
      ) {
        return {
          message: '',
        }
      }

      if (dateService.startEventTime === EventDateService.MIN_DATE) {
        return {
          message: EventDateService.getMessageWithOneDate({ months }, dateService.endEventTime),
        }
      }
      if (dateService.endEventTime === EventDateService.MAX_DATE) {
        return {
          message: EventDateService.getMessageWithOneDate({ months }, dateService.startEventTime),
        }
      }

      const status = EventDateService.getAlertMessageWithDivider(
        { months },
        dateService.startEventTime,
        dateService.endEventTime,
      )
      return status
    },

    eventRegistrationStatus() {
      const dateService = new EventDateService(this.event)

      const words = { ...this.$tr('auth.statusWordsRegistration') }
      words.months = this.$tr('months')
      words.onGoing = this.$tr('alertTime.onGoing')

      return EventDateService.getEntityStatusAlert(
        words,
        dateService.startRegistrationTime,
        dateService.endRegistrationTime,
        this.event.registrationTimeStatus,
      )
    },
  },
}
</script>
<style lang="scss">
.event-info-main {
  &__caption {
    padding: 0 24px;
    font-size: 14px;
    font-weight: 500;
    line-height: 1.375;
    color: var(--s-black-color-60);

    @include media-breakpoint-up(lg) {
      font-size: 16px;
    }
  }
}
.logo-wrapper {
  padding: 0px 24px;

  &__logo {
    padding-bottom: 24px;
    margin: 0 auto;
    display: flex;
    width: 100%;
    max-width: 196px;
  }

  &__logo img {
    width: 100%;
    height: 100%;
  }
}
</style>
