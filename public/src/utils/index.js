import { DateTime } from '@/plugins/luxon'
import InfrastructureError from '@/domain/errors/infrastructure-error'

import { pipe } from 'rambda'
import { DEFAULT_DATE_FORMAT, TIME_STATUSES as TRUE_TIME_STATUSES } from '@/utils/constants'

export const kebabToCamel = (str) => str.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
export const snakeToCamel = (str) => str.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
export const camelToKebab = (str) => str.replace(/([A-Z])/g, (g) => `-${g.toLowerCase()}`)
export const snakeToKebab = (str) => str.replace(/_/g, '-')

const KEY_CASES_NAMES = Object.freeze({
  KEBAB: 'kebab-case',
  SNAKE: 'snake_case',
  CAMEL: 'camelCase',
})

export function camelize(entry) {
  const formatFn = generateFormatFunction(KEY_CASES_NAMES.CAMEL)

  return formatKeys(formatFn, entry)
}

export function kebalize(entry) {
  const formatFn = generateFormatFunction(KEY_CASES_NAMES.KEBAB)

  return formatKeys(formatFn, entry)
}

export function parseCookie(cookieStr) {
  if (!cookieStr) {
    return undefined
  }

  return cookieStr
    .split(';')
    .filter((v) => v)
    .map((v) => v.split('='))
    .reduce((acc, [key, value]) => {
      acc[decodeURIComponent(key.trim())] = decodeURIComponent(value.trim())
      return acc
    }, {})
}

export function isComplexType(something) {
  const strView = Object.prototype.toString.call(something)
  return ['[object Object]', '[object Array]'].includes(strView)
}

/* Не публичные функции */

function formatKeys(formatFn, entry) {
  if (Array.isArray(entry)) {
    return entry.map((e) => formatKeys(formatFn, e))
  }
  if (!isComplexType(entry)) {
    return entry
  }
  return Object.entries(entry).reduce((accum, [key, value]) => {
    accum[formatFn(key)] = isComplexType(value) ? formatKeys(formatFn, value) : value
    return accum
  }, {})
}

function generateFormatFunction(formatName) {
  if (formatName === KEY_CASES_NAMES.CAMEL) {
    return pipe(kebabToCamel, snakeToCamel)
  } else if (formatName === KEY_CASES_NAMES.KEBAB) {
    return pipe(camelToKebab, snakeToKebab)
  } else {
    throw new InfrastructureError(`Неизвестный формат ключей: ${formatName}`)
  }
}

// todo: использовать TIME_STATUSES из constants
/**
 * @deprecated переходить на TRUE_TIME_STATUSES из constants
 * @type {Readonly<{IN_PROGRESS: string, WILL_START: string, ENDED: string}>}
 */
export const TIME_STATUSES = TRUE_TIME_STATUSES

/**
 * @param maskedString
 * @param format
 * @return {string}
 */
export function fromStringToISO(maskedString, format = DEFAULT_DATE_FORMAT) {
  return DateTime.fromFormat(maskedString, format).toISO({
    suppressMilliseconds: true,
  })
}

/**
 * @param iso
 * @param format
 * @return {string}
 */
export function fromISOToString(iso, format = DEFAULT_DATE_FORMAT) {
  return DateTime.fromISO(iso).toFormat(format)
}

/**
 * возвращает название месяца в нужном формате
 * @param {number} num Номер месяца (с единицы)
 * @param {array<string>} months Массив с названиями месяцев в нужной форме
 * @returns {string}
 */
export const monthToStr = (num, months) => {
  return months[+num - 1] || ''
}

/**
 * @deprecated перейти на локализацию из Luxon (toLocaleString)
 * @param d
 * @param months
 * @return {`${*} ${string} ${*}`}
 */
export const formatDate = (d, months) => {
  const { month: m } = d
  const [day, year] = d.toFormat(`dd yyyy`).split(' ')
  return `${day} ${monthToStr(m, months)} ${year}`
}

/**
 * @deprecated - переходим на iso формат аля event-date-service
 * @param locale
 * @param dateStart
 * @param dateEnd
 * @returns {{state: string, message: string}}
 */
export const getEntityStatus = (locale, dateStart, dateEnd, status) => {
  const start = DateTime.fromISO(dateStart)
  const end = DateTime.fromISO(dateEnd)

  const { entity = '', before = '', during = '', after = '', months = [''] } = locale

  if (status === TIME_STATUSES.ENDED) {
    return {
      message: `${entity} ${after} ${formatDate(start, months)}`,
      state: 'after',
    }
  }

  if (status === TIME_STATUSES.WILL_START) {
    return {
      message: `${entity} ${before} ${fromISOToString(dateStart)}`,
      state: 'before',
    }
  }

  return {
    message: `${entity} ${during} ${formatDate(end, months)}`,
    state: 'during',
  }
}

export function pluck(object, path) {
  const keys = path.split('.')

  if (keys.length === 1) {
    return object[path]
  }

  const newObj = object[keys[0]]
  const newPath = keys.slice(1).join('.')

  return pluck(newObj, newPath)
}

/**
 * @deprecated Обозначить нужные форматы дат (их сейчас очень много)
 * @param time
 * @return {string}
 */
export function timeFormat(time) {
  return DateTime.fromSeconds(time).toFormat('dd.MM.yyyy, HH:mm')
}

/**
 * @deprecated - использовать обычный try-catch-finally
 * @param {Promise} promise
 * @param {Function=} before
 * @param {Function=} after
 * @return {Promise<[response, error]>}
 */
export async function promiseCatch(promise, before, after) {
  return new Promise((resolve) => {
    typeof before === 'function' && before()
    promise
      .then((res) => {
        resolve([res, null])
      })
      .catch((e) => {
        resolve([null, e])
      })
      .finally(() => {
        typeof after === 'function' && after()
      })
  })
}

/**
 * Возвращает true если id одинаковые
 * @param {string|number} id1
 * @param {string|number} id2
 * @return {boolean}
 */
export function compareId(id1, id2) {
  return '' + id1 === '' + id2
}

export function flushPromises() {
  const scheduler = typeof setImmediate === 'function' ? setImmediate : setTimeout
  return new Promise((resolve) => {
    scheduler(resolve)
  })
}

/**
 * Устанавливает document.title
 * @param {string} title
 */
export function setDocumentTitle(title) {
  document.title = title
}
