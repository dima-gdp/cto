import axios from '@/libs/api.request'

export const getFile = (id) => {
  return axios.request({
    url: `/api/v1/files/file/${id}`,
    method: 'get',
  })
}

export const uploadFile = (data, params) => {
  return axios.request({
    url: '/api/v1/files/file/upload',
    method: 'post',
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    data,
    params,
  })
}

export const uploadFileByUrl = (data) => {
  return axios.request({
    url: '/api/v1/files/file/remote-upload',
    type: 'remote-upload',
    method: 'post',
    data,
  })
}

export const deleteFile = (id) => {
  return axios.request({
    url: `/api/v1/files/file/${id}`,
    method: 'delete',
  })
}
