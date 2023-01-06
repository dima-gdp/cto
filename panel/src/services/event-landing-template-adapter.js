import {
  getEventLandingTemplatesList,
  getEventLandingTemplate,
  createEventLandingTemplate,
  updateEventLandingTemplate,
  deleteEventLandingTemplate,
} from '@/api/event-landing-template'

export default function eventLandingTemplateAdapter() {
  /**
   * Получает с бека список шаблонов
   * @param {object} params - query params
   * @returns {Promise<array>}
   */
  async function getTemplates(params) {
    const data = await getEventLandingTemplatesList(params)
    return data
  }

  /**
   * Получает с бека шаблон
   * @param {string | number} id - id шаблона
   * @param {object} [params] - query params
   * @returns {Promise<object>}
   */
  async function getTemplate(id, params) {
    const { data } = await getEventLandingTemplate(id, params)
    return data
  }

  /**
   * Создает шаблон лендинга
   * @param {object} payload - тело запроса
   * @param {object} [params] - query params
   * @returns {Promise<object>}
   */
  async function createTemplate(payload, params) {
    const { data } = await createEventLandingTemplate(payload, params)
    return data
  }

  /**
   * Обновляет шаблон лендинга
   * @param {string | number} id - id
   * @param {object} payload - тело запроса
   * @param {object} [params] - query params
   * @returns {Promise<object>}
   */
  async function updateTemplate(id, payload, params) {
    const { data } = await updateEventLandingTemplate(id, payload, params)
    return data
  }

  /**
   * Удаляет шаблон лендинга
   * @param {string | number} id - id
   * @returns {Promise<object>}
   */
  async function deleteTemplate(id) {
    const data = await deleteEventLandingTemplate(id)
    return data
  }

  return {
    getTemplates,
    getTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  }
}
