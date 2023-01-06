import axios from '@/libs/api.request'

export const getEventPages = (params) => {
  return axios.request({
    url: `api/v1/events/event-page`,
    method: 'get',
    params,
  })
}

export const getEventPageAccess = (params) => {
  return axios.request({
    url: `api/v1/events/event-page-access`,
    method: 'get',
    params,
  })
}

export const getEventPage = (id, params) => {
  return axios.request({
    url: `api/v1/events/event-page/${id}`,
    method: 'get',
    params,
  })
}
/**
 * Если обновляется поле isStarted в true,
 * то на бекенд устанавливает у всех остальных страниц на мероприятии
 * isStarted в false
 * @param {*} id
 * @param {*} data
 * @param {*} [params]
 * @returns {Promise<{data:*,meta:*,status:*}>}
 */
export const updateEventPage = (id, data, params) => {
  return axios.request({
    url: `api/v1/events/event-page/${id}`,
    method: 'patch',
    data,
    params,
    type: 'eventPage',
  })
}

export const deleteEventPagesAccess = (id, params) => {
  return axios.request({
    url: `api/v1/events/event-page-access/${id}`,
    method: 'delete',
    params,
  })
}

export const createEventPagesAccess = (data, params) => {
  return axios.request({
    url: 'api/v1/events/pages/access-mass-issue',
    method: 'post',
    type: 'access-mass-issue',
    data,
    params,
  })
}

export const updateStartedEventPage = ({ eventPageId, isStarted }) => {
  return updateEventPage(eventPageId, { isStarted })
}

export const createEventPageAuthGroup = (data, params) => {
  return axios.request({
    url: `api/v1/events/pages/auth-group`,
    method: 'post',
    data,
    params,
    type: 'event-page-auth-group',
  })
}

export const deleteEventPageAuthGroup = (id, params) => {
  return axios.request({
    url: `api/v1/events/pages/auth-group/${id}`,
    method: 'delete',
    params,
  })
}

export const getEventPagesAccessIssuance = (params) => {
  return axios.request({
    url: `api/v1/events/event-page-access-issuance`,
    method: 'get',
    params,
  })
}

export const createEventPageAccessIssuance = (data, params) => {
  return axios.request({
    url: `api/v1/events/event-page-access-issuance`,
    method: 'post',
    data,
    params,
    type: 'event-page-access-issuance',
  })
}

export const deleteEventPageAccessIssuance = (id, params) => {
  return axios.request({
    url: `api/v1/events/event-page-access-issuance/${id}`,
    method: 'delete',
    params,
  })
}
