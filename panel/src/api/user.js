import axios from '@/libs/api.request'

export const login = ({ email, password }) => {
  const data = {
    email,
    password,
  }
  return axios.request({
    url: 'api/v1/user/auth',
    access: false,
    type: 'user',
    data,
    method: 'post',
  })
}

export const getUserInfo = (id, params) => {
  return axios.request({
    url: 'api/v1/user/' + id,
    method: 'get',
    params,
  })
}

export const createUser = (data) => {
  return axios.request({
    url: 'api/v1/user',
    access: true,
    type: 'user',
    method: 'post',
    data,
  })
}

export const updateUser = (id, data) => {
  return axios.request({
    url: 'api/v1/user/' + id,
    access: true,
    type: 'user',
    method: 'patch',
    data,
  })
}

export const deleteUser = (id) => {
  return axios.request({
    url: 'api/v1/user/' + id,
    access: true,
    method: 'delete',
  })
}

export const getUserList = (params) => {
  return axios.request({
    url: 'api/v1/user',
    method: 'get',
    params,
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'api/v1/logout',
    serialize: false,
    method: 'post',
  })
}

export const getUnreadCount = () => {
  return axios.request({
    url: 'message/count',
    serialize: false,
    method: 'get',
  })
}

export const getMessage = () => {
  return axios.request({
    url: 'message/init',
    serialize: false,
    method: 'get',
  })
}

export const getContentByMsgId = (msg_id) => {
  return axios.request({
    url: 'message/content',
    serialize: false,
    method: 'get',
    params: {
      msg_id,
    },
  })
}

export const hasRead = (msg_id) => {
  return axios.request({
    url: 'message/has_read',
    serialize: false,
    method: 'post',
    data: {
      msg_id,
    },
  })
}

export const removeReaded = (msg_id) => {
  return axios.request({
    url: 'message/remove_readed',
    method: 'post',
    serialize: false,
    data: {
      msg_id,
    },
  })
}

export const restoreTrash = (msg_id) => {
  return axios.request({
    url: 'message/restore',
    method: 'post',
    serialize: false,
    data: {
      msg_id,
    },
  })
}
