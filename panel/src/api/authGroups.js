import axios from '@/libs/api.request'

export const getAuthGroups = (params) => {
  return axios.request({
    url: '/api/v1/auth-group',
    method: 'get',
    params,
  })
}
export const getAuthGroup = (id, params) => {
  return axios.request({
    url: `/api/v1/auth-group/${id}`,
    method: 'get',
    params,
  })
}
export const createAuthGroup = (data) => {
  return axios.request({
    url: '/api/v1/auth-group',
    method: 'post',
    data,
    type: 'auth-group',
  })
}
export const updateAuthGroup = (id, data) => {
  return axios.request({
    url: `/api/v1/auth-group/${id}`,
    method: 'patch',
    data,
    type: 'auth-group',
  })
}
export const deleteAuthGroup = (id) => {
  return axios.request({
    url: `/api/v1/auth-group/${id}`,
    method: 'delete',
  })
}
