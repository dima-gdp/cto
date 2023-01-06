import { getExistingApiInstance } from '@/api'

export default function useMetric() {
  async function getMetricCounters(params) {
    const api = getExistingApiInstance()
    const { data } = await api.metricCounter.getMany(params)

    return data
  }

  async function initMetricScript() {
    ;(function (m, e, t, r, i, k, a) {
      m[i] =
        m[i] ||
        function () {
          ;(m[i].a = m[i].a || []).push(arguments)
        }
      m[i].l = 1 * new Date()
      ;(k = e.createElement(t)),
        (a = e.getElementsByTagName(t)[0]),
        (k.async = 1),
        (k.src = r),
        a.parentNode.insertBefore(k, a)
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym')
  }

  async function initMetrics(metrics) {
    await initMetricScript()
    metrics.forEach((metric) => {
       ym(metric.key, 'init', {
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true,
      })
    })
  }

  return { getMetricCounters, initMetricScript, initMetrics }
}
