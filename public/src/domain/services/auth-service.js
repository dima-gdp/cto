import LocaleStorage from '@/domain/storage/locale-storage'
import store from '@/store'
import createAuthInterceptor from '@/api/interceptors/dynamic/create-auth-interceptor'
import { addRequestInterceptor, removeRequestInterceptor } from '@/api/interceptor-service'
import LogicError from '@/domain/errors/logic-error'
import AppLoadService from '@/domain/services/app-load-service'
import useUser from '@/domain/composables/use-user'
import { addPagesToRules } from '@/domain/services/page-service'

export default class AuthService {
  storage = new LocaleStorage()

  /**
   * если не передать параметры, возьмет их из стораджа
   * @param {string=} newToken
   * @param {number=} newUserId
   * @return {Promise<void>}
   */
  async setAuthData(newToken, newUserId) {
    let token, userId
    if (this.isUserHasActiveSession) {
      token = this.getAuthToken()
      userId = this.getUserId()
    } else if (newToken && newUserId) {
      token = newToken
      userId = newUserId
    } else {
      throw LogicError('Не переданы новые данные авторизации и не существует старых')
    }

    this.storage.setItem('token', token)
    this.storage.setItem('userId', userId)

    store.commit('auth/SET_AUTH_TOKEN', token)
    store.commit('auth/SET_USER_ID', userId)

    addRequestInterceptor(createAuthInterceptor(token))
    const { getUser } = useUser()

    const user = await getUser(userId)
    store.commit('auth/SET_USER_DATA', user)
    const eventId = store.getters['event/currentEventId']

    await store.dispatch('pages/fetchPages', { eventId })
    addPagesToRules(store.state.pages.data)
  }

  unsetAuthData() {
    this.storage.deleteItem('token')
    this.storage.deleteItem('userId')

    store.commit('auth/SET_USER_ID', null)
    store.commit('auth/SET_AUTH_TOKEN', null)

    removeRequestInterceptor(createAuthInterceptor().name)
  }

  getAuthToken() {
    // обращение к локал-стораджу - медленная операция, поэтому сначала ищем в vuex
    const tokenInStore = store.state.auth.token
    if (tokenInStore) {
      return tokenInStore
    } else {
      return this.storage.getItem('token')
    }
  }

  getUserId() {
    // обращение к локал-стораджу - медленная операция, поэтому сначала ищем в vuex
    const userIdInStore = store.state.auth.userId
    if (userIdInStore) {
      return userIdInStore
    } else {
      return this.storage.getItem('userId')
    }
  }

  get isUserHasActiveSession() {
    // это не совсем сессия, но не нашел лучше слова
    return !!this.getAuthToken() && !!this.getUserId()
  }
}
