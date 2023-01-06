import axios from '@/libs/api.request'
export const getRepotsList = (params) => {
  return axios.request({
    url: 'api/v1/queue-report/',
    method: 'get',
    access: true,
    params,
  })
}
export const reportViewed = (id, params) => {
  return axios.request({
    url: `api/v1/queue-report/${id}`,
    method: 'get',
    access: true,
    params,
  })
}
