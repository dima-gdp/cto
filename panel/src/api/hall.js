import axios from '@/libs/api.request'

export const createHall = (data) => {
  return axios.request({
    url: 'api/v1/events/hall',
    method: 'post',
    type: 'hall',
    data,
  })
}

export const updateHall = (id, data, params) => {
  return axios.request({
    url: `api/v1/events/hall/${id}`,
    method: 'patch',
    type: 'hall',
    data,
    params,
  })
}

export const deleteHall = (id) => {
  return axios.request({
    url: `api/v1/events/hall/${id}`,
    method: 'delete',
  })
}
