import BaseEndpoint from '@/api/endpoints/base-endpoint'

export default class ShopEndpoint extends BaseEndpoint {
  getProducts(params) {
    return this.request({
      url: `/events/stores/product`,
      method: 'GET',
      params,
    })
  }
  getCurrencies(params) {
    return this.request({
      url: `/currency-rate`,
      method: 'GET',
      params,
    })
  }
}
