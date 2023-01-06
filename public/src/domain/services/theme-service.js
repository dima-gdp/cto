import LogicError from '@/domain/errors/logic-error'
import store from '@/store'
import { getExistingApiInstance } from '@/api'

const BASE_URL = getExistingApiInstance().base.baseURL

const VARS_ELEMENT_ID = 'theme-vars'
const FONT_ELEMENT_ID = 'theme-font'
const LANDING_SCRIPT_ID = 'landing-script'
const LANDING_CSS_ID = 'landing-css'
const LANDING_FILE_PATH = '/events/event-landing-file'

export default class ThemeService {
  static async setTheme(colorThemeId) {
    if (!colorThemeId) throw new LogicError('Не найдено цветовой темы, связанной с евентом')

    const styleEl = this._createLinkElement(
      `${BASE_URL}/styles/css?id=${colorThemeId}${ThemeService._getTimestampParam()}`,
      VARS_ELEMENT_ID,
    )

    store.commit('SET_THEME_IS_SETTING', true)
    await this._mountElementToHead(styleEl, this._onThemeLoad.bind(this)).finally(() => {
      store.commit('SET_THEME_IS_SETTING', false)
    })
  }

  static _getTimestampParam() {
    return `&${new Date().getTime()}`
  }

  static async _onThemeLoad() {
    const fontString = this._getGoogleFontString()
    const fontsEl = this._createLinkElement(fontString, FONT_ELEMENT_ID)
    await this._mountElementToHead(fontsEl, () => {
      console.info('Файлы сторонних шрифтов загружены')
    })
  }

  static _getGoogleFontString() {
    const computedStyle = getComputedStyle(document.documentElement)
    class Font {
      name
      weight
      constructor(variableName) {
        this.name = computedStyle.getPropertyValue(variableName).trim()
      }

      getStringParamForGoogle() {
        return `family=${this.name}:wght@${this.weight}`
      }
    }

    class RegularFont extends Font {
      weight = 400
      constructor() {
        super('--s-regular-font')
      }
    }

    class MediumFont extends Font {
      weight = 500
      constructor() {
        super('--s-medium-font')
      }
    }

    class SemiBoldFont extends Font {
      weight = 600
      constructor() {
        super('--s-semi-bold-font')
      }
    }

    const fonts = [new RegularFont(), new MediumFont(), new SemiBoldFont()]

    const fontParamsString = fonts.map((m) => m.getStringParamForGoogle()).join('&')
    return `https://fonts.googleapis.com/css2?${fontParamsString}&display=swap`
  }

  static _createLinkElement(href, elementId, rel = 'stylesheet') {
    document.getElementById(elementId)?.remove()

    const el = document.createElement('link')
    el.setAttribute('rel', rel)
    el.setAttribute('href', href)
    el.setAttribute('id', elementId)

    return el
  }

  static _createScriptElement(src, elementId) {
    document.getElementById(elementId)?.remove()

    const el = document.createElement('script')
    el.setAttribute('src', src)
    el.setAttribute('type', 'text/javascript')

    return el
  }

  static _mountElementToHead(el, onLoad) {
    return new Promise((resolve, reject) => {
      try {
        el.addEventListener('load', async (e) => {
          if (onLoad) await onLoad(e)
          resolve('loaded')
        })
        document.head.appendChild(el)
      } catch (e) {
        reject(e)
      }
    })
  }

  static _mountElementToBody(el, onLoad) {
    return new Promise((resolve, reject) => {
      try {
        el.addEventListener('load', async (e) => {
          if (onLoad) await onLoad(e)
          resolve('loaded')
        })
        document.body.appendChild(el)
      } catch (e) {
        reject(e)
      }
    })
  }

  static async loadLandingResources({ id, js }) {
    try {
      const landingStyleEl = ThemeService._createLinkElement(
        `${BASE_URL}${LANDING_FILE_PATH}?id=${id}&type=css${ThemeService._getTimestampParam()}`,
        LANDING_CSS_ID,
      )
      await this._mountElementToHead(landingStyleEl)

      if (js) {
        const landingScriptEl = ThemeService._createScriptElement(
          `${BASE_URL}${LANDING_FILE_PATH}?id=${id}&type=js${ThemeService._getTimestampParam()}`,
          LANDING_SCRIPT_ID,
        )
        await this._mountElementToBody(landingScriptEl)
      }
    } catch (e) {
      console.error(e)
    }
  }
}
