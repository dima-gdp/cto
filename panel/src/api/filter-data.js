import axios from '@/libs/api.request'

export const searchOptions = (key, value) => {
  return axios.request({
    url: 'api/v1/card/filter-data',
    method: 'GET',
    params: {
      filter: {
        keys: key,
        [key]: value,
      },
    },
  })
}
