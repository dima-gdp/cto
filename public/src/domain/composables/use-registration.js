import { getExistingApiInstance } from '@/api'
import LogicError from '@/domain/errors/logic-error'

/**
 * Функция используется для работы с анкетой пользователя
 */
export default function useRegistration() {
  async function getFormData(formId) {
    const api = getExistingApiInstance()

    const { data } = await api.form.getOne(formId, {
      include: ['fields.values', 'groups'].join(','),
    })
    return data
  }

  async function isUserHasRegistration(email, eventId, authGroupId) {
    const api = getExistingApiInstance()

    const payload = {
      eventId,
      email,
      authGroupId,
    }
    let isError = false
    let meta

    try {
      ;({ meta } = await api.registration.isExist(payload))
    } catch {
      isError = true
    }

    return { data: { isRegistrationExist: meta?.exist }, isError }
  }

  async function getFieldValues(userId, eventId) {
    const params = {
      include: ['fields.field'].join(','),
      filter: {
        userId,
        eventId,
      },
      sort: 'id',
      'per-page': 1,
      fields: {
        registration: ['id'].join(','),
      },
    }

    const { data } = await getExistingApiInstance().registration.getMany(params)

    const [registrationData] = data

    return registrationData?.fields
  }

  async function getUserTicket(userId, eventId) {
    const params = {
      filter: {
        userId,
        eventId,
      },
      sort: 'id',
      'per-page': 1,
      fields: {
        registration: ['ticketNumber'].join(','),
      },
    }

    const { data } = await getExistingApiInstance().registration.getMany(params)

    const [worksheets] = data

    const ticketNumber = worksheets.ticketNumber

    return ticketNumber
  }

  async function getRegistrationsByUser(eventIds, userId) {
    const api = getExistingApiInstance()
    const params = {
      filter: {
        userId,
        eventId: eventIds,
      },
      perPage: 0,
    }

    const { data } = await api.registration.getMany(params)

    return data
  }

  async function quickRegistration(eventId, fromEventId) {
    if (fromEventId === eventId) {
      throw new LogicError('Попытка быстрой регистрации на евент-кабинет')
    }

    const api = getExistingApiInstance()

    const data = { fromEventId, eventId }

    await api.registration.quickRegistration(data)
  }

  return {
    getFormData,
    getFieldValues,
    getUserTicket,
    getRegistrationsByUser,
    quickRegistration,
    isUserHasRegistration,
  }
}
