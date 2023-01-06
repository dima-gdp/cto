import router from '@/router'
import i18n from '@/plugins/i18n'
import { addRequestInterceptor, removeRequestInterceptor } from '@/api/interceptor-service'
import createLangInterceptor from '@/api/interceptors/dynamic/create-lang-interceptor'
import createDomainInterceptor from '@/api/interceptors/dynamic/create-domain-interceptor'
import LangService from '@/domain/services/lang-service'
import AuthService from '@/domain/services/auth-service'

export default class AppLoadService {
  static async setDomain(domain) {
    addRequestInterceptor(createDomainInterceptor(domain.id))
    // define lang
    const urlLocale = router.currentRoute.query.lang
    const defaultLanguage = domain?.defaultLanguage
    const availableLanguages = domain?.availableLanguages
    const lang = urlLocale && availableLanguages.includes(urlLocale) ? urlLocale : defaultLanguage
    await AppLoadService.saveLangInApp(lang)
  }

  static async saveLangInApp(lang) {
    if (i18n.locale !== lang) {
      removeRequestInterceptor(createLangInterceptor().name)
    }
    addRequestInterceptor(createLangInterceptor(lang))
    await LangService.saveLangInUrl(lang)
    i18n.locale = lang
    document.querySelector('html').setAttribute('lang', lang)
  }
}
