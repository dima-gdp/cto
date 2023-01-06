import ShopService from '@/domain/services/shop-service'

const state = () => ({
  shopId: '',
  currencies: [],
  productsInBasket: [],
  completedOrders: [], // todo: хранить созданные в сессии заказы
})

const getters = {
  shopId: (state) => state.shopId,
  isSomeTicketSelected: (state) => {
    return ShopService.isSomeTicketAlreadySelected(state.productsInBasket)
  },
}

const mutations = {
  SET_SHOP_ID(state, payload) {
    state.shopId = payload
  },
  SET_CURRENCIES(state, payload) {
    state.currencies = payload
  },
  UPDATE_AMOUNT_IN_BASKET(state, { orderItem, newAmount }) {
    if (newAmount === 0) {
      state.productsInBasket = ShopService.removeItemFromCard(orderItem, state.productsInBasket)
    } else {
      state.productsInBasket = ShopService.updateAmountInCard(
        orderItem,
        state.productsInBasket,
        newAmount,
      )
    }
  },
  CLEAR_BASKET(state) {
    state.productsInBasket = []
  },
}

export default {
  state,
  getters,
  mutations,
  namespaced: true,
}
