import axios from '@/libs/api.request'
export const getImportList = (params) => {
  return axios.request({
    url: 'api/v1/queue-import/',
    method: 'get',
    access: true,
    params,
  })
}
export const getImportModels = (params) => {
  return axios.request({
    url: 'api/v1/queue-import/models',
    method: 'get',
    access: true,
    params,
  })
}
export const createImport = (data) => {
  return axios.request({
    url: 'api/v1/queue-import',
    type: 'queue-import-resource',
    method: 'post',
    data,
  })
}
