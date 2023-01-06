import { getEventLandingsList, updateEventLanding, createEventLanding } from '@/api/event-landing'

export default function eventLandingAdapter() {
  /**
   * Получает с бека список лендингов
   * @param {object} params - query params
   * @returns {Promise<array>}
   */
  async function getEventLandings(params) {
    const { data } = await getEventLandingsList(params)
    return data
  }

  /**
   * Обновляет лендинг
   * @param {object} id - id лендинга
   * @param {object} payload - тело запроса
   * @param {object} [params] - query params
   * @returns {Promise<object>}
   */
  async function updateLanding(id, payload, params) {
    const { data } = await updateEventLanding(id, payload, params)
    return data
  }

  /**
   * Создает лендинг
   * @param {object} payload - тело запроса
   * @param {object} [params] - query params
   * @returns {Promise<object>}
   */
  async function createLanding(payload, params) {
    const { data } = await createEventLanding(payload, params)
    return data
  }

  return {
    getEventLandings,
    updateLanding,
    createLanding,
  }
}
