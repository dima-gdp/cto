import { Bar, mixins } from 'vue-chartjs'

export default {
  extends: Bar,
  mixins: [mixins.reactiveProp],
  props: {
    chartData: {
      type: Object,
      default: () => {},
    },
    title: {
      type: String,
      default: '',
    },
    options: {
      type: Object,
      default: () => {
        return {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: false,
          },
          scales: {
            yAxes: [
              {
                stacked: true,
                ticks: {
                  min: 0,
                  stepSize: 1,
                },
              },
            ],
          },
        }
      },
    },
  },
  mounted() {
    // Overwriting base render method with actual data.
    this.renderChart(this.chartData, this.options)
  },
}
