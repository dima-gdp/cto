import axios from '@/libs/api.request'

export const getContentList = (params) => {
  return axios.request({
    url: '/api/v1/content',
    method: 'get',
    params,
  })
}

export const getCurrentContent = (id, params) => {
  return axios.request({
    url: `/api/v1/content/${id}`,
    method: 'get',
    params,
  })
}

export const createContent = (data, params) => {
  return axios.request({
    url: '/api/v1/content',
    method: 'post',
    type: 'content',
    data,
    params,
  })
}

export const updateContent = (id, data, params) => {
  return axios.request({
    url: `/api/v1/content/${id}`,
    method: 'patch',
    type: 'content',
    data,
    params,
  })
}

export const deleteContent = (id) => {
  return axios.request({
    url: `/api/v1/content/${id}`,
    method: 'delete',
  })
}
