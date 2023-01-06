<template>
  <div v-if="contentItems.length" class="content-items">
    <router-link
      v-for="content in contentItems"
      :key="content.id"
      :to="localePath({ path: `/registration/juridical/${content.id}` })"
      class="content-items__link"
      target="_blank"
    >
      {{ content.name }}
    </router-link>
  </div>
</template>
<script>
import useDomainContent from '@/domain/composables/use-domain-content'

export default {
  data() {
    return {
      contentItems: [],
    }
  },

  created() {
    const domainId = this.$store.state.domain.data.id
    const currentEventId = this.$store.getters['event/currentEventId']

    this.getContentItemList(domainId, currentEventId)
  },

  methods: {
    async getContentItemList(domainId, eventId) {
      try {
        this.contentItems = await useDomainContent().getContentItemList(
          domainId,
          eventId,
          this.$i18n.locale,
        )
      } catch (e) {
        console.error(e)
      }
    },
  },
}
</script>
<style lang="scss">
.content-items {
  display: flex;
  flex-wrap: wrap;
  margin-top: 24px;

  @include media-breakpoint-up(lg) {
    margin-top: 0px;
  }

  &__link {
    padding-right: 15px;
    color: var(--s-primary-color);
    font-size: 14px;
    font-family: var(--s-regular-font);
    font-weight: 400;
  }
}
</style>
