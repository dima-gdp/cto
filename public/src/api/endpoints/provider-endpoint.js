import BaseEndpoint from '@/api/endpoints/base-endpoint'

export default class ProviderEndpoint extends BaseEndpoint {
  pay(params) {
    const payUrl = '/payments/pay/process'
    return this.request({
      url: `${payUrl}`,
      method: 'GET',
      params,
    })
  }
}
