import axios from '@/libs/api.request'

export const getStores = (params) => {
  return axios.request({
    url: 'api/v1/events/stores/store',
    method: 'get',
    params,
  })
}

export const getCurrentStore = (id, params) => {
  return axios.request({
    url: `api/v1/events/stores/store/${id}`,
    method: 'get',
    params,
  })
}

export const createStore = (data) => {
  return axios.request({
    url: 'api/v1/events/stores/store',
    method: 'post',
    type: 'store',
    data,
  })
}

export const updateStore = (id, data) => {
  return axios.request({
    url: `api/v1/events/stores/store/${id}`,
    method: 'patch',
    type: 'store',
    data,
  })
}

export const deleteStore = (id) => {
  return axios.request({
    url: `api/v1/events/stores/store/${id}`,
    method: 'delete',
  })
}

export const getCurrencies = () => {
  return axios.request({
    url: 'api/v1/currency-rate',
    method: 'get',
  })
}
