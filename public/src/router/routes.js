// todo: красиво вывести типы и избавится от сложного meta.getTitle
//  (можно просто хранить ключ или вынести в серсис и гуард)
/**
 * @typedef RouteMeta
 * @property {String} layout Название лейаута
 * @property {Boolean} auth если true, то роуту нужна авторизация
 * @property {Boolean} hasEventPage если true, то роут управляемый, ему соответствует EventPage
 * @property {Boolean} isSingleLang если true, то у страницы нет версии другого языка
 * @property {Boolean} isDynamic если true, то title страницы берется из EventPage
 * @property {Function} getTitle функция, которая выполняется в afterEach гуарде,
 * для установки заголовка (для страниц с фиксированным названием)
 */

/**
 *
 * @type {Array<{
 *   path: string,
 *   name: string,
 *   component: function,
 *   meta: RouteMeta
 * }>}
 */
const routes = [
  {
    path: '/event/:eventId/profile',
    name: 'profile',
    component: () => import(/* webpackChunkName: "profile" */ '@/pages/profile'),
    meta: {
      layout: 'default',
      getTitle: (translateFn) => translateFn('header.titles.event-eventId-profile'),
      auth: true,
      hasEventPage: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/pages/login/login'),
    meta: {
      layout: 'no-side-bar',
      getTitle: (translateFn) => translateFn('auth.title'),
    },
  },
  {
    path: '/login/check-email',
    name: 'check-email',
    component: () => import(/* webpackChunkName: "check-email" */ '@/pages/login/check-email'),
    meta: {
      layout: 'no-side-bar',
      getTitle: (translateFn) => translateFn('checkEmail.title'),
    },
  },
  {
    path: '/login/recovery',
    name: 'recovery',
    component: () => import(/* webpackChunkName: "recovery" */ '@/pages/login/recovery'),
    meta: {
      layout: 'no-side-bar',
      getTitle: (translateFn) => translateFn('recover.title'),
    },
  },
  {
    path: '/login/reset-success',
    name: 'reset-success',
    component: () => import(/* webpackChunkName: "reset-success" */ '@/pages/login/reset-success'),
    meta: {
      layout: 'no-side-bar',
      getTitle: (translateFn) => translateFn('resetSuccess.title'),
    },
  },
  {
    path: '/login/change-password/:slug',
    name: 'change-password',
    component: () =>
      import(/* webpackChunkName: "change-password" */ '@/pages/login/change-password'),
    meta: {
      layout: 'no-side-bar',
      getTitle: (translateFn) => translateFn('resetPassword.title'),
    },
  },
  {
    path: '/registration',
    name: 'registration',
    component: () => import(/* webpackChunkName: "registration" */ '@/pages/registration'),
    meta: {
      layout: 'no-side-bar',
      getTitle: (translateFn) => translateFn('registration.title'),
      auth: true,
    },
  },
  {
    path: '/user',
    name: 'user',
    component: () => import(/* webpackChunkName: "user" */ '@/pages/registration/user'),
    meta: {
      layout: 'no-side-bar',
      getTitle: (translateFn) => translateFn('registration.title'),
    },
  },
  {
    path: '/events',
    name: 'events',
    component: () => import(/* webpackChunkName: "events" */ '@/pages/events'),
    meta: {
      layout: 'default',
      getTitle: (translateFn) => translateFn('header.titles.events'),
      auth: true,
      hasEventPage: true,
    },
  },
  {
    path: '/registration/success',
    component: () =>
      import(/* webpackChunkName: "registration-success" */ '@/pages/registration/success'),
    name: 'registration-success',
    meta: {
      layout: 'no-side-bar',
      getTitle: (tr) => tr('registrationSuccess.title'),
    },
  },
  {
    path: '/registration/email-confirmed/:token',
    component: () =>
      import(/* webpackChunkName: "email-confirmed" */ '@/pages/registration/email-confirmed'),
    name: 'email-confirmed',
    meta: {
      layout: 'no-side-bar',
      getTitle: (tr) => tr('emailConfirm.title'),
      auth: true,
    },
  },
  {
    path: '/event/:eventId/orders',
    name: 'orders',
    component: () => import(/* webpackChunkName: "orders" */ '@/pages/shop/orders'),
    meta: {
      layout: 'default',
      getTitle: (tr) => tr('header.titles.eventEventIdOrders'),
      auth: true,
      hasEventPage: true,
    },
  },
  {
    path: '/event/:eventId/orders/:orderId',
    name: 'orders-detail',
    component: () => import(/* webpackChunkName: "orders-detail" */ '@/pages/shop/order-detail'),
    meta: {
      layout: 'default',
      getTitle: (tr) => tr('header.titles.event-eventId-orders-id'),
      auth: true,
    },
  },
  {
    path: '/event/:eventId/orders/:orderId/payment',
    name: 'payment',
    component: () => import(/* webpackChunkName: "payment" */ '@/pages/shop/payment'),
    meta: {
      layout: 'default',
      getTitle: (tr) => tr('header.titles.event-eventId-orders-payment'),
      auth: true,
    },
  },
  {
    path: '/event/:eventId/store',
    name: 'store',
    component: () => import(/* webpackChunkName: "shop" */ '@/pages/shop/shop'),
    meta: {
      layout: 'default',
      getTitle: (tr) => tr('header.titles.eventEventIdStore'),
      auth: true,
      hasEventPage: true,
    },
  },
  {
    path: '/event/:eventId/request/:requestId',
    name: 'request',
    component: () => import(/* webpackChunkName: "request" */ '@/pages/request'),
    meta: {
      layout: 'default',
      getTitle: (tr) => '...', // зависит от типа материала, устанавливается самой страницей
      auth: true,
      isDynamic: true,
      hasEventPage: true,
      isSingleLang: true,
    },
  },
  {
    path: '/event/:eventId/static-pages/:staticPageId',
    name: 'static-page',
    component: () => import(/* webpackChunkName: "static-page" */ '@/pages/static-page'),
    meta: {
      layout: 'default',
      getTitle: (tr) => '...', // зависит от стат страницы, устанавливается самой страницей
      auth: true,
      isDynamic: true,
      hasEventPage: true,
      isSingleLang: true,
    },
  },
  {
    path: '/registration/juridical/:id',
    name: 'content-item',
    component: () => import(/* webpackChunkName: "content-item" */ '@/pages/content-item'),
    meta: {
      layout: 'no-side-bar',
      // todo: установить в самой странице
      getTitle: (tr) => '...',
      auth: true,
      isDynamic: true,
    },
  },
  {
    path: '/event/:eventId/documents/:documentTemplateId',
    name: 'document',
    component: () => import(/* webpackChunkName: "documents" */ '@/pages/documents'),
    meta: {
      layout: 'default',
      getTitle: (tr) => '...', // зависит от стат страницы, устанавливается самой страницей
      auth: true,
      isDynamic: true,
      hasEventPage: true,
      isSingleLang: true,
    },
  },
  {
    path: '/event/:eventId/stream/:hallGroupId',
    name: 'stream',
    component: () => import(/* webpackChunkName: "stream" */ '@/pages/stream'),
    meta: {
      layout: 'default',
      getTitle: (tr) => '...',
      auth: true,
      isDynamic: true,
      hasEventPage: true,
      isSingleLang: true,
    },
  },
  {
    path: '/',
    name: 'main',
    component: () => import(/* webpackChunkName: "index" */ '@/pages/index'),
    meta: {
      layout: 'empty',
      getTitle: () => '...',
    },
  },
  {
    // должен идти последним
    path: '/:catchAll(.*)',
    component: () => import(/* webpackChunkName: "not-found" */ '@/pages/404'),
    name: 'not-found',
    meta: {
      layout: 'default',
      getTitle: (tr) => tr('error.text.caption.404'),
    },
  },
]

export default routes
