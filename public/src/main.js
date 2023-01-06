import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { createWorkerClient } from '@/mocks/browser'

import '@/plugins/iview'
import '@/plugins/vue-feather'
import '@/plugins/composition-api'
import '@/plugins/luxon'
import '@/plugins/global-mixins'
import '@/plugins/v-mask'
import '@/plugins/casl'
import '@/plugins/portal-vue'
import '@/plugins/gtm'

import i18n from '@/plugins/i18n'

if (process.env.NODE_ENV === 'development') {
  createWorkerClient().start({
    onUnhandledRequest: 'bypass',
  })
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app')
