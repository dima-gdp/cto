import EventDateService from '@/domain/services/event-date-service'
import { AbstractMethod } from '@/utils/oop-helpers'
import { translateFn } from '@/plugins/i18n'
import { TIME_STATUSES } from '@/utils'

export default class UserLoginStrategy {
  constructor(event, user) {
    this.userData = user
    this.eventDateServise = new EventDateService(event)
    this.eventData = event
  }
  execute() {
    new AbstractMethod()
  }

  translateI18N(key, ...args) {
    return translateFn(key, ...args)
  }

  async _registrationUnavailableGuard() {
    if (this.eventData.registrationTimeStatus !== TIME_STATUSES.IN_PROGRESS) {
      this._throwUnavailableRegistrationAlert()
    }
  }

  _throwUnavailableRegistrationAlert() {
    const start = this.eventDateServise.startRegistrationTime
    const end = this.eventDateServise.endRegistrationTime

    // регистрация может быть недоступна, если дата начала регистрации не указана,
    // а дата окончания уже наступила
    if (this.eventData.registrationTimeStatus === TIME_STATUSES.ENDED) {
      throw new Error(this.translateI18N('alertTime.error.ended'))
    }
    // регистрация может быть недоступна, если дата окончания регистрации не указана,
    // а дата начала еще не наступила
    if (this.eventData.registrationTimeStatus === TIME_STATUSES.WILL_START) {
      const locale = {
        entity: this.translateI18N('alertTime.error.willStart'),
        months: this.translateI18N('months'),
      }
      const message = EventDateService.getMessageWithOneDate(locale, start)
      throw new Error(message)
    }

    const locale = {
      entity: this.translateI18N('auth.regDateError.text'),
      months: this.translateI18N('months'),
      divider: this.translateI18N('auth.regDateError.divider'),
    }

    const status = EventDateService.getAlertMessageWithDivider(locale, start, end)
    throw new Error(status.message)
  }
}
