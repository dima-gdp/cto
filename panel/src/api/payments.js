import axios from '@/libs/api.request'

export const makePayment = (params) => {
  return axios.request({
    url: '/api/v1/payments/pay/process',
    method: 'get',
    serialize: false,
    params,
  })
}

export const getAllPaymentProviders = (params) => {
  return axios.request({
    url: '/api/v1/payments/provider',
    method: 'get',
    params,
  })
}

export const getTypeProviders = () => {
  return axios.request({
    url: '/api/v1/payments/provider/list',
    method: 'get',
    serialize: false,
  })
}

export const createPayment = (data) => {
  return axios.request({
    type: 'provider',
    url: '/api/v1/payments/provider',
    method: 'post',
    data,
  })
}

export const updatePayment = (id, data) => {
  return axios.request({
    type: 'provider',
    url: '/api/v1/payments/provider/' + id,
    method: 'patch',
    data,
  })
}

export const deletePayment = (id) => {
  return axios.request({
    url: '/api/v1/payments/provider/' + id,
    method: 'delete',
  })
}

export const infoPayment = (id) => {
  return axios.request({
    url: '/api/v1/payments/provider/' + id,
    method: 'get',
  })
}
