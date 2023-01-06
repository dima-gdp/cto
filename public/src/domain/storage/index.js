import { AbstractMethod } from '@/utils/oop-helpers'

export class GlobalStorage {
  setItem(key, value) {
    new AbstractMethod()
  }

  /**
   *
   * @param key
   * @returns any
   */
  getItem(key) {
    new AbstractMethod()
  }

  deleteItem(key) {
    new AbstractMethod()
  }
}

export class SyncStorage extends GlobalStorage {}

export class AsyncStorage extends GlobalStorage {
  async setItem(key, value) {
    new AbstractMethod()
  }

  /**
   *
   * @param key
   * @returns {Promise<string>}
   */
  async getItem(key) {
    new AbstractMethod()
  }
}
