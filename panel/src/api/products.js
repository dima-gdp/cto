import axios from '@/libs/api.request'

export const getProducts = (params) => {
  return axios.request({
    url: 'api/v1/events/stores/product',
    method: 'get',
    params,
  })
}

export const createProduct = (data) => {
  return axios.request({
    url: 'api/v1/events/stores/product',
    method: 'post',
    type: 'product',
    data,
  })
}

export const updateProduct = (id, data) => {
  return axios.request({
    url: `api/v1/events/stores/product/${id}`,
    method: 'patch',
    type: 'product',
    data,
  })
}

export const deleteProduct = (id) => {
  return axios.request({
    url: `api/v1/events/stores/product/${id}`,
    method: 'delete',
  })
}
