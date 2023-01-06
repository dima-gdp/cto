import useEvent from '@/domain/composables/use-event'
import useShop from '@/domain/composables/shop/use-shop'
import LogicError from '@/domain/errors/logic-error'

const state = () => ({
  /**
   * @type EventEntity
   */
  data: {},
})

const getters = {
  currentEventId: (state) => state.data?.id,
}

const mutations = {
  SET_EVENT_DATA(state, payload) {
    state.data = payload
  },
}

const actions = {
  async fetchLocaleRelatedEventData({ commit }, { eventId, locale }) {
    const [event, shopId] = await Promise.all([
      useEvent().getEventData(eventId),
      useShop().getShopId(eventId, locale),
    ])

    if (!event.formLink?.formId) {
      throw new LogicError('Не может быть активного мероприятия без формы')
    }

    commit('SET_EVENT_DATA', event)
    commit('shop/SET_SHOP_ID', shopId, { root: true })
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
  namespaced: true,
}
