import axios from '@/libs/api.request'

export const getTableData = () => {
  return axios.request({
    url: 'get_table_data',
    serialize: false,
    method: 'get',
  })
}

export const getDragList = () => {
  return axios.request({
    url: 'get_drag_list',
    serialize: false,
    method: 'get',
  })
}

export const errorReq = () => {
  return axios.request({
    url: 'error_url',
    serialize: false,
    method: 'post',
  })
}

export const saveErrorLogger = (info) => {
  return axios.request({
    url: 'save_error_logger',
    data: info,
    serialize: false,
    method: 'post',
  })
}

export const uploadImg = (formData) => {
  return axios.request({
    url: 'image/upload',
    serialize: false,
    data: formData,
  })
}

export const getOrgData = () => {
  return axios.request({
    url: 'get_org_data',
    serialize: false,
    method: 'get',
  })
}

export const getTreeSelectData = () => {
  return axios.request({
    url: 'get_tree_select_data',
    serialize: false,
    method: 'get',
  })
}
