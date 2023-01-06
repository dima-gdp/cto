<template>
  <Row v-if="canSeeStats" type="flex" :gutter="15">
    <i-col span="12">
      <Card class="home-chart">
        <h3 class="home-chart__title">Регистрации</h3>
        <Bar :chart-data="registrations" title="Регистрации" />
      </Card>
      <Card class="home-chart">
        <div class="home-chart-stats">
          <h3 class="home-chart-stats__title">Регистраций за указанный период:</h3>
          <span class="home-chart-stats__value">{{ totalRegistrations }}</span>
        </div>
      </Card>
    </i-col>
    <i-col span="12">
      <Card class="home-chart">
        <h3 class="home-chart__title">Заказы</h3>
        <Bar :chart-data="orders" title="Заказы" />
      </Card>
      <Card class="home-chart">
        <div class="home-chart-stats">
          <h3 class="home-chart-stats__title">Заказов за указанный период:</h3>
          <span class="home-chart-stats__value">{{ totalOrders }}</span>
        </div>
      </Card>
    </i-col>
  </Row>
</template>

<script>
import { Bar } from './components/Charts'

import { getRegistration } from '@/api/event'
import { getOrders } from '@/api/orders'

import { mapGetters } from 'vuex'
import dayjs from 'dayjs'

export default {
  components: {
    Bar,
  },
  data() {
    return {
      registrations: {},
      orders: {},
      totalRegistrations: 0,
      totalOrders: 0,
    }
  },
  computed: {
    ...mapGetters({
      role: 'role',
    }),
    dayLabels() {
      const days = this.initWeekRange()
      return days.map((day) => day.format('DD-MM-YYYY'))
    },
    canSeeStats() {
      return this.role && this.role === 'manager'
    },
  },
  mounted() {
    if (this.canSeeStats) {
      this.getStats()
    }
  },
  methods: {
    async getStats() {
      const params = {
        'per-page': 0,
        filter: { createdAt: this.makeDateRange() },
      }

      try {
        const [reg, ord] = await Promise.all([getRegistration(params), getOrders(params)])

        this.totalRegistrations = reg.data.length
        this.totalOrders = ord.data.length

        this.registrations = this.makeChartData(reg.data, 'Регистрации')
        this.orders = this.makeChartData(ord.data, 'Заказы')
      } catch (e) {
        throw new Error(e)
      }
    },
    makeDateRange() {
      const today = dayjs().hour(23).minute(59).second(59)
      const lastWeek = today.subtract(6, 'day').hour(0).minute(0).second(0)

      return {
        gte: lastWeek.unix(),
        lte: today.unix(),
      }
    },
    makeChartData(data, label) {
      const weekRange = this.initWeekRange()
      const ejectData = (day) => {
        const count = data.filter((i) => dayjs.unix(i.createdAt).date() === day.date()).length
        let result

        data.forEach((item) => {
          const itemDay = dayjs.unix(item.createdAt).date()
          const labelDay = day.date()

          if (itemDay === labelDay) {
            result = count
          }
        })

        return result
      }

      const ejectedData = weekRange.map((day) => ejectData(day))
      const result = {
        labels: this.dayLabels,
        datasets: [
          {
            label: label,
            backgroundColor: '#5cadff',
            data: ejectedData,
          },
        ],
      }

      return result
    },
    initWeekRange() {
      const days = []
      const lastWeek = dayjs().subtract(7, 'day')

      for (let i = 1; i <= 7; i++) {
        days.push(lastWeek.add(i, 'day'))
      }

      return days
    },
  },
}
</script>

<style lang="less">
.home-chart {
  padding: 10px;
  margin-top: 10px;

  &__title {
    text-align: center;
    margin-bottom: 15px;
    padding: 0 10px;
  }
}

.home-chart-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;

  &__value {
    font-size: 26px;
  }
}
</style>
