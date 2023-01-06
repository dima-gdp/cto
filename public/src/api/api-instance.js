import axios from 'axios'
import { addRequestInterceptor, addResponseInterceptor } from '@/api/interceptor-service'
import BaseEndpoint from '@/api/endpoints/base-endpoint'
import EventEndpoint from '@/api/endpoints/event-endpoint'
import DomainEndpoint from '@/api/endpoints/domain-endpoint'
import ColorThemeEndpoint from '@/api/endpoints/color-theme-endpoint'
import I18nEndpoint from '@/api/endpoints/i18n-endpoint'
import UserEndpoint from '@/api/endpoints/user-endpoint'
import RegistrationEndpoint from '@/api/endpoints/registration-endpoint'
import EventToEventEndpoint from '@/api/endpoints/event-to-event-endpoint'
import FormEndpoint from '@/api/endpoints/form-endpoint'
import VkEndpoint from '@/api/endpoints/vk-endpoint'
import FormRecordEndpoint from '@/api/endpoints/form-record-endpoint'
import RequestEndpoint from '@/api/endpoints/request-endpoint'
import UserRequestEndpoint from '@/api/endpoints/user-request-endponit'
import ShopEndpoint from '@/api/endpoints/shop-endpoint'
import OrderEndpoint from '@/api/endpoints/order-endpoint'
import ProviderEndpoint from '@/api/endpoints/provider-endpoint'
import StaticPageEndpoint from '@/api/endpoints/static-page-endpoint'
import DocumentEndpoint from '@/api/endpoints/document-endpoint'
import StreamEndpoint from '@/api/endpoints/stream-endpoint'
import FileEndpoint from '@/api/endpoints/file-endpoint'
import HallGroupEndpoint from '@/api/endpoints/hall-group-endpoint'
import MenuEndpoint from '@/api/endpoints/menu-endpoint'
import EventLandingEndpoint from '@/api/endpoints/event-landing-endpoint'

import jsonapiRequestInterceptor from '@/api/interceptors/jsonapi-request-interceptor'
import jsonapiResponseInterceptor from '@/api/interceptors/jsonapi-response-interceptor'
import paramsSerializeRequestInterceptor from '@/api/interceptors/params-serialize-request-interceptor'

import { AXIOS_TIMEOUT_ERROR } from '@/utils/constants'
import DomainContentEndpoint from '@/api/endpoints/domain-content-endpoint'
import defineApiUrl from './define-api-url'
import MetricCounterEndpoint from "@/api/endpoints/metric-counter-endpoint";

const BASE_URL = defineApiUrl(process.env.VUE_APP_ENV) + 'api/v1'

/**
 * @type {{
 *    base: BaseEndpoint,
 *    event: EventEndpoint,
 *    domain: DomainEndpoint,
 *    colorTheme: ColorThemeEndpoint,
 *    i18n: I18nEndpoint,
 *    user: UserEndpoint,
 *    registration: RegistrationEndpoint,
 *    eventToEvent: EventToEventEndpoint,
 *    form: FormEndpoint,
 *    formRecord: FormRecordEndpoint,
 *    vk: VkEndpoint,
 *    request: RequestEndpoint,
 *    userRequest: UserRequestEndpoint,
 *    staticPage: StaticPageEndpoint,
 *    file: FileEndpoint,
 *    hallGroup: HallGroupEndpoint,
 *    menu: MenuEndpoint,
 *    metricCounter: MetricCounterEndpoint,
 *    eventLanding: EventLandingEndpoint,
 * }}
 */
let apiInstance

export let axiosInstance

function createApiInstance() {
  if (apiInstance) {
    return apiInstance
  }

  axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    timeoutErrorMessage: AXIOS_TIMEOUT_ERROR,
  })

  addRequestInterceptor(paramsSerializeRequestInterceptor)
  addRequestInterceptor(jsonapiRequestInterceptor)
  addResponseInterceptor(jsonapiResponseInterceptor)

  apiInstance = {
    base: new BaseEndpoint(axiosInstance, '/', ''),
    event: new EventEndpoint(axiosInstance, '/events/event', 'event'),
    domain: new DomainEndpoint(axiosInstance, '/domain', 'domain'),
    colorTheme: new ColorThemeEndpoint(axiosInstance, '/styles/theme', 'theme'),
    i18n: new I18nEndpoint(axiosInstance, '/events/i18n', 'i18n'),
    user: new UserEndpoint(axiosInstance, '/user', 'user'),
    registration: new RegistrationEndpoint(axiosInstance, '/events/registration', 'registration'),
    shop: new ShopEndpoint(axiosInstance, '/events/stores/store', 'store'),
    order: new OrderEndpoint(axiosInstance, '/orders/order', 'order'),
    provider: new ProviderEndpoint(axiosInstance, '/payments/provider', 'provider'),
    eventToEvent: new EventToEventEndpoint(
      axiosInstance,
      '/events/event-to-event',
      'event-to-event',
    ),
    form: new FormEndpoint(axiosInstance, '/forms/form', 'form'),
    vk: new VkEndpoint(axios.create({ baseURL: BASE_URL }), 'vk', ''), // инстанс без интерцепторов,
    formRecord: new FormRecordEndpoint(axiosInstance, '/forms/record', 'record'),
    request: new RequestEndpoint(axiosInstance, '/request', 'request'),
    // userRequest - это отправленные Обращения, отправленные Пользователем на Мероприятие (название не совпадает с урлом)
    userRequest: new UserRequestEndpoint(axiosInstance, '/events/request', 'request'),
    staticPage: new StaticPageEndpoint(axiosInstance, '/page', 'page'),
    domainContent: new DomainContentEndpoint(axiosInstance, '/domain-content', 'domain-content'),
    document: new DocumentEndpoint(axiosInstance, '/events/user-document', 'user-document'),
    stream: new StreamEndpoint(axiosInstance, '/events/stream', 'stream'),
    file: new FileEndpoint(axiosInstance, '/files/file', ''),
    hallGroup: new HallGroupEndpoint(axiosInstance, '/events/hall-group', 'hall-group'),
    menu: new MenuEndpoint(axiosInstance, '/events/menu', 'event-menu'),
    menuItem: new BaseEndpoint(axiosInstance, '/events/menu/item', 'event-menu-item'),
    metricCounter: new MetricCounterEndpoint(axiosInstance, 'metric-counter', 'metric-counter'),
    eventLanding: new EventLandingEndpoint(axiosInstance, '/events/event-landing', 'event-landing'),
  }

  return apiInstance
}

export function getExistingApiInstance() {
  if (!apiInstance) {
    return createApiInstance()
  }
  return apiInstance
}
