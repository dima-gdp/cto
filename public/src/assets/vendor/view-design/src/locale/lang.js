// using with vue-i18n in CDN
/*eslint-disable */
import Vue from 'vue'

export default function (lang) {
  if (process.client) {
    if (typeof window.iview !== 'undefined') {
      if (!('langs' in iview)) {
        iview.langs = {}
      }
      iview.langs[lang.i.locale] = lang
    }
  }
}
/*eslint-enable */
