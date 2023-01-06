import { getExistingApiInstance } from '@/api'
import LogicError from '@/domain/errors/logic-error'

export default function useAuth() {
  /**
   * Аутентификация по логину и паролю
   * @returns {Promise<{data: {roles: Array, token: string, id: number}, isError: boolean}>}
   */
  async function authenticate(email, password, authGroupId) {
    const api = getExistingApiInstance()

    if (!authGroupId) {
      throw new LogicError('Не найден id группы авторизации')
    }

    const payload = {
      authGroupId,
      email,
      password,
    }

    let isError = false
    let data = {}
    try {
      ;({ data } = await api.user.authenticate(payload))
    } catch (e) {
      isError = true
    }

    return {
      data,
      isError,
    }
  }

  return {
    authenticate,
  }
}
