import BaseEndpoint from '@/api/endpoints/base-endpoint'

export default class RegistrationEndpoint extends BaseEndpoint {
  isExist({ email, authGroupId, eventId }) {
    return this.request({
      url: `${this._url}/exist`,
      params: {
        email,
        authGroupId,
        eventId,
      },
    })
  }

  quickRegistration(data) {
    return this.request({
      url: `${this._url}/quick`,
      method: 'POST',
      data: { ...data, type: this._type },
    })
  }
}
