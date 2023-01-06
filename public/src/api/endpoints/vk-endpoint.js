import BaseEndpoint from '@/api/endpoints/base-endpoint'
import LogicError from '@/domain/errors/logic-error'
import jsonpAdapter from 'axios-jsonp'

const VkEndpointError = new LogicError('Данный метод не реализован в апи')
const vkToken = 'aec210dbaec210dbaec210db65aea8893eaaec2aec210dbf21f7b278b79cc0a17c520cc'

export default class VkEndpoint extends BaseEndpoint {
  constructor(axiosConfig, url, type) {
    super(
      {
        ...axiosConfig,
        adapter: jsonpAdapter,
      },
      url,
      type,
    )
  }

  getCities(query, params = { country_id: 1 }) {
    return this.request({
      url: `${this._url}/cities/`,
      params: {
        access_token: vkToken,
        need_all: 0,
        q: query,
        v: 5.131,
        ...params,
      },
    })
  }

  getCountries(params = {}) {
    return this.request({
      url: `${this._url}/countries/`,
      params: {
        access_token: vkToken,
        need_all: 1,
        v: 5.131,
        count: 1000, // если не указать, то будет запрошены дефолтные 100, вне зависимости от need_all
        ...params,
      },
    })
  }

  getOne(id, params = {}) {
    throw VkEndpointError
  }

  getMany(params = {}) {
    throw VkEndpointError
  }

  create(data = {}, params = {}) {
    throw VkEndpointError
  }

  update(id, data = {}, params = {}) {
    throw VkEndpointError
  }

  delete(id) {
    throw VkEndpointError
  }
}
