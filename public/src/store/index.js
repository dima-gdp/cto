import Vue from 'vue'
import Vuex from 'vuex'
import globalState from './global-state'
import globalMutations from './global-mutations'
import globalActions from './global-actions'
import globalGetters from './global-getters'

import authModule from './modules/auth'
import shopModule from './modules/shop'
import pagesModule from './modules/pages'
import domainModule from './modules/domain'
import eventModule from './modules/event'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: globalState,
  mutations: globalMutations,
  actions: globalActions,
  getters: globalGetters,
  modules: {
    auth: authModule,
    shop: shopModule,
    pages: pagesModule,
    domain: domainModule,
    event: eventModule,
  },
})

export default store
