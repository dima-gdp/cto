import axios from '@/libs/api.request'

export const getHallGroupList = (params) => {
  return axios.request({
    url: 'api/v1/events/hall-group',
    method: 'get',
    params,
  })
}

export const getHallGroup = (id, params) => {
  return axios.request({
    url: `api/v1/events/hall-group/${id}`,
    method: 'get',
    params,
  })
}

export const createHallGroup = (data) => {
  return axios.request({
    url: 'api/v1/events/hall-group',
    method: 'post',
    type: 'hall-group',
    data,
  })
}

export const updateHallGroup = (id, data, params) => {
  return axios.request({
    url: `api/v1/events/hall-group/${id}`,
    method: 'patch',
    type: 'hall-group',
    data,
    params,
  })
}

export const deleteHallGroup = (id) => {
  return axios.request({
    url: `api/v1/events/hall-group/${id}`,
    method: 'delete',
  })
}

export const getHallGroupReport = (params) => {
  return axios.request({
    url: `api/v1/events/activity/hall-group/`,
    method: 'get',
    params,
  })
}
