import axios from '@/libs/api.request'

export const getEventMenuItemList = (params) => {
  return axios.request({
    url: 'api/v1/events/menu/item',
    method: 'get',
    params,
  })
}

export const getEventMenuItem = (id, params) => {
  return axios.request({
    url: `api/v1/events/menu/item/${id}`,
    method: 'get',
    params,
  })
}

export const createEventMenuItem = (data) => {
  return axios.request({
    url: 'api/v1/events/menu/item',
    method: 'post',
    type: 'event-menu-item',
    data,
  })
}

export const updateEventMenuItem = (id, data, params) => {
  return axios.request({
    url: `api/v1/events/menu/item/${id}`,
    method: 'patch',
    type: 'event-menu-item',
    data,
    params,
  })
}

export const deleteEventMenuItem = (id) => {
  return axios.request({
    url: `api/v1/events/menu/item/${id}`,
    method: 'delete',
  })
}
