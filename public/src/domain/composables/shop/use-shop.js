import { getExistingApiInstance } from '@/api'

/**
 * @typedef EventStore Сущность магазина - она везде далее называется Shop
 * @property id: number,
 * @property name: string,
 * @property description: [string],
 * @property eventId: number,
 * @property sellingStartedAt: string,
 * @property sellingClosedAt: string,
 * @property sellingTimeStatus: string,
 * @property settings: [object],
 * @property active: boolean,
 * @property paymentProviders: number[],
 * @property lang: "ru" | "en"
 */

/**
 * @typedef {{
 * id: number,
 * name: number,
 * type: string,
 * description: string,
 * storeId: number,
 * sort: number,
 * price: number,
 * currency: string,
 * priceRub: number,
 * isCurrencyAllowed: boolean,
 * isRateBlocked: boolean,
 * settings: {},
 * active: boolean,
 * limitCount: null | number,
 * sellingCount: null | number,
 * orderLimitCount: null | number,
 * sellingStartedAt: null | string,
 * sellingClosedAt: null | string,
 * sellingTimeStatus: "string"
 * }} EventStoreProduct
 *
 */

export default function useShop() {
  async function createOrder(orders, storeId) {
    const api = getExistingApiInstance()
    const data = {
      type: 'order',
      store_id: storeId,
      items: orders,
    }
    const res = await api.order.create(data)
    return res.data
  }
  async function getOrders(userId, storeId) {
    const api = getExistingApiInstance()
    const params = {
      filter: { userId: userId, storeId: storeId },
      perPage: 0,
    }
    const res = await api.order.getMany(params)
    return {
      orders: res.data,
      ordersMeta: res.meta,
    }
  }
  async function getOrder(orderId) {
    const api = getExistingApiInstance()
    const res = await api.order.getOne(orderId, {
      include: 'order-items,payments',
    })
    return {
      order: res.data,
    }
  }
  async function updateOrder(orderId, data) {
    const api = getExistingApiInstance()
    const res = await api.order.update(orderId, data)
    return {
      order: res.data,
    }
  }
  async function loadMoreOrders(userId, storeId, meta) {
    const api = getExistingApiInstance()
    const { pageCount } = meta

    if (pageCount > 1) {
      const nextPage = meta.currentPage + 1

      const params = {
        filter: {
          userId: userId,
          storeId: storeId,
        },
        page: nextPage,
      }

      const res = await api.order.getMany(params)
      return {
        orders: res.data,
        ordersMeta: res.meta,
      }
    }
  }

  /**
   *
   * @param shopId
   * @return {Promise<EventStore>}
   */
  async function getShop(shopId) {
    const api = getExistingApiInstance()
    const shop = await api.shop.getOne(shopId)
    return shop.data
  }

  /**
   * @param shopId
   * @return {Promise<{tickets: EventStoreProduct[], others: EventStoreProduct[]}>}
   */
  async function getProducts(shopId) {
    const api = getExistingApiInstance()
    const params = {
      sort: '-sort',
      filter: {
        storeId: shopId,
        active: true,
        isSelling: true,
      },
      'per-page': 0,
    }
    const { data } = await api.shop.getProducts(params)
    const availableProducts = data.filter((p) => !p.isRateBlocked)
    return {
      tickets: availableProducts.filter((item) => item.type === 'ticket'),
      others: availableProducts.filter((item) => item.type === 'other'),
    }
  }
  async function getProviders(shopId) {
    const api = getExistingApiInstance()
    const paramsShop = { include: 'providers' }
    const providers = await api.shop.getOne(shopId, paramsShop)
    return providers.data.providers
  }
  async function getPayment(id, type) {
    const api = getExistingApiInstance()
    const params = {
      order_id: id,
      payment_method: type,
    }
    const { data } = await api.provider.pay(params)
    return {
      payment: data,
    }
  }
  async function getCurrencies(params) {
    const api = getExistingApiInstance()
    const { data } = await api.shop.getCurrencies(params)
    return [...data]
  }
  async function getShopId(eventId, lang) {
    const api = getExistingApiInstance()
    const params = {
      filter: { eventId: eventId, lang: lang },
      fields: { store: 'id' },
    }
    const { data } = await api.shop.getMany(params)

    if (data.length) {
      const [shop] = data
      return shop.id
    }
    return null
  }

  return {
    getEventStore: getShop,
    getProducts,
    getProviders,
    getPayment,
    getCurrencies,
    getShopId,

    // Order
    createOrder,
    getOrders,
    getOrder,
    loadMoreOrders,
    updateOrder,
  }
}
