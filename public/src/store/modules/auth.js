const state = () => ({
  userId: '',
  token: '',
  userData: {},
})

const getters = {
  isLoggedIn: (state) => !!state.token,
  email: (state) => state.userData.email,
}

const mutations = {
  SET_USER_ID(state, payload) {
    state.userId = payload
  },
  SET_USER_DATA(state, payload) {
    state.userData = payload
  },
  SET_AUTH_TOKEN(state, payload) {
    state.token = payload
  },
}

export default {
  state,
  getters,
  mutations,
  namespaced: true,
}
