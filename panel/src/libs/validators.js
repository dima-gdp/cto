import { fromStringToStamp } from '@/libs/util'

/**
 * Правило для AsyncValidator, проверяет соответствует ли формату dd-MM-yyyy HH:mm
 * @param rule
 * @param value
 * @param cb
 * @returns {boolean}
 */
export function validateDateTime(rule, value, cb) {
  if (!value) {
    return true
  }

  try {
    // fromStringToStamp вернет NaN для некорректного значения строки(value)
    // NaN > 0 === false
    // Если же дата до начала эпохи (1.1.1970), то из fromStringToStamp вернется отрицательное число
    return fromStringToStamp(value) > 0
  } catch {
    return false
  }
}
