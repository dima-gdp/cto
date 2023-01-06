import axios from '@/libs/api.request'

export const getTags = (params) => {
  return axios.request({
    url: 'api/v1/forms/fields/tag',
    method: 'get',
    params,
  })
}

export const getCurrentTag = (id, params) => {
  return axios.request({
    url: `api/v1/forms/fields/tag/${id}`,
    method: 'get',
    params,
  })
}

export const createTag = (data) => {
  return axios.request({
    url: 'api/v1/forms/fields/tag/create',
    method: 'post',
    type: 'tag',
    data,
  })
}

export const updateTag = (id, data) => {
  return axios.request({
    url: `/api/v1/forms/fields/tag/${id}`,
    method: 'patch',
    type: 'tag',
    data,
  })
}
