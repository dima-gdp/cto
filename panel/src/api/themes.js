import axios from '@/libs/api.request'

export const getManyThemes = (params) =>
  axios.request({
    url: '/api/v1/styles/theme',
    method: 'GET',
    params,
  })

export const getOneTheme = (id, params) =>
  axios.request({
    url: `/api/v1/styles/theme/${id}`,
    method: 'GET',
    params,
  })

export const createTheme = (data, params) =>
  axios.request({
    url: '/api/v1/styles/theme',
    method: 'POST',
    type: 'theme',
    headers: { 'Content-Type': 'application/json+css' },
    data,
    params,
  })

export const updateTheme = (id, data, params) =>
  axios.request({
    url: `/api/v1/styles/theme/${id}`,
    method: 'PATCH',
    type: 'theme',
    headers: { 'Content-Type': 'application/json+css' },
    data,
    params,
  })
