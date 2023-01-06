<template>
  <div class="select-event-container">
    <Spin v-if="isLoading" fix></Spin>
    <div v-else>
      <Header />
      <List :events="events" @to-event="toEvent" />
    </div>
  </div>
</template>

<script>
import List from '@/view/pages/SelectEvent/list/list'
import Header from '@/components/base/header/header'
import { mapActions } from 'vuex'
import useContent from '@/application/content'
import { getConvertedEvents } from '@/domain/event'

export default {
  components: { List, Header },

  data() {
    return {
      events: [],
      isLoading: false,
    }
  },

  created() {
    this.getEvents()
  },

  methods: {
    ...mapActions(['handleSelectedEvent', 'getEventInfo']),

    async getEvents() {
      try {
        this.isLoading = true
        const userId = this.$store.state.user.userId
        const data = await useContent().getMangerEvents(userId)
        this.events = getConvertedEvents(data)
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },

    async toEvent(event) {
      try {
        await this.handleSelectedEvent([event.eventId, event.permissions])
        await this.getEventInfo()
        await this.$router.push({
          name: this.$config.homeName,
        })
      } catch (e) {
        console.error(e)
      }
    },
  },
}
</script>

<style lang="less">
@import './select.event.less';
</style>
