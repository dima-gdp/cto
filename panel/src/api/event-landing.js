import axios from '@/libs/api.request'

export const getEventLandingsList = (params) => {
  return axios.request({
    url: 'api/v1/events/event-landing',
    method: 'get',
    params,
  })
}

export const createEventLanding = (data, params) => {
  return axios.request({
    url: 'api/v1/events/event-landing',
    method: 'post',
    type: 'event-landing',
    data,
    params,
  })
}

export const updateEventLanding = (id, data, params) => {
  return axios.request({
    url: `api/v1/events/event-landing/${id}`,
    method: 'patch',
    type: 'event-landing',
    data,
    params,
  })
}

