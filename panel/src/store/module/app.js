import {
  getBreadCrumbList,
  setTagNavListInLocalstorage,
  getMenuByRouter,
  getTagNavListFromLocalstorage,
  getHomeRoute,
  getNextRoute,
  routeHasExist,
  routeEqual,
  getRouteTitleHandled,
  localSave,
  localRead,
  getEventId,
  getPermissions,
  setPermissions,
  setEventId,
} from '@/libs/util'

import { getEvent } from '@/api/event'
import router from '@/router'
import routers from '@/router/routers'
import config from '@/config'
const { homeName } = config

const closePage = (state, route) => {
  const nextRoute = getNextRoute(state.tagNavList, route)
  state.tagNavList = state.tagNavList.filter((item) => {
    return !routeEqual(item, route)
  })
  router.push(nextRoute)
}

export default {
  state: {
    eventId: getEventId(),
    eventName: '',
    breadCrumbList: [],
    tagNavList: [],
    homeRoute: {},
    local: localRead('local'),
    errorList: [],
    hasReadErrorPage: false,
    eventLoad: false,
    permissions: getPermissions(),
  },
  getters: {
    permissions: (state) => state.permissions,
    menuList: (state, getters, rootState) => getMenuByRouter(routers, rootState.user.access),
    hasGetEventName: (state) => state.eventName?.length > 0,
    errorCount: (state) => state.errorList.length,
    eventName: (state) => state.eventName,
    breadCrumbList: (state) => state.breadCrumbList,
    getEventId: (state) => state.eventId,
    isEventLoading: (state) => state.eventLoad,
  },
  mutations: {
    setEventId(state, id) {
      state.eventId = id
      setEventId(id)
    },
    setPermissions(state, permissions) {
      state.permissions = permissions
      setPermissions(permissions)
    },
    setEventLoad(state, value) {
      state.eventLoad = value
    },
    setEventName(state, name) {
      state.eventName = name
    },
    setUserName(state, name) {
      state.userName = name
    },
    setLastName(state, lastName) {
      state.lastName = lastName
    },
    setBreadCrumb(state, route) {
      state.breadCrumbList = getBreadCrumbList(route, state.homeRoute)
    },
    setHomeRoute(state, routes) {
      state.homeRoute = getHomeRoute(routes, homeName)
    },
    setTagNavList(state, list) {
      let tagList = []
      if (list) {
        tagList = [...list]
      } else tagList = getTagNavListFromLocalstorage() || []
      if (tagList[0] && tagList[0].name !== homeName) tagList.shift()
      const homeTagIndex = tagList.findIndex((item) => item.name === homeName)
      if (homeTagIndex > 0) {
        const homeTag = tagList.splice(homeTagIndex, 1)[0]
        tagList.unshift(homeTag)
      }
      state.tagNavList = tagList
      setTagNavListInLocalstorage([...tagList])
    },
    closeTag(state, route) {
      const tag = state.tagNavList.filter((item) => routeEqual(item, route))
      route = tag[0] ? tag[0] : null
      if (!route) return
      closePage(state, route)
    },
    addTag(state, { route, type = 'unshift' }) {
      const router = getRouteTitleHandled(route)
      if (!routeHasExist(state.tagNavList, router)) {
        if (type === 'push') state.tagNavList.push(router)
        else {
          if (router.name === homeName) state.tagNavList.unshift(router)
          else state.tagNavList.splice(1, 0, router)
        }
        setTagNavListInLocalstorage([...state.tagNavList])
      }
    },
    setLocal(state, lang) {
      localSave('local', lang)
      state.local = lang
    },
    addError(state, error) {
      state.errorList.push(error)
    },
    setHasReadErrorLoggerStatus(state, status = true) {
      state.hasReadErrorPage = status
    },
  },
  actions: {
    handleSelectedEvent({ commit }, [eventId, permissions]) {
      commit('setEventId', eventId)
      commit('setPermissions', permissions)
    },
    getEventInfo({ state, commit }) {
      commit('setEventLoad', true)
      getEvent(state.eventId).then((info) => {
        commit('setEventName', info.data.technicalName)
        commit('setEventLoad', false)
      })
    },
    addErrorLog({ commit, rootState }, info) {
      console.error(info)
    },
  },
}
