import axios from '@/libs/api.request'

export const getContentList = (params) => {
  return axios.request({
    url: 'api/v1/access/content',
    method: 'get',
    params,
  })
}
export const getContentInfo = (id) => {
  return axios.request({
    url: 'api/v1/access/content/' + id,
    method: 'get',
  })
}
export const createContent = (data) => {
  return axios.request({
    url: 'api/v1/access/content',
    access: true,
    type: 'content',
    method: 'post',
    data,
  })
}
export const updateContent = (id, data) => {
  return axios.request({
    url: 'api/v1/access/content/' + id,
    access: true,
    type: 'user',
    method: 'patch',
    data,
  })
}
export const delContent = (id) => {
  return axios.request({
    url: 'api/v1/access/content/' + id,
    access: true,
    method: 'delete',
  })
}
