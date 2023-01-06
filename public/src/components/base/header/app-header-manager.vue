<template>
  <div class="info-manager">
    <p v-if="phone.info" class="info-manager__title">{{ phone.info }}</p>
    <a
      v-if="phone.number"
      :href="`tel:${phone.number}`"
      class="info-manager__link info-manager__link--nw"
    >
      {{ phone.number }}
      <span v-if="phone.extension">{{ phone.extension }}</span>
    </a>
    <a v-if="eventData.email" :href="`mailto:${eventData.email}`" class="info-manager__link">{{
      eventData.email
    }}</a>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({ eventData: (state) => state.event.data }),

    phone() {
      if (!this.eventData?.phone) return {}
      return {
        ...this.eventData.phone,
      }
    },
  },
}
</script>

<style lang="scss">
@import '~@/styles/components/header/app-header-manager.scss';
</style>
