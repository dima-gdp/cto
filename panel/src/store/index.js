import Vue from 'vue'
import Vuex from 'vuex'

import user from './module/user'
import app from './module/app'
import reports from './module/reports'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    app,
    reports,
  },
})
