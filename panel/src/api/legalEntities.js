import axios from '@/libs/api.request'

export const getAllLegalEntities = (params) => {
  return axios.request({
    url: '/api/v1/legal-entity',
    method: 'get',
    params,
  })
}
export const getLegalEntitiesInfo = (id) => {
  return axios.request({
    url: `/api/v1/legal-entity/${id}`,
    method: 'get',
  })
}
export const deleteLegalEntities = (id) => {
  return axios.request({
    url: `/api/v1/legal-entity/${id}`,
    method: 'delete',
  })
}
export const updateLegalEntities = (id, data) => {
  return axios.request({
    url: `/api/v1/legal-entity/${id}`,
    type: 'legal-entity',
    method: 'patch',
    data,
  })
}
export const createLegalEntities = (data) => {
  return axios.request({
    url: '/api/v1/legal-entity',
    type: 'legal-entity',
    method: 'post',
    data,
  })
}
