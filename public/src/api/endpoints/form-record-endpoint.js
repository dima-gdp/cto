import BaseEndpoint from '@/api/endpoints/base-endpoint'

export default class FormRecordEndpoint extends BaseEndpoint {
  createRegistration(data, params) {
    return this.request({
      url: `${this._url}/registration`,
      method: 'POST',
      data: {
        ...data,
        type: `${this._type}`,
      },
      params,
    })
  }

  updateRegistration(id, data, params) {
    return this.request({
      url: `${this._url}/registration/${id}`,
      method: 'PATCH',
      data: {
        ...data,
        type: `${this._type}`,
      },
      params,
    })
  }

  createRequest(data, params) {
    return this.request({
      url: `${this._url}/request`,
      method: 'POST',
      data: {
        ...data,
        type: `${this._type}`,
      },
      params,
    })
  }

  updateRequest(id, data, params) {
    return this.request({
      url: `${this._url}/request/${id}`,
      method: 'PATCH',
      data: {
        ...data,
        type: `${this._type}`,
      },
      params,
    })
  }
}
