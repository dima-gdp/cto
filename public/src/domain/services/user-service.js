import useUser from '@/domain/composables/use-user'
import store from '@/store'

export default class UserService {
  static async createUser(email, password) {
    const authGroupId = store.getters['domain/currentAuthGroupId']
    const payload = {
      email: email.toLowerCase(),
      password,
      authGroupId,
    }

    const user = await useUser().registerUser(payload)

    return user
  }
}
