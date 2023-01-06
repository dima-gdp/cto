import ShopService from '@/domain/services/shop-service'
import shopStore from '@/store/modules/shop.js'
import { mockCurrenciesFixture } from '@/api/mocs/api-shop-mock'

describe('@/src/store/modules/shop.js', () => {
  let state

  const createState = (productsInBasket = []) => {
    state = {
      shopId: '',
      currencies: [],
      productsInBasket,
    }
  }

  it('SET_SHOP_ID записывает в state.shopId id', () => {
    createState()
    const SHOP_ID = 1
    shopStore.mutations.SET_SHOP_ID(state, SHOP_ID)

    expect(state.shopId).toBe(1)
  })

  it('SET_CURRENCIES записывает в state.currencies валюту', () => {
    createState()
    shopStore.mutations.SET_CURRENCIES(state, mockCurrenciesFixture)

    expect(state.currencies).toBe(mockCurrenciesFixture)
  })

  it('SET_CURRENCIES записывает в state.currencies валюту', () => {
    createState()
    shopStore.mutations.SET_CURRENCIES(state, mockCurrenciesFixture)

    expect(state.currencies).toBe(mockCurrenciesFixture)
  })

  it('CLEAR_BASKET записывает в state.productsInBasket пустой массив', () => {
    createState(['FirstProduct', 'SecondProduct'])
    shopStore.mutations.CLEAR_BASKET(state)

    expect(state.productsInBasket).toEqual([])
  })

  it('Если количество товара, переданного в UPDATE_AMOUNT_IN_BASKET равно 0, то то записывает в state.productsInBasket: ShopService.removeItemFromCard', () => {
    const PRODUCTS_IN_BASKET_BEFORE_UPDATE = ['FirstProduct', 'SecondProduct']
    const PRODUCTS_IN_BASKET_AFTER_UPDATE = ['FirstProduct']
    const ORDER_ITEM = 'orderItem'
    const spyRemoveItemFromCard = jest
      .spyOn(ShopService, 'removeItemFromCard')
      .mockReturnValue(PRODUCTS_IN_BASKET_AFTER_UPDATE)

    createState(PRODUCTS_IN_BASKET_BEFORE_UPDATE)
    shopStore.mutations.UPDATE_AMOUNT_IN_BASKET(state, { orderItem: ORDER_ITEM, newAmount: 0 })

    expect(spyRemoveItemFromCard).toHaveBeenCalledWith(ORDER_ITEM, PRODUCTS_IN_BASKET_BEFORE_UPDATE)
    expect(state.productsInBasket).toEqual(PRODUCTS_IN_BASKET_AFTER_UPDATE)
    spyRemoveItemFromCard.mockRestore()
  })

  it('Если количество товара, переданного в UPDATE_AMOUNT_IN_BASKET не равно 0, то записывает в state.productsInBasket: ShopService.updateAmountInCard', () => {
    const PRODUCTS_IN_BASKET_BEFORE_UPDATE = ['FirstProduct']
    const PRODUCTS_IN_BASKET_AFTER_UPDATE = ['FirstProduct', 'SecondProduct']
    const ORDER_ITEM = 'orderItem'
    const NEW_AMOUNT = 1
    const spyUpdateAmountItCard = jest
      .spyOn(ShopService, 'updateAmountInCard')
      .mockReturnValue(PRODUCTS_IN_BASKET_AFTER_UPDATE)

    createState(PRODUCTS_IN_BASKET_BEFORE_UPDATE)
    shopStore.mutations.UPDATE_AMOUNT_IN_BASKET(state, {
      orderItem: ORDER_ITEM,
      newAmount: NEW_AMOUNT,
    })

    expect(spyUpdateAmountItCard).toHaveBeenCalledWith(
      ORDER_ITEM,
      PRODUCTS_IN_BASKET_BEFORE_UPDATE,
      NEW_AMOUNT,
    )
    expect(state.productsInBasket).toEqual(PRODUCTS_IN_BASKET_AFTER_UPDATE)
    spyUpdateAmountItCard.mockRestore()
  })

  it('getter shopId возвращает state.shopId', () => {
    createState()
    expect(shopStore.getters.shopId(state)).toBe(state.shopId)
  })

  it('getter isSomeTicketSelected возвращает результат ShopService.isSomeTicketAlreadySelected', () => {
    const isSomeTicketAlreadySelectedFixture = false
    const spyIsSomeTicketSelected = jest
      .spyOn(ShopService, 'isSomeTicketAlreadySelected')
      .mockReturnValue(isSomeTicketAlreadySelectedFixture)
    createState()
    const isSomeTicketSelected = shopStore.getters.isSomeTicketSelected(state)

    expect(spyIsSomeTicketSelected).toHaveBeenCalledWith(state.productsInBasket)
    expect(isSomeTicketSelected).toBe(isSomeTicketAlreadySelectedFixture)
    spyIsSomeTicketSelected.mockRestore()
  })
})
