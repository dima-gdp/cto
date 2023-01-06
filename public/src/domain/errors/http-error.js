export default class HttpError extends Error {
  type = 'network'

  constructor(error) {
    if (typeof error === 'string') {
      super(error)
    } else {
      const { status, payload, request } = error
      const generatedMessage = HttpError.generateMessage(error)

      super(generatedMessage)

      this.message = generatedMessage
      this.status = status
      this.payload = payload
      this.request = request
    }
  }

  static generateMessage({ payload, message }) {
    if (payload?.errors?.length) {
      return payload?.errors[0].detail
    } else if (message) {
      return message
    }
    return 'Unknown Network Error'
  }

  get requestPath() {
    // отличаются на сервере и на клиенте
    return this.request.path || this.request.responseURL
  }

  get shortErrorInfo() {
    return `
HTTP-ERROR: ${this.message}
REQUEST-PATH: ${this.requestPath}
    `
  }
}
