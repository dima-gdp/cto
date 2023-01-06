import { EMAIL_REGEX } from '@/utils/constants'
import { FamiliarUserLoginStrategy } from '@/domain/services/login-service/strategies/familiar-user-login-strategy'
import { NewUserLoginStrategy } from '@/domain/services/login-service/strategies/new-user-login-strategy'

import LogicError from '@/domain/errors/logic-error'

export default class LoginService {
  static USER_STRATEGY_NAMES = {
    UNREGISTERED: 'unregistered',
    FAMILIAR: 'familiar',
  }

  static USER_STRATEGIES = {
    UNREGISTERED: NewUserLoginStrategy,
    FAMILIAR: FamiliarUserLoginStrategy,
  }

  static validateEmail(str) {
    return EMAIL_REGEX.test(str)
  }

  static validatePassword(str) {
    return str.length >= 6
  }

  static async executeStrategy(strategyName, event, user) {
    let strategy = {
      execute: async () => {
        throw new LogicError('Неверное имя стратегии')
      },
    }

    if (strategyName === this.USER_STRATEGY_NAMES.UNREGISTERED) {
      strategy = new this.USER_STRATEGIES.UNREGISTERED(event, user)
    } else if (strategyName === this.USER_STRATEGY_NAMES.FAMILIAR) {
      strategy = new this.USER_STRATEGIES.FAMILIAR(event, user)
    }

    await strategy.execute()
  }
}
