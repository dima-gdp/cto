<template>
  <div>
    <Row type="flex" justify="center" align="middle" class-name="view-header">
      <i-col class-name="view-header__divider">
        <Divider orientation="left">
          <span style="font-size: 36px">Редактирование метрики</span>
        </Divider>
      </i-col>
      <i-col class-name="view-header__back">
        <Button icon="ios-arrow-round-back" @click="goToBack"> К списку метрик </Button>
      </i-col>
    </Row>
    <MetricForm :metric-form="form" :is-loading="isLoading" is-edit @save="save" />
  </div>
</template>

<script>
import { getOneMetricCounter, updateMetricCounter } from '@/api/metricCounter'
import MetricForm from '@/view/pages/Events/edit/Metrics/metricForm'
import { mapGetters } from 'vuex'
import useMetric from "@/application/metric";

export default {
  components: { MetricForm },
  data() {
    return {
      form: {
        name: '',
        type: '',
        key: '',
      },
      isLoading: false,
    }
  },

  computed: {
    ...mapGetters({
      eventId: 'getEventId',
      role: 'role',
    }),
  },
  async created() {
    await this.prepareForm()
  },
  methods: {
    async prepareForm() {
      try {
        this.isLoading = true
        this.form = await this.getMetricCounterData()
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },

    async getMetricCounterData() {
      const { data } = await getOneMetricCounter(this.$route.params.metricId)

      return {
        name: data.name,
        type: data.type,
        key: data.key,
      }
    },

    goToBack() {
      useMetric().goBack(this.role, this.$route.params.id)
    },

    async editMetric(formData) {
      try {
        this.isLoading = true
        const eventId = this.eventId || this.$route.params.id

        const payload = {
          name: formData.name,
          type: formData.type,
          eventId: +eventId,
          key: formData.key,
        }

        await updateMetricCounter(this.$route.params.metricId, payload)

        if (formData.isExit) {
          this.goToBack()
        } else {
          await this.prepareForm()
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },

    async save(formData) {
      await this.editMetric(formData)
    },
  },
}
</script>
