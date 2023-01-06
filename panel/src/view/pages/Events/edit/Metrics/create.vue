<template>
  <div>
    <Row type="flex" justify="center" align="middle" class-name="view-header">
      <i-col class-name="view-header__divider">
        <Divider orientation="left">
          <span style="font-size: 36px">Добавление метрики</span>
        </Divider>
      </i-col>
      <i-col class-name="view-header__back">
        <Button icon="ios-arrow-round-back" @click="goToBack"> К списку метрик </Button>
      </i-col>
    </Row>
    <MetricForm @save="save" />
  </div>
</template>

<script>
import { createMetricCounter } from '@/api/metricCounter'
import MetricForm from '@/view/pages/Events/edit/Metrics/metricForm'
import { ROLES } from '@/domain/role'
import { mapGetters } from 'vuex'
import useMetric from '@/application/metric'

export default {
  name: 'CreateMetric',
  components: { MetricForm },

  computed: {
    ...mapGetters({
      eventId: 'getEventId',
      role: 'role',
    }),
  },

  methods: {
    goToBack() {
      useMetric().goBack(this.role, this.$route.params.id)
    },

    async createMetric(formData) {
      try {
        this.isLoading = true
        const eventId = this.eventId || this.$route.params.id

        const payload = {
          name: formData.name,
          type: formData.type,
          eventId: +eventId,
          key: formData.key,
        }

        const { data } = await createMetricCounter(payload)
        return data
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },

    async save(formData) {
      const newMetric = await this.createMetric(formData)
      if (!newMetric) return

      if (this.role === ROLES.manager) {
        await this.$router.push(`/metrics/list/edit/${newMetric.id}`)
      } else {
        await this.$router.push(
          `/events/edit/${this.$route.params.id}/metrics/edit/${newMetric.id}`
        )
      }
    },
  },
}
</script>
