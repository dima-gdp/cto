import { PRODUCT_TYPE_ENUM } from '@/utils/constants'

export default class ProductService {
  /**
   * @param {EventStoreProduct} product
   * @return {boolean}
   */
  static isTicket(product) {
    return product.type === PRODUCT_TYPE_ENUM.TICKET
  }

  /**
   *
   * @param {EventStoreProduct} product
   * @return {Restrictions}
   */
  static getRestrictions(product) {
    return {
      limitCount: product.limitCount,
      sellingCount: product.sellingCount,
      orderLimitCount: product.orderLimitCount,
    }
  }
}
