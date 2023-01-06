export default class BaseEndpoint {
  _axios
  _url
  _type

  constructor(_axios, url, type) {
    this._axios = _axios
    this._type = type
    this._url = url
  }

  /**
   *
   * @param id
   * @param params
   * @returns {Promise<{data: *, meta: *, status: *}>}
   */
  getOne(id, params = {}) {
    return this.request({
      url: `${this._url}/${id}`,
      method: 'GET',
      params,
    })
  }

  /**
   *
   * @param params
   * @returns {Promise<{data: *, meta: *, status: *}>}
   */
  getMany(params = {}) {
    return this.request({
      url: `${this._url}`,
      method: 'GET',
      params,
    })
  }

  /**
   *
   * @param data
   * @param params
   * @returns {Promise<{data: *, meta: *, status: *}>}
   */
  create(data = {}, params = {}) {
    return this.request({
      url: `${this._url}`,
      method: 'POST',
      data: { ...data, type: this._type },
      params,
    })
  }

  /**
   *
   * @param id
   * @param data
   * @param params
   * @returns {Promise<{data: *, meta: *, status: *}>}
   */
  update(id, data = {}, params = {}) {
    return this.request({
      url: `${this._url}/${id}`,
      method: 'PATCH',
      data: { ...data, type: this._type },
      params,
    })
  }

  /**
   *
   * @param id
   * @returns {Promise<{data: *, meta: *, status: *}>}
   */
  delete(id) {
    return this.request({
      url: `${this._url}/${id}`,
      method: 'DELETE',
    })
  }

  /**
   *
   * @param config
   * @returns {Promise<{
   *   data: *,
   *   meta: *,
   *   status: *
   * }>}
   * @private
   */
  async request(config) {
    return await this._axios.request(config)
  }

  get baseURL() {
    return this._axios.defaults.baseURL
  }
}
