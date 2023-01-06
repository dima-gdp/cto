export const EMAIL_REGEX =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i

export const EVENT_TYPE_NAMES = Object.freeze({
  CABINET: 'cabinet',
  OCCASION: 'occasion',
})

export const AXIOS_TIMEOUT_ERROR = 'TimeoutError'

export const ENUM_PRODUCT_STATUS = Object.freeze({
  AVAILABLE: 'available',
  SELLING_IS_CLOSE: 'selling_is_close',
  RATE_IS_BLOCKED: 'rate_blocked',
})

export const ENUM_PRODUCT_STATUS_I18N = Object.freeze({
  AVAILABLE: 'order.orderCard.isAvailable',
  SELLING_IS_CLOSE: 'order.orderCard.isNotAvailable.closedSelling',
  RATE_IS_BLOCKED: 'order.orderCard.isNotAvailable.blockedRate',
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

export const ORDER_STATUS_ENUM = Object.freeze({
  CANCELED: 'orders.status.canceled',
  CREATED: 'orders.status.created',
})

export const ORDER_PAID_ENUM = Object.freeze({
  PAID: 'orders.payment.paid',
  UNPAID: 'orders.payment.unpaid',
})

export const PAGE_TYPES_ENUM = {
  USER_PROFILE: 'user_profile',
  STORE: 'store',
  USER_ORDERS: 'user_orders',
  EVENT_LIST: 'event_list',
  STATIC_PAGE: 'static_page',
  REQUEST: 'request',
  STREAM: 'stream',
  DOCUMENT: 'document',
}

export const DOCUMENT_STATUS_TEXT = Object.freeze({
  ready: 'documentStatus.ready',
  busy: 'documentStatus.busy',
  failed: 'documentStatus.failed',
})

export const DOCUMENT_STATUS_ENUM = Object.freeze({
  CREATED: 'created',
  STARTED: 'started',
  COMPLETED: 'completed',
  FAILED: 'failed',
  OLD: 'old',
  RECREATE: 'recreate',
})

export const resultStatusEnum = Object.freeze({
  IN_PROGRESS: 'inProgress',
  WILL_START: 'willStart',
  ENDED: 'ended',
})

export const STATUS_EMAIL_TOKEN_ENUM = Object.freeze({
  INVALID: 'WRONG_TOKEN',
  VALID: 'ACTIVATED',
})

export const DEFAULT_DATE_FORMAT = 'dd-MM-yyyy'

export const PRODUCT_TYPE_ENUM = Object.freeze({
  TICKET: 'ticket',
  OTHER: 'other',
})

export const TIME_STATUSES = Object.freeze({
  IN_PROGRESS: 'during',
  WILL_START: 'before',
  ENDED: 'after',
})

export const REQUESTS_TYPE_MAP = Object.freeze({
  under_consideration: 'underConsideration',
  rejected: 'rejected',
  accepted_for_publication: 'acceptedForPublication',
  accepted_for_the_report: 'acceptedForTheReport',
})

export const REQUESTS_TYPE_COLOR_MAP = Object.freeze({
  under_consideration: 'warning',
  rejected: 'danger',
  accepted_for_publication: 'success',
  accepted_for_the_report: 'success',
})

export const MENU_ITEMS_TYPES = Object.freeze({
  URL: 'url',
  PAGE: 'page',
  NO_LINK: 'without_link',
})

export const AVAILABLE_LANGUAGES = {
  ru: 'ru',
  en: 'en',
}
