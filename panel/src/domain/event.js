import { fromISOToString } from '@/libs/util'

export const EVENT_STATUS = {
  during: 'during',
  before: 'before',
  after: 'after',
}

/**
 * Вычисляет url картинки мероприятия
 * @param {object} event
 * @returns string
 */
export function getEventImageUrl(event) {
  const baseUrl = event.entityModel.formLink.logo[0]?.baseUrl
  const path = event.entityModel.formLink.logo[0]?.path
  if (baseUrl && path) {
    return `${baseUrl}${path}`
  }
  return ''
}

/**
 * Преобразует дату
 * @param {String} date
 * @returns {string | null}
 */
export function getEventDate(date) {
  const convertedDate = date ? fromISOToString(date) : null
  return convertedDate
}

/**
 * Получает events(мероприятия), возвращает преобразованный массив uniqueEvents
 * @param {Array} initialEvents
 * @returns array
 */
export function getUniqueEvents(initialEvents) {
  const uniqueEvents = initialEvents.reduce((events, event) => {
    if (events.find((e) => e?.entityId === event?.entityId)) {
      return events
    }

    return [...events, event]
  }, [])

  return uniqueEvents
}

/**
 * Получает events(мероприятия), возвращает events для списка мероприятий
 * @param {Array} events
 * @returns array
 */
export function getConvertedEvents(events) {
  const eventsWithPermissions = getUniqueEvents(events)

  return eventsWithPermissions.map((e) => {
    return {
      eventId: e.entityId,
      event: {
        status: e.entityModel.registrationTimeStatus,
        startedAt: getEventDate(e.entityModel.eventOccasion?.startedAt),
        endedAt: getEventDate(e.entityModel.eventOccasion?.endedAt),
        technicalName: e.entityModel.technicalName,
        imageUrl: getEventImageUrl(e),
      },
      permissions: events.filter((p) => p.entityId === e.entityId).map((p) => p.item),
    }
  })
}
