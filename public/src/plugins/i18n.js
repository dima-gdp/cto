import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { kebabToCamel, snakeToCamel } from '@/utils'
import iviewEN from '@/assets/vendor/view-design/src/locale/lang/en-US'
import iviewRU from '@/assets/vendor/view-design/src/locale/lang/ru-RU'
import LangService from '@/domain/services/lang-service'
import errorPageLocales from '@/locales/error'

Vue.use(VueI18n)

const localMessages = {
  ru: {
    ...iviewRU,
    error: errorPageLocales.ru,
  },
  en: {
    ...iviewEN,
    error: errorPageLocales.en,
  },
}

const i18n = new VueI18n({
  locale: 'ru',
  fallbackLocale: 'ru',
  messages: localMessages,
})

export const EMPTY_LOCALE_MESSAGE = ' '

export function translateFn(key, ...args) {
  // в таблице i18n все должно быть в camelCase
  const prepKey = kebabToCamel(snakeToCamel(key))

  return i18n.te(`${prepKey}`) ? i18n.t(`${prepKey}`, ...args) : EMPTY_LOCALE_MESSAGE
}

Vue.mixin({
  methods: {
    $tr(key, ...args) {
      return translateFn(key, ...args)
    },

    /**
     * @param route
     * @returns {Promise<void>}
     */
    async $toLocalePath(route) {
      await LangService.toLocalePath(route)
    },

    /**
     * @param route
     * @returns route
     */
    localePath(route) {
      return { ...route, query: { ...route.query, lang: this.$i18n.locale } }
    },
  },
})

export default i18n
