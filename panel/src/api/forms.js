import axios from '@/libs/api.request'

export const getFieldsList = (params) => {
  return axios.request({
    url: 'api/v1/forms/fields/field',
    method: 'get',
    params,
  })
}

export const getForms = (params) => {
  return axios.request({
    url: 'api/v1/forms/form',
    method: 'get',
    params,
  })
}

export const getCurrentForm = (id, params) => {
  return axios.request({
    url: `api/v1/forms/form/${id}`,
    method: 'get',
    params,
  })
}

export const getAllFields = (params) => {
  return axios.request({
    url: 'api/v1/forms/fields/field',
    method: 'get',
    params,
  })
}

export const getCurrentField = (id, params) => {
  return axios.request({
    url: `/api/v1/forms/fields/field/${id}`,
    method: 'get',
    params,
  })
}

export const updateField = (id, data, params) => {
  return axios.request({
    url: `/api/v1/forms/fields/field/${id}`,
    method: 'patch',
    type: 'field',
    data,
    params,
  })
}

export const getFieldTypes = () => {
  return axios.request({
    url: 'api/v1/forms/fields/field/types',
    method: 'get',
  })
}

export const createForm = (data) => {
  return axios.request({
    url: '/api/v1/forms/form',
    method: 'post',
    type: 'form',
    data,
  })
}

export const updateForm = (id, data) => {
  return axios.request({
    url: `/api/v1/forms/form/${id}`,
    method: 'patch',
    type: 'form',
    data,
  })
}

export const deleteForm = (id) => {
  return axios.request({
    url: `/api/v1/forms/form/${id}`,
    method: 'delete',
  })
}

export const createFormLink = (data) => {
  return axios.request({
    url: '/api/v1/forms/fields/form',
    method: 'post',
    type: 'form',
    data,
  })
}

export const updateFormLink = (id, data, params) => {
  return axios.request({
    url: '/api/v1/forms/fields/form/' + id,
    method: 'patch',
    type: 'form',
    data,
    params,
  })
}

export const deleteFormLink = (id) => {
  return axios.request({
    url: `/api/v1/forms/fields/form/${id}`,
    method: 'delete',
  })
}

export const createField = (data) => {
  return axios.request({
    url: '/api/v1/forms/fields/field',
    method: 'post',
    type: 'field',
    data,
  })
}

export const createValue = (data, params) => {
  return axios.request({
    url: '/api/v1/forms/fields/value',
    method: 'post',
    type: 'value',
    data,
    params,
  })
}

export const getAllValues = (params) => {
  return axios.request({
    url: '/api/v1/forms/fields/value',
    method: 'get',
    params: {
      ...params,
      'per-page': 0,
    },
  })
}

export const updateValue = (id, data, params) => {
  return axios.request({
    url: `/api/v1/forms/fields/value/${id}`,
    method: 'patch',
    type: 'value',
    data,
    params,
  })
}

export const deleteValue = (id) => {
  return axios.request({
    url: `/api/v1/forms/fields/value/${id}`,
    method: 'delete',
  })
}

export const deleteField = (id) => {
  return axios.request({
    url: `/api/v1/forms/fields/field/${id}`,
    method: 'delete',
  })
}

export const createGroup = (data, params) => {
  return axios.request({
    method: 'post',
    url: '/api/v1/forms/fields/group',
    type: 'group',
    data,
    params,
  })
}

export const updateGroup = (id, data, params) => {
  return axios.request({
    method: 'patch',
    url: `/api/v1/forms/fields/group/${id}`,
    type: 'group',
    data,
    params,
  })
}

export const deleteGroup = (id, params) => {
  return axios.request({
    method: 'delete',
    url: `/api/v1/forms/fields/group/${id}`,
    params,
  })
}
