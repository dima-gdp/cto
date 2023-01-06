import UserLoginStrategy from '@/domain/services/login-service/strategies/user-login-strategy'
import useAuth from '@/domain/composables/use-auth'
import store from '@/store'
import AuthService from '@/domain/services/auth-service'
import { GtmPlugin } from '@gtm-support/vue2-gtm'
import gtmOptions from '@/plugins/gtm'

/**
 * authenticate then authorize
 */
export default class AuthAuthStrategy extends UserLoginStrategy {
  constructor(event, user) {
    super(event, user)
    this.gtm = new GtmPlugin(gtmOptions)
  }

  async execute() {
    const { authenticate } = useAuth()

    const { data, isError: isLoginError } = await authenticate(
      this.userData.email,
      this.userData.password,
      store.getters['domain/currentAuthGroupId'],
    )

    if (isLoginError) {
      throw new Error(this.translateI18N('auth.authError'))
    }

    this.gtm.trackEvent({ event: 'event-auth' })

    const authService = new AuthService()
    await authService.setAuthData(data.token, data.id)
  }
}
