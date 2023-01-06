import axios from '@/libs/api.request'

export const createStaticPage = (data, params) => {
  return axios.request({
    url: '/api/v1/page',
    method: 'post',
    data,
    params,
    type: 'page',
  })
}

export const updateStaticPage = (id, data, params) => {
  return axios.request({
    url: `/api/v1/page/${id}`,
    method: 'patch',
    data,
    params,
    type: 'page',
  })
}

export const getManyStaticPage = (params) => {
  return axios.request({
    url: '/api/v1/page',
    method: 'get',
    params,
  })
}

export const getOneStaticPage = (id, params) => {
  return axios.request({
    url: `/api/v1/page/${id}`,
    method: 'get',
    params,
  })
}

export const deleteStaticPage = (id) => {
  return axios.request({
    url: `/api/v1/page/${id}`,
    method: 'delete',
    type: 'page',
    data: {},
  })
}
