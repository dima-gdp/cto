import { getEvent } from '@/api/event'

export default function eventAdapter() {
  /**
   * Получает с бека id цветовой схемы
   * @param {string | number} id - id мероприятия
   * @returns {Promise<string | number>}
   */
  async function getColorThemeId(id) {
    const { data } = await getEvent(id, { fields: { event: 'colorThemeId' } })
    return data.colorThemeId
  }

  return {
    getColorThemeId,
  }
}
