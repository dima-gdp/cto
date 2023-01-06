/**
 * @typedef {{
 *   html: string,
 *   css: string,
 *   js: string,
 * }} landingCode
 */

/**
 * @typedef {{
 *   [body]: string,
 *   [css]: string,
 *   [js]: string,
 *   name: string,
 *   [description]: string,
 * }} eventLandingTemplate
 */

/**
 * Приводит объект к сущности event-landing-template
 * @param {eventLandingTemplate} attrs - атрибуты сущности
 * @param {landingCode} code - код из редактора
 * @returns {object}
 */
export function getLandingTemplate(attrs, code) {
  return { ...attrs, body: code.html, css: code.css, js: code.js }
}

/**
 * Создает объект с кодом для редактора из сущности event-landing-template
 * @param {eventLandingTemplate} template - event-landing-template
 * @returns {landingCode}
 */
export function getCodeFromTemplate(template) {
  return { html: template.body, css: template.css, js: template.js }
}
