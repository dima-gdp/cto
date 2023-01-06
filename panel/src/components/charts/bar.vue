<template>
  <div ref="dom" class="charts chart-bar"></div>
</template>

<script>
import echarts from 'echarts'
import tdTheme from './theme.json'
import { on, off } from '@/libs/tools'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartBar',
  // TODO: Поставить значения по-умолчанию у пропсов
  /* eslint-disable vue/require-default-prop */
  props: {
    value: { type: Object },
    text: { type: String },
    subtext: { type: String },
  },
  /* eslint-enable vue/require-default-prop */
  data() {
    return {
      dom: null,
    }
  },
  mounted() {
    this.$nextTick(() => {
      const xAxisData = Object.keys(this.value)
      const seriesData = Object.values(this.value)
      const option = {
        title: {
          text: this.text,
          subtext: this.subtext,
          x: 'center',
        },
        xAxis: {
          type: 'category',
          data: xAxisData,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: seriesData,
            type: 'bar',
          },
        ],
      }
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
    })
  },
  beforeDestroy() {
    off(window, 'resize', this.resize)
  },
  methods: {
    resize() {
      this.dom.resize()
    },
  },
}
</script>
