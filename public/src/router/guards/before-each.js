import store from '@/store'
import { checkAccessByRoute } from '@/domain/services/page-service'
import AuthService from '@/domain/services/auth-service'

function checkAuth(to, from, next) {
  // Выбрасывает ошибку, если пользователь пытается обратиться к роуту, который
  // недоступен без авторизации - приложение не предусматривает такой возможности -
  // такое возможно только при старте приложения - app-loader проверит локальное
  // хранилище и установит возможность доступа
  const authService = new AuthService()
  const isAuthNeedForRoute = to.meta.auth
  if (isAuthNeedForRoute && !authService.isUserHasActiveSession) {
    console.error('попытка перехода на доступную только с авторизацией страницу!')
    next('/login')
  } else {
    next()
  }
}

function checkAccess(to, from, next) {
  if (store.state.accessRulesIsSet) {
    const isAccess = checkAccessByRoute(to)

    if (!isAccess) {
      console.error('Нет доступа к этой странице!')
      next('/404')
      return
    }
  }
  next()
}

// todo: гуард, который будет редиректать со старых урлов i18n (/, en/)

export default {
  checkAuth,
  checkAccess,
}
