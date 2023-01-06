import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { localRead } from '@/libs/util'
import customRuRu from './lang/ru-RU'
import customEnUs from './lang/en-US'
import enUsLocale from 'iview/src/locale/lang/en-US'
import ruRuLocale from 'iview/src/locale/lang/ru-RU'

Vue.use(VueI18n)

const navLang = navigator.language

const localLang = navLang === 'ru-RU' || navLang === 'en-US' ? navLang : false
const lang = localRead('local') || localLang || 'ru-RU'

Vue.config.lang = lang

Vue.locale = () => {}
const messages = {
  'en-US': Object.assign(enUsLocale, customEnUs),
  'ru-RU': Object.assign(ruRuLocale, customRuRu),
}
const i18n = new VueI18n({
  locale: lang,
  messages,
})

export default i18n
