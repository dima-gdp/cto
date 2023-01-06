import BaseEndpoint from '@/api/endpoints/base-endpoint'

export default class UserEndpoint extends BaseEndpoint {
  authenticate({ authGroupId, email, password }) {
    return this.request({
      url: `${this._url}/auth`,
      method: 'POST',

      data: {
        type: this._type,
        authGroupId,
        email,
        password,
      },
    })
  }

  isExist({ email, authGroupId }) {
    return this.request({
      url: `${this._url}/exist`,
      params: {
        email,
        authGroupId,
      },
      type: this._type,
    })
  }

  requestPasswordRequest({ email, eventId, authGroupId, domainId }) {
    return this.request({
      url: `${this._url}/reset-password-request`,
      params: {
        email,
        eventId,
        authGroupId,
        domainId,
      },
    })
  }

  emailConfirmRequest({ eventId, userId }) {
    return this.request({
      url: `${this._url}/validation-email-request`,
      params: {
        eventId,
        userId,
      },
    })
  }

  changePassword({ password, repeatPassword, authGroupId, token }) {
    return this.request({
      url: `${this._url}/reset-password`,
      method: 'post',
      data: {
        token,
        password,
        repeatPassword,
        authGroupId,

        type: 'reset-password',
      },
    })
  }

  validateEmailToken({ token }) {
    return this.request({
      url: `${this._url}/validation`,
      method: 'GET',
      params: {
        token,
      },
    })
  }

  registerUser({ password, email, authGroupId, role }) {
    return this.request({
      url: `${this._url}/registration`,
      method: 'post',
      type: `${this._type}`,
      data: {
        password,
        email,
        authGroupId,
        role,
        type: `${this._type}`,
      },
    })
  }

  getUserMenu(userId, params) {
    return this.request({
      url: `/users/menu/${userId}`,
      method: 'get',
      params,
    })
  }
}
