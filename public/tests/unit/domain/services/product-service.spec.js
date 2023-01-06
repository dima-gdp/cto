import ProductService from '@/domain/services/product-service'
import { mockProductsFixture } from '@/api/mocs/api-shop-mock'
import { PRODUCT_TYPE_ENUM } from '@/utils/constants'

describe('@/domain/services/product-service', () => {
  const TICKET = mockProductsFixture.tickets[0]

  it('isTicket вернет true, если продукт это тикет', () => {
    const product = { type: PRODUCT_TYPE_ENUM.TICKET }
    expect(ProductService.isTicket(product)).toBe(true)
  })

  it('isTicket вернет false, если продукт это не тикет', () => {
    const product = { type: PRODUCT_TYPE_ENUM.OTHER }
    expect(ProductService.isTicket(product)).toBe(false)
  })

  it('getRestrictions возвращает объект ограничений на покупку', () => {
    const ticketRestriction = {
      orderLimitCount: TICKET.orderLimitCount,
      limitCount: TICKET.limitCount,
      sellingCount: TICKET.sellingCount,
    }
    expect(ProductService.getRestrictions(TICKET)).toEqual(ticketRestriction)
  })
})
