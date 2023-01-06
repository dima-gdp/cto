import useEvent from '@/domain/composables/use-event'
import { definePath } from '@/domain/services/page-service'
import LogicError from '@/domain/errors/logic-error'
import { compareId } from '@/utils'

const state = () => ({
  /**
   * @type Array<EventPage>
   */
  data: [],
})

const getters = {
  getPageTitleByRoute: (state) => (routePath) => {
    const currentPage = state.data.find((p) => p.path === routePath)
    if (currentPage) {
      return currentPage.title
    }

    throw new LogicError(`Роут ${routePath} не относится к управляемым страницам!`)
  },
  getPagePathById: (state) => (id) => {
    const page = state.data.find((p) => compareId(p.id, id))
    if (page) {
      return page.path
    }
    throw new LogicError(`Не найдена страница с id ${id}`)
  },
}

const mutations = {
  SET_PAGES(state, payload) {
    state.data = payload
  },
}

const actions = {
  /**
   * Передаю eventId, а не беру из стора для большего контроля за потоком данных - иногда нужно
   * грузить state.eventData.id, иногда state.domainData.eventId, иногда вообще child.event.id
   */
  async fetchPages({ commit, rootState }, { eventId }) {
    const userId = rootState.auth.userId
    if (!userId) {
      return
    }

    const rawPages = await useEvent().getEventPages(eventId, userId)

    const pages = rawPages.map((page) => ({
      id: page.id,
      ...page,
      path: definePath(page.type, page.eventId, page.entityId),
    }))

    commit('SET_PAGES', pages)
  },
}

export default {
  state,
  mutations,
  actions,
  getters,
  namespaced: true,
}
