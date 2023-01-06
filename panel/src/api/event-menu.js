import axios from '@/libs/api.request'

export const getEventMenuList = (params) => {
  return axios.request({
    url: 'api/v1/events/menu',
    method: 'get',
    params,
  })
}

export const getEventMenu = (id, params) => {
  return axios.request({
    url: `api/v1/events/menu/${id}`,
    method: 'get',
    params,
  })
}

export const createEventMenu = (data) => {
  return axios.request({
    url: 'api/v1/events/menu',
    method: 'post',
    type: 'event-menu',
    data,
  })
}

export const updateEventMenu = (id, data, params) => {
  return axios.request({
    url: `api/v1/events/menu/${id}`,
    method: 'patch',
    type: 'event-menu',
    data,
    params,
  })
}

export const deleteEventMenu = (id) => {
  return axios.request({
    url: `api/v1/events/menu/${id}`,
    method: 'delete',
  })
}

export const updateItemListMenu = (data, params) => {
  return axios.request({
    url: `api/v1/events/menu/item-list`,
    method: 'post',
    type: 'event-menu-item-list',
    data,
    params,
  })
}
