import axios from '@/libs/api.request'
import qs from 'qs'

export const getUsersCards = ({ params, data }) => {
  return axios.request({
    url: 'api/v1/card/filtered',
    method: 'post',
    params,
    data,
    paramsSerializer: (params) => {
      return qs.stringify(params, {
        encode: false,
      })
    },
  })
}

export const getCardById = ({ params, id }) => {
  return axios.request({
    url: `api/v1/card/${id}`,
    method: 'GET',
    params,
    paramsSerializer: (params) => {
      return qs.stringify(params, {
        encode: false,
      })
    },
  })
}
