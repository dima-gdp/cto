const mutations = {
  ACCESS_RULES_IS_SET(state, payload) {
    state.accessRulesIsSet = payload
  },
  SET_APP_IS_LOADING(state, payload) {
    state.appIsLoading = payload
  },
  SET_THEME_IS_SETTING(state, payload) {
    state.themeIsSetting = payload
  },
}

export default mutations
