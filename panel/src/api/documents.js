import axios from '@/libs/api.request'

export const getDocuments = (params) => {
  return axios.request({
    url: '/api/v1/events/document',
    method: 'get',
    params,
  })
}

export const createDocument = (data) => {
  return axios.request({
    type: 'document',
    url: '/api/v1/events/document',
    method: 'post',
    data,
  })
}

export const updateDocument = (id, data) => {
  return axios.request({
    type: 'document',
    url: '/api/v1/events/document/' + id,
    method: 'patch',
    data,
  })
}

export const deleteDocument = (id) => {
  return axios.request({
    url: '/api/v1/events/document/' + id,
    method: 'delete',
  })
}

export const checkUserDocument = (userId, eventId, templateId) => {
  return axios.request({
    type: 'check-user-document',
    url: '/api/v1/events/check-user-document',
    method: 'post',
    data: {
      userId,
      eventId,
      templateId,
      status: 'created',
    },
  })
}
