import routes from '@/router/routes'
import ability from '@/domain/ability'
import LogicError from '@/domain/errors/logic-error'
import { PAGE_TYPES_ENUM } from '@/utils/constants'

/**
 * @typedef EventPagePath
 * @property {string} path
 */

/**
 * @typedef { EventPageEntity & EventPagePath } EventPage
 */

export function checkAccessByRoute(route) {
  const alwaysAccessRouteNames = routes
    .filter((r) => !r.meta?.hasEventPage) // управляем правами только роутами с event_page
    .map((r) => r.name)

  if (alwaysAccessRouteNames.includes(route.name)) {
    return true
  }

  return ability.can('access', `page-path:${route.path}`)
}

export function getPageTitle(routePath, eventPageList) {
  if (!eventPageList.length) {
    throw new LogicError('Управляемые страницы еще не загружены!')
  }

  const currentPage = eventPageList.find((p) => p.path === routePath)

  if (currentPage) {
    return currentPage.menuItem.caption
  } else {
    throw new LogicError(`Роут ${routePath} не относится к управляемым страницам!`)
  }
}

/**
 * @param eventPageType
 * @param eventId
 * @param entityId
 * @return {string}
 */
export function definePath(eventPageType, eventId, entityId) {
  switch (eventPageType) {
    case PAGE_TYPES_ENUM.USER_PROFILE:
      return `/event/${eventId}/profile`
    case PAGE_TYPES_ENUM.STORE:
      return `/event/${eventId}/store`
    case PAGE_TYPES_ENUM.USER_ORDERS:
      return `/event/${eventId}/orders`
    case PAGE_TYPES_ENUM.EVENT_LIST:
      return `/events`
    case PAGE_TYPES_ENUM.REQUEST:
      return `/event/${eventId}/request/${entityId}`
    case PAGE_TYPES_ENUM.STATIC_PAGE:
      return `/event/${eventId}/static-pages/${entityId}`
    case PAGE_TYPES_ENUM.STREAM:
      return `/event/${eventId}/stream/${entityId}`
    case PAGE_TYPES_ENUM.DOCUMENT:
      return `/event/${eventId}/documents/${entityId}`
    default:
      throw new LogicError(`Неизвестный тип страницы: ${pageType}`)
  }
}

/**
 * @param {EventPage[]} pages
 */
export function addPagesToRules(pages) {
  ability.update([])
  const rules = []

  pages.forEach((page) => {
    const path = page.path
    rules.push({
      action: 'access',
      subject: `page-path:${path}`,
    })
  })

  ability.update(rules)
}

/**
 * @param {EventPage[]} pages
 * @returns EventPage
 */
export function getStartedPage(pages) {
  return pages.find((p) => p.isStarted)
}
