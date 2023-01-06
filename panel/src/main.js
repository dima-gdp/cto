// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'
import iView from 'iview'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import { directive as clickOutside } from 'v-click-outside-x'
import installPlugin from '@/plugin'
import '@/assets/icons/iconfont.css'
import TreeTable from 'tree-table-vue'
import VOrgTree from 'v-org-tree'
import 'v-org-tree/dist/v-org-tree.css'
import './styles/index.less'
import VueContentPlaceholders from 'vue-content-placeholders'
import Sticky from 'vue-sticky-directive'
import { mask } from 'vue-the-mask'
import Disabled from '@/components/disabled'
import luxon from '@/plugin/luxon'
import { createWorkerClient } from '@/mocks/browser'

// 实际打包时应该不引入mock
/* eslint-disable */
//if (process.env.NODE_ENV !== 'production') require('@/mock')
Vue.use(VueContentPlaceholders)
Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value),
})

Vue.use(TreeTable)
Vue.use(VOrgTree)
Vue.use(Sticky)
Vue.component('Disabled', Disabled)
/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * 注册指令
 */

Vue.prototype.$luxon = luxon

importDirective(Vue)
Vue.directive('clickOutside', clickOutside)
Vue.directive('mask', mask)

if (process.env.NODE_ENV === 'development') {
  createWorkerClient().start({
    onUnhandledRequest: 'bypass',
  })
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  i18n,
  render: (h) => h(App),
})
