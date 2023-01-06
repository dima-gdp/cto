import { TIME_STATUSES } from '@/utils/constants'
import { DateTime } from '@/plugins/luxon'
import { translateFn } from '@/plugins/i18n'
import ProductService from '@/domain/services/product-service'
import { compareId } from '@/utils'
import LogicError from '@/domain/errors/logic-error'

/**
 * @typedef {{
 *   orderLimitCount: number|null,
 *   limitCount: number|null,
 *   sellingCount: number|null
 * }} Restrictions
 */

/**
 * @typedef {{
 *   product: {},
 *   amount: number
 * }} OrderItem
 */

export default class ShopService {
  /**
   * Рассчитывает количество товара, которое может приобрести пользователь
   * Может вернуть Infinity, если количество не ограниченно
   * @param {Restrictions} restrictions
   * @returns number
   */
  static calculateRemains(restrictions) {
    const { orderLimitCount, limitCount, sellingCount } = {
      orderLimitCount: restrictions.orderLimitCount ?? Infinity,
      limitCount: restrictions.limitCount ?? Infinity,
      sellingCount: restrictions.sellingCount ?? 0,
    }

    return Math.min(orderLimitCount, limitCount - sellingCount)
  }

  /**
   * @param {EventStoreProduct} product
   */
  static getRemainsByProduct(product) {
    const remains = ShopService.calculateRemains(ProductService.getRestrictions(product))
    if (ProductService.isTicket(product) && remains > 0) {
      return 1 // ни при каких условиях нельзя купить больше 1 билета (не знаю, валидирует ли это бекенд)
    }
    return remains
  }

  /**
   * @param {'ru'|'en'} localeCode
   * @param {EventStore} shop
   * @return {string}
   */
  static getShopDateStatusMessage(localeCode, shop) {
    const { sellingStartedAt, sellingClosedAt, sellingTimeStatus } = shop
    const start = DateTime.fromISO(sellingStartedAt)
    const end = DateTime.fromISO(sellingClosedAt)

    const entity = translateFn('shop.alerts.entity')
    const before = translateFn('shop.alerts.before')
    const during = translateFn('shop.alerts.during')
    const after = translateFn('shop.alerts.after')

    function formatDate(date, lang) {
      return date.setLocale(lang).toLocaleString(DateTime.DATE_FULL)
    }

    if (sellingTimeStatus === TIME_STATUSES.ENDED) {
      return `${entity} ${after} ${formatDate(end, localeCode)}`
    }

    if (sellingTimeStatus === TIME_STATUSES.WILL_START) {
      return `${entity} ${before} ${formatDate(start, localeCode)}`
    }

    return `${entity} ${during} ${formatDate(end, localeCode)}`
  }

  /**
   *
   * @param {OrderItem[]} products
   * @return {boolean}
   */
  static isSomeTicketAlreadySelected(products) {
    return products.some(
      (product) => ProductService.isTicket(product.product) && product.amount > 0,
    )
  }

  /**
   *
   * @param {number} itemId
   * @param {OrderItem[]} selectedItems
   * @return {*}
   */
  static isItemAlreadySelected(itemId, selectedItems) {
    return selectedItems.some((orderItem) => compareId(itemId, orderItem.product.id))
  }

  /**
   * @param {OrderItem} item
   * @param {OrderItem[]} orderItems
   * @param {number} newAmount
   * @return {OrderItem[]}
   */
  static updateAmountInCard(item, orderItems, newAmount) {
    if (
      ProductService.isTicket(item.product) &&
      ShopService.isSomeTicketAlreadySelected(orderItems)
    ) {
      throw new LogicError('Нельзя выбрать два разных билета!')
    }
    const updatedProduct = {
      product: item.product,
      amount: newAmount,
    }
    if (ShopService.isItemAlreadySelected(item.product.id, orderItems)) {
      return orderItems.map((oldProduct) =>
        compareId(item.product.id, oldProduct.product.id) ? updatedProduct : oldProduct,
      )
    }
    return [...orderItems, updatedProduct]
  }

  /**
   * @param {OrderItem} item
   * @param {OrderItem[]} orderItems
   * @return {OrderItem[]}
   */
  static removeItemFromCard(item, orderItems) {
    return orderItems.filter((orderItem) => !compareId(item.product.id, orderItem.product.id))
  }

  /**
   * @param {number} itemId
   * @param {OrderItem[]} orderItems
   * @return number
   */
  static getAmountItemById(itemId, orderItems) {
    const item = orderItems.find((orderItem) => compareId(itemId, orderItem.product.id))
    return item?.amount ?? 0
  }
}
