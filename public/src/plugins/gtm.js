import Vue from 'vue'
import VueGtm from '@gtm-support/vue2-gtm'
import router from '@/router'

const gtmOptions = {
  id: process.env.GTM_ID || 'GTM-5N5KV2B',
  enabled: process.env.VUE_APP_ENV === 'prod',
  defer: true,
  layer: 'dataLayer',
  respectDoNotTrack: true,
  vueRouter: router,
}

Vue.use(VueGtm, gtmOptions)

export default gtmOptions
