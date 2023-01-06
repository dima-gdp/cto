<template>
  <div>
    <Tabs :animated="false">
      <TabPane label="Сводная информация" name="1">
        <CardInfo :card-data="cardData" />
      </TabPane>
      <TabPane label="Журнал" name="2">
        <CardJournal :activities="activities" />
      </TabPane>
      <!-- <TabPane label="Комментарии" name="3">
        <div style="padding: 0px 15px 15px 15px">in progress...</div>
      </TabPane> -->
    </Tabs>
  </div>
</template>

<script>
import CardInfo from './tabs/card-info'
import CardJournal from './tabs/card-journal'

export default {
  components: {
    CardInfo,
    CardJournal,
  },
  props: {
    cardData: {
      type: [Object, null],
      default: null,
    },
  },
  data() {
    return {}
  },
  computed: {
    activities() {
      if (this.cardData === null) {
        return []
      }
      const registrations = this.cardData.registrations ? this.cardData.registrations : []
      const orders = this.cardData.orders ? this.cardData.orders : []

      return [
        ...registrations.map((r) => ({ ...r, activityType: 'registration' })),
        ...orders.map((r) => ({ ...r, activityType: 'order' })),
      ].sort((a, b) => b.createdAt - a.createdAt)
    },
  },
}
</script>
