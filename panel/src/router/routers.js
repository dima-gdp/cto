import Main from '@/components/main'
import { ROLES } from "@/domain/role"

/**
 * Мета-конфигурируемые параметры Iview-admin в дополнение к собственным параметрам:
 * meta: {
 *  title: { String|Number|Function }
 *  Текст отображается на боковой панели, хлебных крошках и панели вкладок
 *  Используйте форму {{multi-language field}} 'в сочетании с многоязычным использованием,
 *  примеры конфигурации многоязычной маршрутизации
 *  Вы можете передать функцию обратного вызова, параметры - текущий объект маршрутизации,
 *  примеры см. Динамическая маршрутизация и параметризованная маршрутизация
 *  hideInBread: (false) Скрыть в хлебных крошках
 *  hideInMenu: (false) Скрыть в меню
 *  notCache: (false) Отключение кеширования маршрута
 *  access: (null) Массив ролей доступных для этого маршрута, влияют на дочерний маршрут
 *  icon: (-) Иконка для отображения, для использования костомных иконок нужно вызывать через _
 *  beforeCloseName: (-) Установите это поле, когда вы закрываете текущую вкладку,
 *  вы переходите в '@ / router / before-close.js', чтобы найти метод, соответствующий имени поля,
 *  в качестве функции ловушки перед закрытием.
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Вход',
      hideInMenu: true,
    },
    component: () => import('@/view/login/login.vue'),
  },
  {
    path: '/select-event',
    name: 'select-event',
    meta: {
      title: 'Выбор мероприятия',
      notCache: true,
      hideInMenu: true,
      access: ['manager'],
    },
    component: () => import('@/view/pages/SelectEvent/select-event'),
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      notCache: true,
      access: ['manager'],
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          title: 'Сводная информация',
          notCache: true,
          icon: 'ios-stats-outline',
          access: ['manager'],
        },
        component: () => import('@/view/pages/Home/Home.vue'),
      },
    ],
  },
  {
    path: '/domains',
    name: 'domains',
    meta: {
      icon: 'ios-people',
      title: 'Домены',
      access: ['administrator', 'it'],
    },
    component: Main,
    children: [
      {
        path: 'list',
        name: 'domains_list',
        meta: {
          icon: 'ios-briefcase-outline',
          title: 'Домены',
        },
        component: () => import('@/view/pages/Domains/list.vue'),
      },
      {
        path: 'create',
        name: 'domains_create',
        meta: {
          hideInMenu: true,
          icon: 'ios-create',
          title: 'Создать',
        },
        component: () => import('@/view/pages/Domains/create.vue'),
      },
      {
        path: 'edit/:id',
        name: 'domains_edit',
        meta: {
          hideInMenu: true,
          icon: 'ios-create',
          title: 'Редактировать',
        },
        component: () => import('@/view/pages/Domains/edit.vue'),
      },
    ],
  },
  {
    path: '/events',
    name: 'events',
    component: Main,
    meta: {
      icon: 'ios-people',
      title: 'Мероприятия',
      access: ['administrator', 'it'],
    },
    children: [
      {
        path: 'list',
        name: 'events_list',
        meta: {
          icon: 'ios-pin-outline',
          title: 'Мероприятия',
        },
        component: () => import('@/view/pages/Events/list/list.vue'),
      },
      {
        path: 'create',
        name: 'event_create',
        meta: {
          hideInMenu: true,
        },
        component: () => import('@/view/pages/Events/create/create.vue'),
      },
      {
        path: 'edit/:id',
        name: 'event_edit',
        meta: {
          hideInMenu: true,
        },
        component: () => import('@/view/pages/Events/edit'),
      },
      {
        path: 'edit/:id/content-info',
        name: 'event_content-info',
        meta: {
          hideInMenu: true,
        },
        component: () => import('@/view/pages/Events/edit/ContentInfo/index.js'),
      },
      {
        path: 'edit/:id/legal-info',
        name: 'event_legal-info',
        meta: {
          hideInMenu: true,
        },
        component: () => import('@/view/pages/Events/edit/LegalInfo/index.js'),
      },
      {
        path: 'edit/:id/requests',
        name: 'event_requests',
        meta: {
          hideInMenu: true,
        },
        component: () => import('@/view/pages/Events/edit/Requests/index.js'),
      },
      {
        path: 'edit/:id/hall-group',
        name: 'hall_group',
        meta: {
          hideInMenu: true,
        },
        component: () => import('@/view/pages/Events/edit/HallGroup/index.js'),
      },
      {
        path: 'edit/:id/locales',
        name: 'event_locales',
        meta: {
          hideInMenu: true,
        },
        component: () => import('@/view/pages/Events/edit/Locales/locales.vue'),
      },
      {
        path: 'edit/:id/requests/create',
        name: 'event_requests_create',
        meta: {
          hideInMenu: true,
        },
        component: () => import('@/view/pages/Events/edit/Requests/create'),
      },
      {
        path: 'edit/:id/hall-group/create',
        name: 'event_hall-group_create',
        meta: {
          hideInMenu: true,
        },
        component: () => import('@/view/pages/Events/edit/HallGroup/CreateHallGroup'),
      },
      {
        path: 'edit/:id/hall-group/edit/:hall_group_id',
        name: 'event_hall-group_edit',
        meta: {
          hideInMenu: true,
        },
        component: () => import('@/view/pages/Events/edit/HallGroup/EditHallGroup'),
      },
      {
        path: 'edit/:id/requests/edit/:request_id',
        name: 'event_requests_edit',
        meta: {
          hideInMenu: true,
        },
        component: () => import('@/view/pages/Events/edit/Requests/edit'),
      },
      {
        path: 'edit/:id/store',
        name: 'event_store',
        meta: {
          hideInMenu: true,
        },
        component: () => import('@/view/pages/Events/edit/Store/index.js'),
      },
      {
        path: 'edit/:id/documents',
        name: 'event_documents',
        meta: {
          hideInMenu: true,
        },
        component: () => import('@/view/pages/Events/edit/Documents/DocumentsList.vue'),
      },
      {
        path: 'edit/:id/event-page-management',
        name: 'event_page-management',
        meta: {
          hideInMenu: true,
        },
        component: () => import('@/view/pages/Events/edit/EventPage/EventPageManagement.vue'),
      },
      {
        path: 'edit/:id/metrics',
        name: 'event_metrics',
        meta: {
          hideInMenu: true,
        },
        component: () => import('@/view/pages/Events/edit/Metrics/list.vue'),
      },
      {
        path: 'edit/:id/metrics/create',
        name: 'event_metrics_create',
        meta: {
          hideInMenu: true,
        },
        component: () => import('@/view/pages/Events/edit/Metrics/create.vue'),
      },
      {
        path: 'edit/:id/metrics/edit/:metricId',
        name: 'event_metrics_edit',
        meta: {
          hideInMenu: true,
        },
        component: () => import('@/view/pages/Events/edit/Metrics/edit.vue'),
      },
      {
        path: 'edit/:id/event-page-access/:eventPageId',
        name: 'event_page-access',
        meta: {
          hideInMenu: true,
        },
        component: () => import('@/view/pages/Events/edit/EventPage/EventPageAccess.vue'),
      },
      {
        path: 'edit/:id/event-menu',
        name: 'event_menu',
        meta: {
          hideInMenu: true,
        },
        component: () => import('@/view/pages/Events/edit/Menu/EventMenu.vue'),
      },
      {
        path: 'edit/:id/landing',
        name: 'event_landing',
        meta: {
          hideInMenu: true,
        },
        component: () => import('@/view/pages/Events/edit/Landing/LandingPage.vue'),
      },
    ],
  },
  {
    path: '/worksheets',
    name: 'worksheets',
    component: Main,
    meta: {
      icon: 'ios-people',
      title: 'Анкеты',
    },
    children: [
      {
        path: 'list',
        name: 'worksheets_list',
        meta: {
          icon: 'ios-people-outline',
          title: 'Анкеты',
        },
        component: () => import('@/view/pages/Worksheets/list.vue'),
      },
      {
        path: ':id',
        name: 'worksheet_view',
        meta: {
          hideInMenu: true,
        },
        component: () => import('@/view/pages/Worksheets/view.vue'),
      },
    ],
  },
  {
    path: '/requests',
    name: 'appeals',
    component: Main,
    meta: {
      icon: 'ios-people',
      title: 'Материалы',
    },
    children: [
      {
        path: 'list',
        name: 'appeals_list',
        meta: {
          icon: 'ios-chatbubbles-outline',
          title: 'Материалы',
        },
        component: () => import('@/view/pages/Requests/list.vue'),
      },
      {
        path: ':id',
        name: 'appeal_view',
        meta: {
          hideInMenu: true,
        },
        component: () => import('@/view/pages/Requests/view.vue'),
      },
    ],
  },
  {
    path: '/orders',
    name: 'orders',
    component: Main,
    meta: {
      icon: 'ios-people',
      title: 'Заказы',
    },
    children: [
      {
        path: 'list',
        name: 'orderss_list',
        meta: {
          icon: 'ios-cart-outline',
          title: 'Заказы',
        },
        component: () => import('@/view/pages/Orders/list.vue'),
      },
      {
        path: ':id',
        name: 'order_view',
        meta: {
          hideInMenu: true,
        },
        component: () => import('@/view/pages/Orders/view.vue'),
      },
    ],
  },
  {
    path: '/access',
    name: 'access',
    meta: {
      icon: 'ios-people',
      title: 'Доступы',
      access: ['manager'],
    },
    component: Main,
    children: [
      {
        path: 'list',
        name: 'access_list',
        meta: {
          icon: 'ios-lock-outline',
          title: 'Доступы',
        },
        component: () => import('@/view/pages/Events/edit/EventPage/EventPageManagement.vue'),
      },
    ],
  },
  {
    path: '',
    name: 'form-settings',
    meta: {
      icon: 'ios-git-branch',
      title: 'Формы',
      access: ['administrator', 'it'],
    },
    component: Main,
    children: [
      {
        path: '/forms',
        name: 'forms',
        meta: {
          icon: 'ios-paper-outline',
          title: 'Формы сбора данных',
        },
        component: () => import('@/view/pages/Forms/forms-view.vue'),
        children: [
          {
            path: 'list',
            name: 'forms_list',
            meta: {
              icon: 'ios-paper-outline',
              title: 'Формы сбора данных',
            },
            component: () => import('@/view/pages/Forms/list.vue'),
          },
          {
            path: 'create',
            name: 'form_create',
            meta: {
              hideInMenu: true,
            },
            component: () => import('@/view/pages/Forms/create.vue'),
          },
          {
            path: 'edit/:id',
            name: 'form_edit',
            meta: {
              hideInMenu: true,
            },
            component: () => import('@/view/pages/Forms/edit.vue'),
          },
        ],
      },
      {
        path: '/form-fields',
        name: 'form_fields',
        meta: {
          icon: 'ios-list',
          title: 'Поля для форм',
        },
        component: () => import('@/view/pages/FormFields/form-fields-view.vue'),
        children: [
          {
            path: 'list',
            name: 'form_fields_list',
            meta: {
              icon: 'ios-list',
              title: 'Поля для форм',
            },
            component: () => import('@/view/pages/FormFields/list.vue'),
          },
          {
            path: 'edit/:id',
            name: 'form_field_edit',
            meta: {
              hideInMenu: true,
            },
            component: () => import('@/view/pages/FormFields/edit.vue'),
          },
          {
            path: 'create',
            name: 'form_field_create',
            meta: {
              hideInMenu: true,
            },
            component: () => import('@/view/pages/FormFields/create.vue'),
          },
        ],
      },
      {
        path: '/tags',
        name: 'tags',
        meta: {
          icon: 'ios-funnel-outline',
          title: 'Таблица тегов',
        },
        component: () => import('@/view/pages/Tags/tags-view.vue'),
        children: [
          {
            path: 'list',
            name: 'tags_list',
            meta: {
              icon: 'ios-funnel-outline',
              title: 'Таблица тегов',
            },
            component: () => import('@/view/pages/Tags/list.vue'),
          },
          {
            path: 'edit/:id',
            name: 'tag_edit',
            meta: {
              hideInMenu: true,
            },
            component: () => import('@/view/pages/Tags/edit.vue'),
          },
          {
            path: 'create',
            name: 'tag_create',
            meta: {
              hideInMenu: true,
            },
            component: () => import('@/view/pages/Tags/create.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/users',
    name: 'Пользователи',
    meta: {
      icon: 'ios-people-outline',
      title: 'Пользователи',
      access: ['administrator', 'it'],
    },
    component: Main,
    children: [
      {
        path: 'users_base/list',
        name: 'users_base_list',
        meta: {
          icon: 'ios-people-outline',
          title: 'Базы пользователей',
        },
        component: () => import('@/view/pages/UsersBase/list.vue'),
      },
      {
        path: 'users_base/create',
        name: 'users_base_create',
        meta: {
          icon: 'ios-people-outline',
          title: 'Создание базы пользователей',
          hideInMenu: true,
        },
        component: () => import('@/view/pages/UsersBase/create.vue'),
      },
      {
        path: 'users_base/edit/:id',
        name: 'users_base_edit',
        meta: {
          icon: 'ios-people-outline',
          title: 'Редактирование базы пользователей',
          hideInMenu: true,
        },
        component: () => import('@/view/pages/UsersBase/edit.vue'),
      },
      {
        path: 'list',
        name: 'user_list',
        meta: {
          icon: 'ios-people-outline',
          title: 'Пользователи',
        },
        component: () => import('@/view/pages/Users/list.vue'),
      },
      {
        path: 'create',
        name: 'user_create',
        meta: {
          hideInMenu: true,
          icon: 'ios-create',
          title: 'Создать',
        },
        component: () => import('@/view/pages/Users/create.vue'),
      },
      {
        path: 'edit/:id',
        name: 'user_edit',
        meta: {
          hideInMenu: true,
          icon: 'ios-create',
          title: 'Редактировать',
        },
        component: () => import('@/view/pages/Users/edit.vue'),
      },
    ],
  },
  {
    path: '/juridical',
    name: 'juridical',
    meta: {
      icon: 'ios-people',
      title: 'Юр. лица',
      access: ['administrator', 'it'],
    },
    component: Main,
    children: [
      {
        path: 'list',
        name: 'juridical_list',
        meta: {
          icon: 'ios-briefcase-outline',
          title: 'Юр. лица',
        },
        component: () => import('@/view/pages/Juridical/list.vue'),
      },
      {
        path: 'create',
        name: 'juridical_create',
        meta: {
          hideInMenu: true,
          icon: 'ios-create',
          title: 'Создать',
        },
        component: () => import('@/view/pages/Juridical/create.vue'),
      },
      {
        path: 'edit/:id',
        name: 'juridical_edit',
        meta: {
          hideInMenu: true,
          icon: 'ios-create',
          title: 'Редактировать',
        },
        component: () => import('@/view/pages/Juridical/edit.vue'),
      },
      {
        path: 'provider-create/:id',
        name: 'provider_create',
        meta: {
          hideInMenu: true,
          icon: 'ios-create',
          title: 'Создать провайдера',
        },
        component: () => import('@/view/pages/Provider/create.vue'),
      },
      {
        path: 'provider-edit/:id',
        name: 'provider_edit',
        meta: {
          hideInMenu: true,
          icon: 'ios-create',
          title: 'Редактировать провайдера',
        },
        component: () => import('@/view/pages/Provider/edit.vue'),
      },
    ],
  },
  {
    path: '/reports',
    name: 'reports',
    meta: {
      icon: 'ios-people',
      title: 'Отчеты',
    },
    component: Main,
    children: [
      {
        path: 'list',
        name: 'reports_list',
        meta: {
          icon: 'ios-trending-up',
          title: 'Отчеты',
        },
        component: () => import('@/view/pages/Reports/list.vue'),
      },
    ],
  },
  {
    path: '/metrics',
    name: 'metrics',
    meta: {
      icon: 'ios-people',
      title: 'Внешние счетчики',
      access: ['manager'],
    },
    component: Main,
    children: [
      {
        path: 'list',
        name: 'metrics_list',
        meta: {
          icon: 'ios-podium-outline',
          title: 'Внешние счетчики',
        },
        component: () => import('@/view/pages/Events/edit/Metrics/list.vue'),
      },
      {
        path: 'list/create',
        name: 'metrics_create',
        meta: {
          hideInMenu: true,
          icon: 'ios-create',
          title: 'Создать',
        },
        component: () => import('@/view/pages/Events/edit/Metrics/create.vue'),
      },
      {
        path: 'list/edit/:metricId',
        name: 'metrics_edit',
        meta: {
          hideInMenu: true,
          icon: 'ios-create',
          title: 'Редактировать',
        },
        component: () => import('@/view/pages/Events/edit/Metrics/edit.vue'),
      },
    ],
  },
  {
    path: '/imports',
    name: 'Imports',
    meta: {
      icon: 'ios-people-outline',
      title: 'Imports',
      access: ['administrator', 'it'],
    },
    component: Main,
    children: [
      {
        path: 'list',
        name: 'imports_list',
        meta: {
          icon: 'ios-code-download',
          title: 'Импорты',
        },
        component: () => import('@/view/imports/list.vue'),
      },
      {
        path: 'create',
        name: 'imports_create',
        meta: {
          hideInMenu: true,
          icon: 'ios-create',
          title: 'Создать',
        },
        component: () => import('@/view/imports/create.vue'),
      },
    ],
  },
  {
    path: '/static-pages',
    name: 'LocalPages',
    meta: {
      icon: 'ios-paper-outline',
      title: 'StaticPages',
      access: ['administrator', 'it'],
    },
    component: Main,
    children: [
      {
        path: 'list',
        name: 'static-pages_list',
        meta: {
          icon: 'ios-paper-outline',
          title: 'Статичные страницы',
        },
        component: () => import('@/view/pages/StaticPages/list.vue'),
      },
      {
        path: 'create',
        name: 'static-pages_create',
        meta: {
          hideInMenu: true,
          title: 'Создание локальной страницы',
        },
        component: () => import('@/view/pages/StaticPages/create.vue'),
      },
      {
        path: 'edit/:id',
        name: 'static-pages_edit',
        meta: {
          hideInMenu: true,
          title: 'Редактирование локальной страницы',
        },
        component: () => import('@/view/pages/StaticPages/edit.vue'),
      },
    ],
  },
  {
    path: '/defaultLocales',
    name: 'defaultEn',
    component: Main,
    meta: {
      icon: 'ios-people',
      title: 'Переводы по умолчанию',
      access: ['administrator', 'it'],
    },
    children: [
      {
        path: 'list',
        name: 'defaultEnLocales_list',
        meta: {
          icon: 'ios-people-outline',
          title: 'Переводы по умолчанию',
        },
        component: () => import('@/view/pages/defaultLocales/list.vue'),
      },
    ],
  },
  {
    path: '/users-cards',
    component: Main,
    meta: {
      icon: 'ios-people',
      title: 'Карточки клиентов',
      access: ['administrator', 'it'],
    },
    children: [
      {
        path: 'list',
        name: 'users-cards_list',
        meta: {
          icon: 'ios-people-outline',
          title: 'Карточки клиентов',
        },
        component: () => import('@/view/pages/UsersCards/list.vue'),
      },
      {
        path: 'list/:visualStructure',
        name: 'users-cards_list--with-filter',
        meta: {
          icon: 'ios-people-outline',
          title: 'Карточки клиентов',
          hideInMenu: true,
        },
        component: () => import('@/view/pages/UsersCards/list.vue'),
      },
    ],
  },
  {
    path: '/users-segments',
    component: Main,
    meta: {
      icon: 'ios-people',
      title: 'Сегменты',
      access: ['administrator', 'it'],
    },
    children: [
      {
        path: 'list',
        name: 'users-cards_segments',
        meta: {
          icon: 'ios-people-outline',
          title: 'Сегменты',
        },
        component: () => import('@/view/pages/Segments/list.vue'),
      },
    ],
  },
  {
    path: '/themes',
    component: Main,
    meta: {
      icon: 'ios-people',
      title: 'Темы',
      access: ['administrator', 'it'],
    },
    children: [
      {
        path: '',
        name: 'themes',
        meta: {
          icon: 'ios-people-outline',
          title: 'Темы',
        },
        component: () => import('@/view/pages/Themes/list.vue'),
      },
      {
        path: 'create',
        name: 'themes_create',
        meta: {
          hideInMenu: true,
          title: 'Создание темы',
        },
        component: () => import('@/view/pages/Themes/create.vue'),
      },
      {
        path: 'edit/:id',
        name: 'themes_edit',
        meta: {
          hideInMenu: true,
          title: 'Редактирование темы',
        },
        component: () => import('@/view/pages/Themes/edit.vue'),
      },
    ],
  },
  {
    path: '/hall-group',
    name: 'hall_group--manager',
    meta: {
      icon: 'ios-people',
      title: 'Трансляции',
      access: ['manager'],
      permission: 'downloadHallGroupReport',
    },
    component: Main,
    children: [
      {
        path: 'list',
        name: 'hall-group_list',
        meta: {
          icon: 'ios-videocam',
          title: 'Трансляции',
        },
        component: () => import('@/view/pages/Events/edit/HallGroup/index.js'),
      },
    ],
  },

  {
    path: '/landing',
    name: 'landing--manager',
    meta: {
      icon: 'ios-people',
      title: 'Трансляции',
      access: ['manager'],
    },
    component: Main,
    children: [
      {
        path: 'edit',
        name: 'landing-edit--manager',
        meta: {
          icon: 'md-browsers',
          title: 'Лендинг',
        },
        component: () => import('@/view/pages/Events/edit/Landing/LandingPage.vue'),
      },
    ],
  },

  {
    path: '/landings',
    name: 'landings',
    meta: {
      icon: 'ios-people',
      title: 'Лендинги',
      access: [ ROLES.admin ],
    },
    component: Main,
    children: [
      {
        path: 'list',
        name: 'landings_list',
        meta: {
          icon: 'md-browsers',
          title: 'Лендинги',
        },
        component: () => import('@/view/pages/LandingTemplates/list'),
      },
      {
        path: 'create',
        name: 'landing_create',
        meta: {
          hideInMenu: true,
          title: 'Создание лендинга',
        },
        component: () => import('@/view/pages/LandingTemplates/create/create'),
      },
      {
        path: 'edit/:id',
        name: 'landing_edit',
        meta: {
          hideInMenu: true,
          title: 'Редактирование лендинга',
        },
        component: () => import('@/view/pages/LandingTemplates/edit/edit'),
      },
    ],
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true,
    },
    component: () => import('@/view/error-page/401.vue'),
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true,
    },
    component: () => import('@/view/error-page/500.vue'),
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true,
    },
    component: () => import('@/view/error-page/404.vue'),
  },
]
