import { EVENT_TYPE_NAMES } from '@/utils/constants'
import LogicError from '@/domain/errors/logic-error'
import { checkAccessByRoute, getStartedPage } from '@/domain/services/page-service'
import routes from '@/router/routes'

export default class EventService {
  static typeGuard(event) {
    if (!Object.values(EVENT_TYPE_NAMES).includes(event.type)) {
      throw new LogicError('Неизвестный тип евента')
    }
  }

  static isEventOccasion(event) {
    EventService.typeGuard(event)

    return event.type === EVENT_TYPE_NAMES.OCCASION
  }

  static isEventCabinet(event) {
    EventService.typeGuard(event)

    return event.type === EVENT_TYPE_NAMES.CABINET
  }

  /**
   * @param event
   * @param {EventPage[]} pages
   */
  static defineStartPagePath(event, pages) {
    const startPage = getStartedPage(pages)
    if (startPage) {
      return startPage.path
    }

    if (EventService.isEventCabinet(event)) {
      const eventsRoute = routes.find((r) => r.path === '/events')
      if (checkAccessByRoute(eventsRoute)) {
        return `/events`
      }
    }
    return `/event/${event.id}/profile`
  }

  /**
   *
   * @param {EventEntity} event
   * @return {string}
   */
  static extractLogoUrl(event) {
    // formLink.logo это массив из одного элемента 💩
    if (!event.formLink) {
      return ''
    }
    const [logo] = event.formLink.logo
    if (logo) {
      const { baseUrl, path } = logo
      return baseUrl && path ? baseUrl + path : ''
    } else {
      return ''
    }
  }
}
