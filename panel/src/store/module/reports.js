import { getRepotsList } from '@/api/reports'
import store from '../index'
export default {
  namespaced: true,
  state: {
    count: [],
    reports: [],
  },
  mutations: {
    setReports(state, reports) {
      state.reports = reports
    },
  },
  getters: {
    countReports: (state) => {
      return state.reports.filter((report) => !report.viewed && report.status === 'ENDED').length
    },
  },
  actions: {
    async getReports({ state, commit }) {
      const params = {
        filter: {
          userId: store.state.user.userId,
        },
        'per-page': 0,
      }

      try {
        const { data, errors } = await getRepotsList(params)
        commit('setReports', data)
      } catch (e) {
        console.error(e)
      }
    },
  },
}
