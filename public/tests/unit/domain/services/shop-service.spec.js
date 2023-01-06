import ShopService from '@/domain/services/shop-service'
import ProductService from '@/domain/services/product-service'
import { mockProductsFixture } from '@/api/mocs/api-shop-mock'
import {
  mockShopFixture,
  mockShopBeforeSellingFixture,
  mockShopSellingClosedFixture,
} from '@/api/mocs/api-shop-mock'
import LogicError from '@/domain/errors/logic-error'
import * as i18nObject from '@/plugins/i18n'

describe('src/domain/services/shop-service.js', () => {
  const RESTRICTION = {
    orderLimitCount: 100,
    limitCount: 500,
    sellingCount: 103,
  }
  const RESTRICTION_ZERO = {
    orderLimitCount: 0,
    limitCount: 0,
    sellingCount: 0,
  }
  const TICKET = mockProductsFixture.tickets[0]
  const LOCALE = 'en'

  describe('calculateRemains', () => {
    it('calculateRemains вернет наименьшее количество товара, если переданы ограничения', () => {
      const productAmount = ShopService.calculateRemains(RESTRICTION)

      expect(productAmount).toBe(100)
    })

    it('calculateRemains вернет Infinity, если не переданы ограничения', () => {
      const NON_LIMITED = {}
      const productAmount = ShopService.calculateRemains(NON_LIMITED)

      expect(productAmount).toBe(Infinity)
    })
  })

  describe('getRemainsByProduct', () => {
    it('Если продукт является ticket и остаток больше 0, то getRemainsByProduct вернет 1', () => {
      jest.spyOn(ProductService, 'getRestrictions').mockReturnValue(RESTRICTION)
      jest.spyOn(ProductService, 'isTicket').mockReturnValue(true)

      expect(ShopService.getRemainsByProduct(TICKET)).toBe(1)
    })

    it('Если продукт является ticket и остаток меньше 1, то getRemainsByProduct вернет остаток', () => {
      jest.spyOn(ProductService, 'getRestrictions').mockReturnValue(RESTRICTION_ZERO)
      jest.spyOn(ProductService, 'isTicket').mockReturnValue(true)

      expect(ShopService.getRemainsByProduct(TICKET)).toBe(0)
    })

    it('Если продукт не является ticket, то getRemainsByProduct вернет остаток', () => {
      jest.spyOn(ProductService, 'getRestrictions').mockReturnValue(RESTRICTION_ZERO)
      jest.spyOn(ProductService, 'isTicket').mockReturnValue(false)

      expect(ShopService.getRemainsByProduct(TICKET)).toBe(0)
    })
  })

  describe('getShopDateStatusMessage', () => {
    const I18N_DURING = 'during'
    const I18N_ENTITY = 'event'
    const I18N_BEFORE = 'before'
    const I18N_AFTER = 'after'
    const spyOnTranslateFn = jest.spyOn(i18nObject, 'translateFn')
    spyOnTranslateFn.mockImplementation((key) => {
      if (key === 'shop.alerts.during') {
        return I18N_DURING
      }
      if (key === 'shop.alerts.entity') {
        return I18N_ENTITY
      }
      if (key === 'shop.alerts.before') {
        return I18N_BEFORE
      }
      if (key === 'shop.alerts.after') {
        return I18N_AFTER
      }
      return i18nObject.EMPTY_LOCALE_MESSAGE
    })

    it('Если статус магазина равен during', () => {
      const message = ShopService.getShopDateStatusMessage(LOCALE, mockShopFixture)

      expect(message).toBe(`${I18N_ENTITY} ${I18N_DURING} December 21, 2021`)
    })

    it('Если статус магазина равен before', () => {
      const message = ShopService.getShopDateStatusMessage(LOCALE, mockShopBeforeSellingFixture)

      expect(message).toBe(`${I18N_ENTITY} ${I18N_BEFORE} December 12, 2019`)
    })

    it('Если статус магазина равен after', () => {
      const message = ShopService.getShopDateStatusMessage(LOCALE, mockShopSellingClosedFixture)

      expect(message).toBe(`${I18N_ENTITY} ${I18N_AFTER} December 21, 2021`)
    })
  })

  describe('isSomeTicketAlreadySelected', () => {
    it('isSomeTicketAlreadySelected вернет true, если хоть один продукт это тикет и количество продукта больше 0', () => {
      jest.spyOn(ProductService, 'isTicket').mockReturnValue(true)
      expect(ShopService.isSomeTicketAlreadySelected([{ amount: 1 }])).toBe(true)
    })

    it('isSomeTicketAlreadySelected вернет false, если хоть один продукт это тикет и количество продукта меньше 1', () => {
      jest.spyOn(ProductService, 'isTicket').mockReturnValue(true)
      expect(ShopService.isSomeTicketAlreadySelected([{ amount: 0 }])).toBe(false)
    })

    it('isSomeTicketAlreadySelected вернет false, если в продуктах нет тикетов и количество продукта больше 0', () => {
      jest.spyOn(ProductService, 'isTicket').mockReturnValue(false)
      expect(ShopService.isSomeTicketAlreadySelected([{ amount: 1 }])).toBe(false)
    })
  })

  describe('isItemAlreadySelected', () => {
    it('isItemAlreadySelected вернут true, если id продукта включен в выбранные продукты', () => {
      const PRODUCT_ID = 1
      const CHECKED_ID = 1
      const selectedItems = [
        {
          product: {
            id: PRODUCT_ID,
          },
        },
      ]

      expect(ShopService.isItemAlreadySelected(CHECKED_ID, selectedItems)).toBe(true)
    })

    it('isItemAlreadySelected вернут false, если id продукта не включен в выбранные продукты', () => {
      const PRODUCT_ID = 1
      const CHECKED_ID = 2
      const selectedItems = [
        {
          product: {
            id: PRODUCT_ID,
          },
        },
      ]

      expect(ShopService.isItemAlreadySelected(CHECKED_ID, selectedItems)).toBe(false)
    })
  })

  describe('updateAmountInCard', () => {
    it('updateAmountInCard кинет LogicError, если продукт это тикет и если тикет уже выбран', () => {
      const item = { product: 'product', amount: 1 }
      const orderItems = [item]
      const newAmount = 1
      jest.spyOn(ProductService, 'isTicket').mockReturnValue(true)

      expect(() => ShopService.updateAmountInCard(item, orderItems, newAmount)).toThrow(LogicError)
    })

    it('updateAmountInCard вернет обновленную корзину, если продукт это не тикет и продукт уже выбран', () => {
      const item = {
        product: {
          id: 10,
        },
      }
      const orderItems = [item]
      const newAmount = 1
      jest.spyOn(ProductService, 'isTicket').mockReturnValue(false)

      expect(ShopService.updateAmountInCard(item, orderItems, newAmount)).toEqual([
        { amount: newAmount, ...item },
      ])
    })

    it('updateAmountInCard вернет обновленную корзину, если продукт еще не в корзине', () => {
      const item = {
        product: {
          id: 10,
        },
      }
      const orderItems = []
      const newAmount = 1
      jest.spyOn(ProductService, 'isTicket').mockReturnValue(false)

      expect(ShopService.updateAmountInCard(item, orderItems, newAmount)).toEqual([
        { amount: newAmount, ...item },
      ])
    })
  })

  it('removeItemFromCard возвращает корзину без передаваемого продукта', () => {
    const item = {
      product: {
        id: 1,
      },
    }
    const orderItems = [item]
    expect(ShopService.removeItemFromCard(item, orderItems)).toEqual([])
  })

  describe('getAmountItemById', () => {
    it('getAmountItemById возвращает количество товара, если оно есть', () => {
      const AMOUNT = 1000
      const ID = 1
      const item = {
        amount: AMOUNT,
        product: {
          id: ID,
        },
      }
      const orderItems = [item]

      expect(ShopService.getAmountItemById(ID, orderItems)).toBe(AMOUNT)
    })
  })

  it('getAmountItemById возвращает 0, если количество товара не указано', () => {
    const ID = 1
    const item = {
      product: {
        id: ID,
      },
    }
    const orderItems = [item]

    expect(ShopService.getAmountItemById(ID, orderItems)).toBe(0)
  })
})
