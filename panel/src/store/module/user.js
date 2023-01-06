import {
  login,
  getUserInfo,
  getMessage,
  getContentByMsgId,
  hasRead,
  removeReaded,
  restoreTrash,
  getUnreadCount,
} from '@/api/user'
import { setToken, getToken, setUserId, getUserId } from '@/libs/util'

export default {
  state: {
    userName: '',
    userId: getUserId(),
    token: getToken(),
    access: '',
    hasGetInfo: false,
    unreadCount: 0,
    messageUnreadList: [],
    messageReadedList: [],
    messageTrashList: [],
    messageContentStore: {},
  },
  mutations: {
    setUserId(state, id) {
      state.userId = id
      setUserId(id)
    },
    setUserName(state, name) {
      state.userName = name
    },
    setLastName(state, lastName) {
      state.lastName = lastName
    },
    setAccess(state, access) {
      state.access = access
    },
    setToken(state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo(state, status) {
      state.hasGetInfo = status
    },
    setMessageCount(state, count) {
      state.unreadCount = count
    },
    setMessageUnreadList(state, list) {
      state.messageUnreadList = list
    },
    setMessageReadedList(state, list) {
      state.messageReadedList = list
    },
    setMessageTrashList(state, list) {
      state.messageTrashList = list
    },
    updateMessageContentStore(state, { msg_id, content }) {
      state.messageContentStore[msg_id] = content
    },
    moveMsg(state, { from, to, msg_id }) {
      const index = state[from].findIndex((_) => _.msg_id === msg_id)
      const msgItem = state[from].splice(index, 1)[0]
      msgItem.loading = false
      state[to].unshift(msgItem)
    },
  },
  getters: {
    role: (state) => state.access,
    userId: (state) => state.userId,
  },
  actions: {
    handleLogin({ commit }, { userName, password }) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        login({
          email: userName,
          password,
        })
          .then((res) => {
            const data = res.data
            commit('setUserId', data.id)
            commit('setAccess', data.roles[0])
            commit('setToken', data.token)
            resolve()
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    // 退出登录
    handleLogOut({ state, commit }) {
      return new Promise((resolve, reject) => {
        commit('setToken', '')
        commit('setAccess', [])
        resolve()
      })
    },
    getUserInfo({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo(state.userId)
            .then((res) => {
              const data = res.data
              commit('setUserName', data.firstName)
              commit('setLastName', data.lastName)
              commit('setUserId', data.id)
              commit('setAccess', data.role)
              commit('setHasGetInfo', true)
              resolve(data)
            })
            .catch((err) => {
              reject(err)
            })
        } catch (error) {
          reject(error)
        }
      })
    },
    getUnreadMessageCount({ state, commit }) {
      getUnreadCount().then((res) => {
        const { data } = res
        commit('setMessageCount', data)
      })
    },
    getMessageList({ state, commit }) {
      return new Promise((resolve, reject) => {
        getMessage()
          .then((res) => {
            const { unread, readed, trash } = res.data
            commit(
              'setMessageUnreadList',
              unread.sort((a, b) => new Date(b.create_time) - new Date(a.create_time))
            )
            commit(
              'setMessageReadedList',
              readed
                .map((_) => {
                  _.loading = false
                  return _
                })
                .sort((a, b) => new Date(b.create_time) - new Date(a.create_time))
            )
            commit(
              'setMessageTrashList',
              trash
                .map((_) => {
                  _.loading = false
                  return _
                })
                .sort((a, b) => new Date(b.create_time) - new Date(a.create_time))
            )
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    getContentByMsgId({ state, commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        const contentItem = state.messageContentStore[msg_id]
        if (contentItem) {
          resolve(contentItem)
        } else {
          getContentByMsgId(msg_id).then((res) => {
            const content = res.data
            commit('updateMessageContentStore', { msg_id, content })
            resolve(content)
          })
        }
      })
    },
    hasRead({ state, commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        hasRead(msg_id)
          .then(() => {
            commit('moveMsg', {
              from: 'messageUnreadList',
              to: 'messageReadedList',
              msg_id,
            })
            commit('setMessageCount', state.unreadCount - 1)
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    removeReaded({ commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        removeReaded(msg_id)
          .then(() => {
            commit('moveMsg', {
              from: 'messageReadedList',
              to: 'messageTrashList',
              msg_id,
            })
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    restoreTrash({ commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        restoreTrash(msg_id)
          .then(() => {
            commit('moveMsg', {
              from: 'messageTrashList',
              to: 'messageReadedList',
              msg_id,
            })
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
  },
}
