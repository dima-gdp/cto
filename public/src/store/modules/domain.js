import useDomain from '@/domain/composables/use-domain'

const state = () => ({
  data: {},
})

const getters = {
  parentEventId: (state) => state.data.eventId,
  currentAuthGroupId: (state) => state.data.authGroupId,
}

const mutations = {
  SET_DOMAIN(state, payload) {
    state.data = payload
  },
}

const actions = {
  async fetchDomain({ commit }, { hostName }) {
    const domain = await useDomain().getDomainByName(hostName)

    commit('SET_DOMAIN', domain)
  },
}

export default {
  state,
  actions,
  mutations,
  getters,
  namespaced: true,
}
