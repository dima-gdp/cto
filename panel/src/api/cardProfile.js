import axios from '@/libs/api.request'

export const getUsersCards = (params) => {
  return axios.request({
    url: 'api/v1/card/profile',
    method: 'GET',
    params,
  })
}

export const getCardById = ({ params, id }) => {
  return axios.request({
    url: `api/v1/card/profile/${id}`,
    method: 'GET',
    params,
  })
}
