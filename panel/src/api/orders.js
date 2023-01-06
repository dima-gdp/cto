import axios from '@/libs/api.request'
import { initParams } from './_defaultParams'

export const getOrders = (params) => {
  params = initParams(params) || params
  return axios.request({
    url: 'api/v1/orders/order',
    method: 'get',
    params,
  })
}

export const getCurrentOrder = (id, params) => {
  return axios.request({
    url: `api/v1/orders/order/${id}`,
    method: 'get',
    params,
  })
}

export const updateOrder = (id, data) => {
  return axios.request({
    url: `api/v1/orders/order/${id}`,
    method: 'patch',
    type: 'order',
    data,
  })
}

export const deleteOrder = (id) => {
  return axios.request({
    url: `api/v1/orders/order/${id}`,
    method: 'delete',
  })
}

export const createOrdersReport = (params) => {
  return axios.request({
    url: `api/v1/orders/order`,
    method: 'get',
    params,
  })
}
