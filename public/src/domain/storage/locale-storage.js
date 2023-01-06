import { SyncStorage } from '@/domain/storage/index'
import LogicError from '@/domain/errors/logic-error'

const PREFIX = 'auth_'

export default class LocaleStorage extends SyncStorage {
  static isAvailableGuard() {
    if (!localStorage) {
      throw new LogicError('Нет доступа к localStorage!')
    }
  }

  setItem(key, value) {
    LocaleStorage.isAvailableGuard()
    localStorage.setItem(PREFIX + key, value)
  }

  /**
   *
   * @param key
   * @returns {string}
   */
  getItem(key) {
    LocaleStorage.isAvailableGuard()
    return localStorage.getItem(PREFIX + key)
  }

  deleteItem(key) {
    LocaleStorage.isAvailableGuard()
    localStorage.removeItem(PREFIX + key)
  }
}
