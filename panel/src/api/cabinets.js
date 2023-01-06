import axios from '@/libs/api.request'
// import { initParams } from './_defaultParams'

export const getCabinets = (params) => {
  return axios.request({
    url: 'api/v1/cabinets/cabinet',
    method: 'get',
    params,
  })
}

export const getOneCabinet = (id, params) => {
  return axios.request({
    url: `api/v1/cabinets/cabinet/${id}`,
    method: 'get',
    access: false,
    params,
  })
}

export const createCabinet = (data, params) => {
  return axios.request({
    url: 'api/v1/cabinets/cabinet',
    method: 'post',
    type: 'cabinet',
    data,
    params,
  })
}

export const updateCabinet = (id, data, params) => {
  return axios.request({
    url: `api/v1/cabinets/cabinet/${id}`,
    method: 'patch',
    type: 'cabinet',
    data,
    params,
  })
}

export const deleteCabinet = (id) => {
  return axios.request({
    url: `api/v1/cabinets/cabinet/${id}`,
    method: 'delete',
  })
}

export const createLinkToEvent = (data, params) => {
  return axios.request({
    url: 'api/v1/cabinets/event',
    method: 'post',
    type: 'event',
    data,
    params,
  })
}

export const updateLinkToEvent = (id, data, params) => {
  return axios.request({
    url: `api/v1/cabinets/event/${id}`,
    method: 'patch',
    type: 'event',
    data,
    params,
  })
}

export const deleteLinkToEvent = (id) => {
  return axios.request({
    url: `api/v1/cabinets/event/${id}`,
    method: 'delete',
  })
}
