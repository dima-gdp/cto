import contentAdapter from '@/services/content-adapter'

export default function useContent() {
  /**
   * Получает список мероприятий для менеджера
   * @param {String} userId
   * @returns {Promise<array>}
   */
  async function getMangerEvents(userId) {
    const params = {
      filter: {
        userId: userId,
        entity: 'event',
        'entity-model.technical-name': {},
      },
      include: 'entityModel.formLink,entityModel.eventOccasion',
      'per-page': 0,
      fields: {
        event: 'id,technical-name,registrationStartedAt,registrationEndedAt,registrationTimeStatus',
        content: 'item,entity-id',
      },
    }

    return await contentAdapter().getContent(params)
  }

  return { getMangerEvents }
}
