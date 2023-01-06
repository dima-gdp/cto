import axios from '@/libs/api.request'

export const apiLocales = {
  getLocalesByEventId: ({ id, params }) => {
    return axios.request({
      url: `api/v1/events/i18n/full/${id}`,
      method: 'get',
      params,
    })
  },

  getAllLocales: ({ params }) => {
    return axios.request({
      url: 'api/v1/events/i18n/',
      method: 'get',
      params,
    })
  },

  createLocale: ({ data, params }) => {
    return axios.request({
      url: 'api/v1/events/i18n',
      method: 'post',
      type: 'i18n',
      data,
      params,
    })
  },

  updateLocale: ({ id, data, params }) => {
    return axios.request({
      url: `api/v1/events/i18n/${id}`,
      method: 'patch',
      type: 'i18n',
      data,
      params,
    })
  },

  deleteLocale: ({ id }) => {
    return axios.request({
      url: `api/v1/events/i18n/${id}`,
      method: 'delete',
    })
  },
}
