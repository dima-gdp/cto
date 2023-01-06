import EventService from '@/domain/services/event-service'
import { DateTime } from '@/plugins/luxon'
import { monthToStr, formatDate, TIME_STATUSES } from '@/utils'

const MIN_DATE = DateTime.fromSeconds(0)
const MAX_DATE = DateTime.fromSeconds(2177280000) // 2038 12 30

export default class EventDateService {
  static MIN_DATE = MIN_DATE
  static MAX_DATE = MAX_DATE
  constructor(event) {
    this._event = event
  }

  getData() {
    return this._event
  }

  /**
   * @returns {DateTime}
   */
  get startRegistrationTime() {
    return EventDateService.getMinDate(this._event.registrationStartedAt)
  }

  /**
   * @returns {DateTime}
   */
  get endRegistrationTime() {
    return EventDateService.getMaxDate(this._event.registrationEndedAt)
  }

  /**
   * @returns {DateTime}
   */
  get startEventTime() {
    if (!EventService.isEventOccasion(this._event)) {
      return EventDateService.MIN_DATE
    }
    return EventDateService.getMinDate(this._event.eventOccasion.startedAt)
  }

  /**
   * @returns {DateTime}
   */
  get endEventTime() {
    if (!EventService.isEventOccasion(this._event)) {
      return EventDateService.MAX_DATE
    }
    return EventDateService.getMaxDate(this._event.eventOccasion.endedAt)
  }

  static getMinDate(dateStr) {
    const date = DateTime.fromISO(dateStr)
    if (date.invalid) {
      return EventDateService.MIN_DATE
    }
    return date
  }

  static getMaxDate(dateStr) {
    const date = DateTime.fromISO(dateStr)
    if (date.invalid) {
      return EventDateService.MAX_DATE
    }
    return date
  }

  /**
   * функция возвращает две даты через символ, отправленный в поле "locale.divider" - по умолчанию черточка:
   * @param locale
   * @param start
   * @param end
   */
  static getAlertMessageWithDivider(locale, start, end) {
    if (!start instanceof DateTime || !end instanceof DateTime) {
      throw new Error('Неверный тип даты, передаваемый в функцию getEntityStatus!')
    }

    const { entity = '', months = [], divider = '-' } = locale

    const formatDateWithDivider = (start, end) => {
      const { year: startYear, month: startMonth, day: startDay } = start
      const { year: endYear, month: endMonth, day: endDay } = end

      // отбрасываем одинаковые года и месяцы
      if (endDay === startDay && startMonth === endMonth && startYear === endYear) {
        return `${startDay} ${monthToStr(startMonth, months)} ${startYear}`
      } else if (startMonth === +endMonth && startYear === endYear) {
        return `${startDay} ${divider} ${endDay} ${monthToStr(startMonth, months)} ${startYear}`
      } else if (startYear === endYear) {
        return `${startDay} ${monthToStr(startMonth, months)} ${divider} ${endDay} ${monthToStr(
          endMonth,
          months,
        )} ${startYear}`
      }
      return `${startDay} ${monthToStr(
        startMonth,
        months,
      )} ${startYear} ${divider} ${endDay} ${monthToStr(endMonth, months)} ${endYear}`
    }

    return {
      message: `${entity} ${formatDateWithDivider(start, end)}`,
      state: `info`,
    }
  }

  static getMessageWithOneDate(locale, date) {
    if (!locale.entity) {
      return formatDate(date, locale.months)
    }
    return `${locale.entity} ${formatDate(date, locale.months)}`
  }

  static getEntityStatusAlert = (locale, start, end, status) => {
    if (!start instanceof DateTime || !end instanceof DateTime) {
      throw new Error('Неверный тип даты, передаваемый в функцию getEntityStatus!')
    }

    const {
      entity = '',
      before = '',
      during = '',
      after = '',
      months = [''],
      onGoing = '',
    } = locale

    if (status === TIME_STATUSES.ENDED) {
      return {
        message: `${entity} ${after} ${formatDate(end, months)}`,
        state: 'after',
      }
    }

    if (status === TIME_STATUSES.WILL_START) {
      return {
        message: `${entity} ${before} ${formatDate(start, months)}`,
        state: 'before',
      }
    }

    if (end === EventDateService.MAX_DATE) {
      // "Регистрация идет" (без даты)
      return {
        message: `${entity} ${onGoing}`,
        state: 'during',
      }
    }

    return {
      message: `${entity} ${during} ${formatDate(end, months)}`,
      state: 'during',
    }
  }
}
