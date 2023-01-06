export const PAGE_TYPES_ENUM = {
  BASIC: 'Базовая',
  STATIC: 'Стат. страница',
  REQUEST: 'Подача материала',
  STREAM: 'Трансляция',
  DOCUMENT: 'Документ',
}
export const PAGE_TYPE_MAP = Object.freeze({
  user_profile: PAGE_TYPES_ENUM.BASIC,
  store: PAGE_TYPES_ENUM.BASIC,
  user_orders: PAGE_TYPES_ENUM.BASIC,
  event_list: PAGE_TYPES_ENUM.BASIC,
  static_page: PAGE_TYPES_ENUM.STATIC,
  request: PAGE_TYPES_ENUM.REQUEST,
  stream: PAGE_TYPES_ENUM.STREAM,
  document: PAGE_TYPES_ENUM.DOCUMENT,
})
export const CURRENCY_ENUM = Object.freeze({
  RUB: 'RUB',
  USD: 'USD',
  EUR: 'EUR',
})
export const CURRENCY_SYMBOL_ENUM = Object.freeze({
  RUB: '₽',
  USD: '$',
  EUR: '€',
})
export const PRODUCT_TYPE_ENUM = Object.freeze({
  TICKET: 'ticket',
  OTHER: 'other',
})

export const PRODUCT_TYPE_MAP = Object.freeze({
  ticket: 'Билет',
  other: 'Другое',
})

export const REQUESTS_TYPE_MAP = Object.freeze({
  under_consideration: 'На рассмотрении',
  rejected: 'Отклонено',
  accepted_for_publication: 'Принято к публикации',
  accepted_for_the_report: 'Принято к выступлению',
})

export const REQUESTS_TYPE_COLOR_MAP = Object.freeze({
  under_consideration: 'warning',
  rejected: 'danger',
  accepted_for_publication: 'success',
  accepted_for_the_report: 'success',
})

export const TYPES_HALL_GROUP_FORM = {
  EDIT: 'edit',
  CREATE: 'create',
}

export const DATE_FIELD_NAMES_HALLS = ['autoActiveStartedAt', 'autoActiveEndedAt']
