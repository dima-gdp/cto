import UserLoginStrategy from '@/domain/services/login-service/strategies/user-login-strategy'
import LangService from '@/domain/services/lang-service'

export class NewUserLoginStrategy extends UserLoginStrategy {
  async execute() {
    await this._registrationUnavailableGuard()

    await this._toCreateUser()
  }

  async _toCreateUser() {
    await LangService.toLocalePath({ path: '/user', query: { email: this.userData.email } })
  }
}
