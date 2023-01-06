import axios from '@/libs/api.request'

export const getRequests = (params) => {
  return axios.request({
    url: 'api/v1/request',
    method: 'get',
    params,
  })
}

export const getCurrentRequest = (id, params) => {
  return axios.request({
    url: `api/v1/request/${id}`,
    method: 'get',
    params,
  })
}

export const createRequest = (data, params) => {
  return axios.request({
    url: 'api/v1/request',
    method: 'post',
    type: 'request',
    data,
    params,
  })
}

export const updateRequest = (id, data, params) => {
  return axios.request({
    url: `api/v1/request/${id}`,
    method: 'patch',
    type: 'request',
    data,
    params,
  })
}

export const deleteRequest = (id) => {
  return axios.request({
    url: `api/v1/request/${id}`,
    method: 'delete',
  })
}
