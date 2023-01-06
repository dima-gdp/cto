import axios from '@/libs/api.request'

export const getEventLandingTemplatesList = (params) => {
  return axios.request({
    url: 'api/v1/events/event-landing-template',
    method: 'get',
    params,
  })
}

export const getEventLandingTemplate = (id, params) => {
  return axios.request({
    url: `api/v1/events/event-landing-template/${id}`,
    method: 'get',
    params,
  })
}

export const createEventLandingTemplate = (data, params) => {
  return axios.request({
    url: 'api/v1/events/event-landing-template',
    method: 'post',
    type: 'event-landing-template',
    data,
    params,
  })
}

export const updateEventLandingTemplate = (id, data, params) => {
  return axios.request({
    url: `api/v1/events/event-landing-template/${id}`,
    method: 'patch',
    type: 'event-landing-template',
    data,
    params,
  })
}


export const deleteEventLandingTemplate = (id) => {
  return axios.request({
    url: `api/v1/events/event-landing-template/${id}`,
    method: 'delete',
  })
}
