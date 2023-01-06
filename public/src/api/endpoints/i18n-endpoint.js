import BaseEndpoint from '@/api/endpoints/base-endpoint'
export default class I18nEndpoint extends BaseEndpoint {
  getFullLocales(eventId, lang) {
    return this.request({
      url: `${this._url}/full/${eventId}`,
      method: 'GET',
      params: {
        lang,
      },
    })
  }
}
