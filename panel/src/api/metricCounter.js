import axios from '@/libs/api.request'

export const getMetricCounter = (params) => {
  return axios.request({
    url: 'api/v1/metric-counter',
    method: 'get',
    params,
  })
}

export const getOneMetricCounter = (id, params) => {
  return axios.request({
    url: `api/v1/metric-counter/${id}`,
    method: 'get',
    params,
  })
}

export const deleteMetricCounter = (id) => {
  return axios.request({
    url: `api/v1/metric-counter/${id}`,
    method: 'delete',
  })
}

export const updateMetricCounter = (id, data, params) => {
  return axios.request({
    url: `api/v1/metric-counter/${id}`,
    method: 'patch',
    type: 'metric-counter',
    data,
    params,
  })
}

export const createMetricCounter = (data, params) => {
  return axios.request({
    url: 'api/v1/metric-counter',
    method: 'post',
    type: 'metric-counter',
    data,
    params,
  })
}
