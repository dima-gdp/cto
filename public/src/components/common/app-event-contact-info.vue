<template>
  <div class="event-info-contacts">
    <div v-if="phone.number" class="event-info-contacts__phone">
      <a :href="`tel:${phone.number}`" class="event-info-contacts__link">
        {{ phone.number }}
      </a>
      <span class="event-info-contacts__phone event-info-contacts__phone--extended">
        {{ phone.extension }}
      </span>
    </div>
    <div v-if="event.email" class="event-info-contacts__email">
      <a :href="`mailto:${event.email}`" class="event-info-contacts__link">
        {{ event.email }}
      </a>
    </div>
    <div v-if="phone.info" class="event-info-contacts__description s-small-2">
      {{ phone.info }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    event: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    phone() {
      if (!this.event?.phone) return {}
      return {
        ...this.event.phone,
      }
    },
  },
}
</script>

<style lang="scss">
.event-info-contacts {
  &__phone {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    text-decoration: none;

    a {
      text-decoration: inherit !important;
    }

    &--extended {
      color: var(--s-black-color-80);
      font-size: 12px;
    }
  }

  &__email {
    font-weight: 500;
    font-size: 14px;
    line-height: 1.375;
    color: var(--s-primary-color-50);
    text-decoration: none;

    margin-bottom: 8px;

    a {
      text-decoration: inherit !important;
    }
  }

  &__description {
    font-size: 12px;
    max-width: 236px;
    font-weight: 500;
    line-height: 1.5;
    color: var(--s-black-color-80);
  }

  &__link {
    color: var(--s-primary-color-80);

    // &:hover {
    //   color: var(--s-primary-color-80);
    // }
  }
}
</style>
