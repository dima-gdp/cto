import { getExistingApiInstance } from '@/api'
import LogicError from '@/domain/errors/logic-error'
import { compareId } from '@/utils'
import { sort } from 'rambda'

/**
 * @typedef EventEntity
 *  @property active
 *  @property availableLanguages
 *  @property colorThemeId
 *  @property createdAt
 *  @property defaultLanguage
 *  @property dependencies
 *  @property displayName
 *  @property email
 *  @property eventCabinet
 *  @property formLink
 *  @property id
 *  @property legalEntityId
 *  @property location
 *  @property meta
 *  @property notifyEmail
 *  @property phone
 *  @property registrationEndedAt
 *  @property registrationStartedAt
 *  @property registrationTimeStatus
 *  @property technicalName
 *  @property type
 *  @property updatedAt
 */

/**
 *  @typedef EventPageEntity
 *  @property {number} id
 *  @property {number} eventId
 *  @property {string} type
 *  @property entityId
 *  @property title
 *  @property active
 *  @property limitedAccess
 *  @property accessCount
 *  @property isStarted
 *  @property lang
 *
 *  @mixin
 */

export default function useEvent() {
  /**
   * @param eventId
   * @return {Promise<EventEntity>}
   */
  async function getEventData(eventId) {
    const api = getExistingApiInstance()
    if (!eventId) throw new LogicError('Не передан параметр id')

    const { data } = await api.event.getOne(eventId, {
      include: ['form-link', 'event-cabinet', 'event-occasion'].join(','),
    })

    return data
  }

  /**
   * Получает меню пользователя
   * @param eventId
   * @param userId
   * @returns {Promise<*>}
   */

  /**
   *
   * @param eventId
   * @param userId
   * @return {Promise<EventPageEntity[]>}
   */
  async function getEventPages(eventId, userId) {
    const api = getExistingApiInstance()

    const {
      data: { pages },
    } = await api.user.getUserMenu(userId, {
      eventId,
      include: ['pages'].join(','),
    })

    if (!pages) {
      throw new LogicError('Не найдены страницы!')
    }

    return pages
  }

  async function isEventHasChildren(eventId) {
    const api = getExistingApiInstance()
    const { data } = await api.eventToEvent.getMany({
      filter: {
        parentId: eventId,
        'child.active': true,
      },
      fields: {
        eventToEvent: ['id', 'parentId'].join(','), // todo: ключ не работает в camelCase
        event: ['active'].join(','),
      },
    })

    return data.length
  }

  async function getChildrenForCabinet(eventId, lang) {
    const api = getExistingApiInstance()
    const { data: eventToEventList } = await api.eventToEvent.getMany({
      filter: {
        parentId: eventId,
      },
      perPage: 0,
      // include: ['child'].join(','), todo: туда не пробрасывается event-occasion (а там даты евента)
    })

    const eventIds = eventToEventList.map((e2e) => e2e.childId)
    if (!eventIds.length) {
      return []
    }

    const { data: eventList } = await api.event.getMany({
      filter: {
        id: eventIds.join(','),
        active: true,
      },
      perPage: 0,
      // todo: форма ради лого. Почему лого в формлинке?
      include: ['event-cabinet', 'event-occasion', 'form-link'].join(','),
    })

    const eventLinksWithEventData = eventToEventList
      .map((eventToEvent) => {
        const eventData = eventList.find((e) => +e.id === +eventToEvent.childId)
        return {
          ...eventToEvent,
          child: eventData,
        }
      })
      .filter((e2e) => e2e.child?.availableLanguages.includes(lang))

    return eventLinksWithEventData
  }

  async function getEventMenu(eventId, userId) {
    const api = getExistingApiInstance()

    const {
      data: { menuItems },
    } = await api.user.getUserMenu(userId, {
      eventId,
      include: ['menuItems'].join(','),
    })

    if (!menuItems) {
      throw new LogicError('Не найдены пункты меню!')
    }

    const orderBySort = (arr) => sort((a, b) => b.sort - a.sort, arr)

    const parents = orderBySort(menuItems.filter((menuItem) => menuItem.parentId === null))

    const allChildren = menuItems.filter((menuItem) => menuItem.parentId)

    const result = parents.map((parent) => {
      const children = orderBySort(
        allChildren.filter((child) => compareId(child.parentId, parent.id)),
      )
      return {
        ...parent,
        children,
      }
    })

    return result
  }

  return {
    getEventMenu,
    getEventData,
    getEventPages,
    getChildrenForCabinet,
    isEventHasChildren,
  }
}
