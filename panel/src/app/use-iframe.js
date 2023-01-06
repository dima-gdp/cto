const ID_EDITOR_STYLE_EL = 'editor-style'
const PATH_BASE_CSS = '/css/base-landing.css'
const REGULAR_FONT_VAR = '--s-regular-font'
const MEDIUM_FONT_VAR = '--s-medium-font'
const SEMI_BOLD_FONT_VAR = '--s-semi-bold-font'

/**
 * @typedef {{
 *   name: string,
 *   weight: string,
 * }} fontParams
 */

/**
 * Генерирует href для шрифтов
 * @param {fontParams[]} fontsList - iframe contentDocument
 * @returns {string}
 */
function getGoogleFontsHref(fontsList) {
  const params = fontsList.map((font) => `family=${font.name}:wght@${font.weight}`).join('&')
  return `https://fonts.googleapis.com/css2?${params}&display=swap`
}

/**
 * Возвращает список шрифтов
 * @param {CSSStyleDeclaration} computedStyleIframe - computed style iframe
 * @returns {fontParams[]}
 */
function getEventFontsList(computedStyleIframe) {
  return [
    {
      name: computedStyleIframe.getPropertyValue(REGULAR_FONT_VAR).trim(),
      weight: '400',
    },
    {
      name: computedStyleIframe.getPropertyValue(MEDIUM_FONT_VAR).trim(),
      weight: '500',
    },
    {
      name: computedStyleIframe.getPropertyValue(SEMI_BOLD_FONT_VAR).trim(),
      weight: '600',
    },
  ]
}

/**
 * Генерирует href для шрифтов
 * @param {Document} iframeDoc - iframe contentDocument
 * @returns {string}
 */
function getFontsHref(iframeDoc) {
  const computedStyleIframe = getComputedStyle(iframeDoc.documentElement)
  const fontList = getEventFontsList(computedStyleIframe)
  return getGoogleFontsHref(fontList)
}

/**
 * Создает элемент link в iframe для шрифтов
 * @param {Document} iframeDoc - iframe contentDocument
 * @returns {Promise}
 */
async function createFontLinkEl(iframeDoc) {
  return new Promise((resolve) => {
    const fontLinkEl = document.createElement('link')
    fontLinkEl.rel = 'stylesheet'
    fontLinkEl.href = getFontsHref(iframeDoc)
    iframeDoc.head.appendChild(fontLinkEl)
    fontLinkEl.onload = function () {
      resolve()
    }
  })
}

/**
 * Создает элемент style в iframe для стилей эдитора
 * @param {Document} iframeDoc - iframe contentDocument
 */
function createEditorStyleEl(iframeDoc) {
  const editorStyleEl = document.createElement('style')
  editorStyleEl.id = ID_EDITOR_STYLE_EL
  iframeDoc.head.appendChild(editorStyleEl)
}

/**
 * Создает элемент link в iframe для стилей мероприятия
 * @param {Document} iframeDoc - iframe contentDocument
 * @param {string} styleLinkUrl - путь до файла стилей
 * @returns {Promise}
 */
async function createEventStyleLink(iframeDoc, styleLinkUrl) {
  return new Promise((resolve) => {
    const eventStyles = document.createElement('link')
    eventStyles.rel = 'stylesheet'
    eventStyles.href = styleLinkUrl
    iframeDoc.head.appendChild(eventStyles)
    eventStyles.onload = function () {
      resolve()
    }
  })
}

/**
 * Создает элемент link в iframe для базовых стилей
 * @param {Document} iframeDoc - iframe contentDocument
 * @returns {Promise}
 */
async function createBaseStyleEl(iframeDoc) {
  return new Promise((resolve) => {
    const baseStyles = document.createElement('link')
    baseStyles.rel = 'stylesheet'
    baseStyles.href = PATH_BASE_CSS
    iframeDoc.head.appendChild(baseStyles)
    baseStyles.onload = function () {
      resolve()
    }
  })
}

/**
 * Создает элемент style в iframe для базовых стилей
 * @param {HTMLIFrameElement} iframe- iframe
 * @param {string} [styleLinkUrl] - путь до файла стилей
 */
export async function initIframe(iframe, styleLinkUrl) {
  const iframeDoc = iframe.contentDocument
  await createBaseStyleEl(iframeDoc)
  if (styleLinkUrl) {
    await createEventStyleLink(iframeDoc, styleLinkUrl)
    await createFontLinkEl(iframeDoc)
  }
  createEditorStyleEl(iframeDoc)
}

/**
 * Создает элемент style в iframe для базовых стилей
 * @param {HTMLIFrameElement} iframe- iframe
 * @param {string} [styleLinkUrl] - путь до файла стилей
 */
export async function reloadIframe(iframe, styleLinkUrl) {
  return new Promise((resolve) => {
    iframe.contentDocument.location.reload()
    iframe.onload = async function () {
      await initIframe(iframe, styleLinkUrl)
      resolve()
    }
  })
}

/**
 * Обновляет iframe элемент
 * @param {Object} iframeParams
 * @param {HTMLIFrameElement} iframeParams.iframe - iframe
 * @param {string} iframeParams.html - html код
 * @param {string} iframeParams.css - css код
 * @param {string} iframeParams.js - js код
 */
export function updateIframe({ iframe, html, css, js }) {
  const iframeDoc = iframe.contentDocument
  iframeDoc.getElementById(ID_EDITOR_STYLE_EL).innerHTML = css
  iframeDoc.body.innerHTML = html
  try {
    iframe.contentWindow.eval(js)
  } catch (e) {
    console.error(e)
  }
}
