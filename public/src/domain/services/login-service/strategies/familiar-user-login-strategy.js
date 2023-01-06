import UserLoginStrategy from '@/domain/services/login-service/strategies/user-login-strategy'
import AuthAuthStrategy from '@/domain/services/login-service/strategies/auth-auth-strategy'
import store from '@/store'
import useRegistration from '@/domain/composables/use-registration'
import EventService from '@/domain/services/event-service'
import LangService from '@/domain/services/lang-service'

export class FamiliarUserLoginStrategy extends UserLoginStrategy {
  async execute() {
    const authAndAuth = new AuthAuthStrategy(this.eventData, this.userData)
    await authAndAuth.execute()

    const { isUserHasRegistration } = useRegistration()
    const authGroupId = store.getters['domain/currentAuthGroupId']

    const {
      data: { isRegistrationExist },
      isError: isRegistrationCheckError,
    } = await isUserHasRegistration(this.userData.email, this.eventData.id, authGroupId)

    if (isRegistrationCheckError) {
      throw new Error('Произошла ошибка при проверке регистрации')
    }

    if (!isRegistrationExist) {
      await this._registrationUnavailableGuard()
      await this._toRegistration()
      return
    }

    await this._toStartPage()
  }

  async _toStartPage() {
    const pages = store.state.pages.data
    const startPagePath = EventService.defineStartPagePath(this.eventData, pages)
    await LangService.toLocalePath({ path: startPagePath })
  }

  async _toRegistration() {
    await LangService.toLocalePath({
      path: '/registration',
      query: { email: this.userData.email },
    })
  }
}
