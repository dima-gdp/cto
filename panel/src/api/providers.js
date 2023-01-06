import axios from 'axios'
import jsonpAdapter from 'axios-jsonp'

const token = process.env.VUE_APP_VK_TOKEN

export const getCities = (params) => {
  return axios.request({
    baseURL: 'https://api.vk.com/method',
    url: '/database.getCities',
    method: 'get',
    params: {
      access_token: token,
      country_id: 1,
      need_all: 1,
      q: 'Моск',
      v: 5.52,
    },
    adapter: jsonpAdapter,
  })
}
