import axios from '@/libs/api.request'

import { initParams } from './_defaultParams'

export const getEvents = (params) => {
  return axios.request({
    url: 'api/v1/events/event',
    method: 'get',
    params,
  })
}

export const getEvent = (id, params) => {
  return axios.request({
    url: `api/v1/events/event/${id}`,
    method: 'get',
    access: false,
    params,
  })
}

export const createEvent = (data, params) => {
  return axios.request({
    url: 'api/v1/events/event',
    method: 'post',
    type: 'event',
    data,
    params,
  })
}

export const updateEvent = (id, data, params) => {
  return axios.request({
    url: `api/v1/events/event/${id}`,
    method: 'patch',
    type: 'event',
    data,
    params,
  })
}

export const checkIsEventTypeEntityIsExisted = async (id, type) => {
  let isExisted = true
  await axios
    .request(
      {
        url: `api/v1/events/event-${type}/${id}`,
        method: 'get',
        params: { fields: { 'event-occasion': 'id' } },
      },
      true
    )
    .catch(() => {
      isExisted = false
    })
  return { data: { isExisted } }
}

export const getOneEventOccasion = (id, params) => {
  return axios.request({
    url: `api/v1/events/event-occasion/${id}`,
    method: 'get',
    params,
  })
}

export const getOneEventCabinet = (id, params) => {
  return axios.request({
    url: `api/v1/events/event-cabinet/${id}`,
    method: 'get',
    params,
  })
}

export const createEventOccasion = (data, params) => {
  return axios.request({
    url: 'api/v1/events/event-occasion',
    method: 'post',
    type: 'event-occasion',
    data,
    params,
  })
}

export const updateEventOccasion = (id, data, params) => {
  return axios.request({
    url: `api/v1/events/event-occasion/${id}`,
    method: 'patch',
    type: 'event-occasion',
    data,
    params,
  })
}

export const createEventCabinet = (data, params) => {
  return axios.request({
    url: 'api/v1/events/event-cabinet',
    method: 'post',
    type: 'event-cabinet',
    data,
    params,
  })
}

export const updateEventCabinet = (id, data, params) => {
  return axios.request({
    url: `api/v1/events/event-cabinet/${id}`,
    method: 'patch',
    type: 'event-cabinet',
    data,
    params,
  })
}

export const getEventToEventList = (params) => {
  params = initParams(params) || params
  return axios.request({
    url: 'api/v1/events/event-to-event/',
    method: 'get',
    params,
  })
}

export const createEventToEvent = (data, params) => {
  return axios.request({
    url: 'api/v1/events/event-to-event',
    method: 'post',
    type: 'event-to-event',
    data,
    params,
  })
}

export const updateEventToEvent = (id, data, params) => {
  return axios.request({
    url: `api/v1/events/event-to-event/${id}`,
    method: 'patch',
    type: 'event-to-event',
    params,
    data,
  })
}

export const deleteEventToEvent = (id) => {
  return axios.request({
    url: `api/v1/events/event-to-event/${id}`,
    method: 'delete',
  })
}

export const getRegistration = (params) => {
  params = initParams(params) || params
  return axios.request({
    url: 'api/v1/events/registration/',
    method: 'get',
    params,
  })
}

export const getCurrentRegistration = (id, params) => {
  return axios.request({
    url: `api/v1/events/registration/${id}`,
    method: 'get',
    params,
  })
}

export const updateRegistration = (id, data, params) => {
  return axios.request({
    url: `api/v1/events/registration/${id}`,
    method: 'patch',
    type: 'registration',
    params,
    data,
  })
}

export const deleteEventRegistration = (id) => {
  return axios.request({
    url: `api/v1/events/registration/${id}`,
    method: 'delete',
  })
}

export const getEventRequests = (params) => {
  params = initParams(params) || params
  return axios.request({
    url: 'api/v1/events/request',
    method: 'get',
    params,
  })
}

export const getCurrentEventRequest = (id, params) => {
  return axios.request({
    url: `api/v1/events/request/${id}`,
    method: 'get',
    params,
  })
}

export const deleteEventRequest = (id) => {
  return axios.request({
    url: `api/v1/events/request/${id}`,
    method: 'delete',
  })
}

export const updateEventRequest = (id, data) => {
  return axios.request({
    url: `api/v1/events/request/${id}`,
    method: 'patch',
    type: 'request',
    data,
  })
}

export const updateEventFormLink = (id, data) => {
  return axios.request({
    url: `/api/v1/events/form/${id}`,
    method: 'patch',
    type: 'form',
    data,
  })
}

export const getEventFormLink = (params) => {
  return axios.request({
    url: `/api/v1/events/form/`,
    method: 'get',
    params,
  })
}

export const createEventFormLink = (data, params) => {
  return axios.request({
    url: '/api/v1/events/form',
    method: 'post',
    type: 'form',
    data,
    params,
  })
}

export const getInvitationLetter = (params) => {
  return axios.request({
    url: '/api/v1/events/invitation',
    method: 'get',
    params,
  })
}

export const getEventStreamList = (params) => {
  return axios.request({
    url: 'api/v1/events/stream',
    method: 'get',
    params,
  })
}

export const createEventStream = (data, params) => {
  return axios.request({
    url: 'api/v1/events/stream',
    method: 'post',
    type: 'stream',
    data,
    params,
  })
}

export const updateEventStream = (id, data, params) => {
  return axios.request({
    url: `api/v1/events/stream/${id}`,
    method: 'patch',
    type: 'stream',
    data,
    params,
  })
}

export const deleteEventStream = (id, params) => {
  return axios.request({
    url: `api/v1/events/stream/${id}`,
    method: 'delete',
    params,
  })
}
