import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import { setToken, getToken, canTurnTo, setTitle, setEventId } from '@/libs/util'
import config from '@/config'
import qs from 'qs'
const { homeName } = config

Vue.use(Router)
const router = new Router({
  routes,
  mode: 'history',
  parseQuery: qs.parse,
  stringifyQuery: stringify,
})
const LOGIN_PAGE_NAME = 'login'
const SELECT_EVENT_PAGE = 'select-event'

const turnTo = (to, access, next) => {
  if (access !== 'administrator' && access !== 'it' && to.name !== SELECT_EVENT_PAGE) {
    if (store.getters.hasGetEventName) {
      next()
    } else {
      if (store.state.app.eventId) {
        store
          .dispatch('getEventInfo')
          .then(() => {
            next()
          })
          .catch(() => {
            setEventId('')
            next({ name: SELECT_EVENT_PAGE })
          })
      } else {
        next({ name: SELECT_EVENT_PAGE })
      }
    }
  }

  if (canTurnTo(to.name, access, routes)) next()
  // Проверка прав
  else next({ replace: true, name: 'error_401' }) // Если нет, перенаправить на страницу 401
}

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  const token = getToken()
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    next({
      name: LOGIN_PAGE_NAME, // Переход на страницу входа
    })
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    next()
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    next({
      name: homeName,
    })
  } else {
    if (store.state.user.hasGetInfo) {
      turnTo(to, store.state.user.access, next)
    } else {
      store
        .dispatch('getUserInfo')
        .then((user) => {
          turnTo(to, user.role, next)
        })
        .catch(() => {
          setToken('')
          next({
            name: 'login',
          })
        })
    }
  }
})

router.afterEach((to, from) => {
  setTitle(to, router.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})

export default router

function stringify(obj) {
  const resultStr = qs.stringify(obj)
  return resultStr ? '?' + resultStr : ''
}
