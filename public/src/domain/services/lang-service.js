import i18n from '@/plugins/i18n'
import router from '@/router'

export default class LangService {
  static async saveLangInUrl(newLang) {
    const currentLang = router.currentRoute.query.lang

    if (newLang !== currentLang) {
      await router.replace({
        ...router.currentRoute,
        query: { ...router.currentRoute.query, lang: newLang },
      })
    }
  }

  static async toLocalePath(route) {
    await router.push({ ...route, query: { ...route.query, lang: i18n.locale } })
  }
}
