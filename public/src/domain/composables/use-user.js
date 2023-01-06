import { getExistingApiInstance } from '@/api'

export default function useUser() {
  async function registerUser({ email, password, authGroupId }) {
    const api = getExistingApiInstance()
    const role = 'user'

    const { data: user } = await api.user.registerUser({ email, password, authGroupId, role })

    return user
  }

  async function updateEmail(userId, email) {
    const api = getExistingApiInstance()

    const { data: user } = await api.user.update(userId, { email })

    return user
  }

  async function updatePassword({ userId, password, oldPassword }) {
    const api = getExistingApiInstance()

    const { data: user } = await api.user.update(userId, { password, oldPassword })
  }

  async function validateEmail(userId, eventId) {
    const api = getExistingApiInstance()

    await api.user.emailConfirmRequest({ userId, eventId })
  }

  async function getUser(userId) {
    const api = getExistingApiInstance()
    const { data } = await api.user.getOne(userId)
    return data
  }

  async function isEmailInAuthGroup(email, authGroupId) {
    const api = getExistingApiInstance()
    const payload = {
      email: email.toLowerCase(),
      authGroupId,
    }

    const { meta } = await api.user.isExist(payload)

    return meta?.exist
  }

  return {
    registerUser,
    updateEmail,
    updatePassword,
    validateEmail,
    getUser,
    isEmailInAuthGroup,
  }
}
