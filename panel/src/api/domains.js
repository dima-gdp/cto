import axios from '@/libs/api.request'

export const getDomains = (params) => {
  return axios.request({
    url: 'api/v1/domain',
    method: 'get',
    params,
  })
}

export const getOneDomain = (id, params) => {
  return axios.request({
    url: `api/v1/domain/${id}`,
    method: 'get',
    params,
  })
}

export const deleteDomain = (id) => {
  return axios.request({
    url: `api/v1/domain/${id}`,
    method: 'delete',
  })
}

export const updateDomain = (id, data, params) => {
  return axios.request({
    url: `api/v1/domain/${id}`,
    method: 'patch',
    type: 'domain',
    data,
    params,
  })
}

export const createDomain = (data, params) => {
  return axios.request({
    url: 'api/v1/domain',
    method: 'post',
    type: 'domain',
    data,
    params,
  })
}
