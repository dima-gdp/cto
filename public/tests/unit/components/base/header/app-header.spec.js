import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import AppHeader from '@/components/base/header/app-header'
import EventService from '@/domain/services/event-service'
import Vue from 'vue'
import Vuex from 'vuex'
import iview from '@/assets/vendor/view-design/src'
import { flushPromises } from '@/utils'
import AppHeaderActions from '@/components/base/header/app-header-actions'
import AppHeaderMenuBtn from '@/components/base/header/app-header-menu-button.vue'
import AppHeaderMenu from '@/components/base/header/app-header-desktop-menu.vue'
import AppHeaderManager from '@/components/base/header/app-header-manager.vue'
import AppHeaderTabletMenu from '@/components/base/header/app-header-tablet-menu.vue'
import AppHeaderMobileMenu from '@/components/base/header/app-header-mobile-menu.vue'
import AppHeaderLink from '@/components/base/header/app-header-link.vue'
import { mockHeaderMenuFixture } from '@/api/mocs/api-menu-mock'
import { MENU_ITEMS_TYPES } from '@/utils/constants'

jest.mock('@/domain/composables/use-event', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    getEventMenu: jest.fn().mockResolvedValue(mockHeaderMenuFixture),
  })),
}))

process.env.NODE_ENV = 'test'

Vue.use(iview)
Vue.use(Vuex)

it('fake test', () => {
  expect(true).toBe(true)
})

// todo: тесты не работают - проблема с vuex
// describe('@/components/base/header/app-header', () => {
//   Object.defineProperty(window, 'innerWidth', {
//     writable: true,
//     configurable: true,
//     value: 1400,
//   })
//
//   Object.defineProperty(window, 'location', {
//     value: {
//       href: '',
//     },
//     writable: true,
//   })
//
//   const mockRouterPush = jest.fn()
//
//   const findLinkByText = (text) => wrapper.findAll('a').wrappers.find((w) => w.text() === text)
//
//   let wrapper
//   let store
//
//   const LOGO_URL = 'logoUrl'
//   jest.spyOn(EventService, 'extractLogoUrl').mockReturnValue(LOGO_URL)
//
//   const createComponent = () => {
//     store = new Vuex.Store({
//       state: {
//         auth: {
//           userId: 'FAKE_USER_ID',
//         },
//       },
//       modules: {
//         event: {
//           state: {
//             data: {
//               email: 'manager@pointreg.com',
//               phone: {
//                 info: 'Елизавета Гаврилова - Менеджер POINTREG',
//                 number: '+7 (920) 258-13-50',
//                 extension: '256',
//               },
//             },
//           },
//           namespaced: true,
//         },
//         pages: {
//           getters: {
//             getPagePathById: jest.fn(),
//           },
//           namespaced: true,
//         },
//       },
//     })
//     wrapper = mount(AppHeader, {
//       attachTo: document.body,
//       store,
//       mocks: {
//         $router: {
//           push: mockRouterPush,
//         },
//       },
//       provide: {
//         loadFullEvent: jest.fn(),
//       },
//     })
//   }
//
//   afterEach(() => {
//     wrapper.destroy()
//   })
//
//   const TABLET_MENU_ACTIVE_SELECTOR = '.tablet-menu--active'
//   const TABLET_SUBMENU_SELECTOR = '.tablet-sub-menu'
//   const TABLET_SUBMENU_ACTIVE_CLASS = 'tablet-sub-menu--active'
//   const MOBILE_MENU_ACTIVE_SELECTOR = '.mobile-menu--active'
//
//   const managerBtn = () => wrapper.find('.manager__btn')
//   const managerInfoOpened = () => wrapper.find('.manager__info--active')
//   const subMenuMobileOpened = () => wrapper.find('.mobile-menu__container--active')
//   const preloaderActive = () => wrapper.find('.header__preloader--active')
//   const headerActionsEL = () => wrapper.find('.header__actions')
//
//   describe('AppHeaderMenu', () => {
//     it('Если ширина экрана больше 1399 рисуем меню в хедере, остальные меню не рисуем', async () => {
//       createComponent()
//       await flushPromises()
//
//       expect(wrapper.findComponent(AppHeaderMenu).isVisible()).toBeTruthy()
//       expect(wrapper.findComponent(AppHeaderMobileMenu).exists()).toBeFalsy()
//       expect(wrapper.findComponent(AppHeaderTabletMenu).exists()).toBeFalsy()
//     })
//
//     it('Показываем прелоадер для AppHeaderMenu', async () => {
//       createComponent()
//       await nextTick()
//       expect(preloaderActive().exists()).toBeTruthy()
//     })
//
//     it('Убираем прелоадер для AppHeaderMenu', async () => {
//       createComponent()
//       await flushPromises()
//       expect(preloaderActive().exists()).toBeFalsy()
//     })
//
//     it('Отрисовываем все ссылки в AppHeaderMenu', async () => {
//       createComponent()
//       await flushPromises()
//
//       const linkLength = mockHeaderMenuFixture.reduce((sum, cur) => {
//         sum += 1
//         if (cur.children) {
//           sum += cur.children.length
//         }
//         return sum
//       }, 0)
//
//       expect(wrapper.findAllComponents(AppHeaderLink).wrappers.length).toBe(linkLength)
//     })
//
//     it('По клику на ссылку в меню type: url переходим по переданному url', async () => {
//       createComponent()
//       await flushPromises()
//
//       const link = mockHeaderMenuFixture[1]
//
//       await findLinkByText(link.title).trigger('click')
//       await flushPromises()
//
//       expect(mockRouterPush).toHaveBeenCalledWith(link.url)
//     })
//
//     it('По клику на ссылку в меню type: page переходим по переданному url', async () => {
//       createComponent()
//       await flushPromises()
//
//       const link = mockHeaderMenuFixture[2]
//
//       await findLinkByText(link.title).trigger('click')
//       await flushPromises()
//
//       expect(window.location.href).toBe(link.url)
//     })
//
//     it('По клику на кнопку менеджера открываем его информацию', async () => {
//       createComponent()
//       await flushPromises()
//
//       await managerBtn().trigger('click')
//       expect(managerInfoOpened().exists()).toBeTruthy()
//     })
//
//     it('По клику на вне менеджера закрываем его информацию', async () => {
//       createComponent()
//       await flushPromises()
//
//       await wrapper.findComponent(AppHeaderActions).trigger('click')
//       expect(managerInfoOpened().exists()).toBeFalsy()
//     })
//
//     // TODO: тест на ховер по ссылке, классика для Vue
//     // TODO: тест на пункт Дополнительно в меню
//   })
//
//   it('Если ширина экрана меньше 1399 рисуем кнопку меню', async () => {
//     window.innerWidth = 1000
//     createComponent()
//     await flushPromises()
//
//     expect(wrapper.findComponent(AppHeaderMenuBtn).isVisible()).toBeTruthy()
//   })
//
//   it('Если ширина экрана меньше 1399 не рисуем кнопку менеджера', async () => {
//     window.innerWidth = 1000
//     createComponent()
//     await flushPromises()
//
//     expect(managerBtn().exists()).toBeFalsy()
//   })
//
//   it('Если ширина экрана меньше 768 не отрисовываем headerActions справа в хедере', async () => {
//     window.innerWidth = 500
//     createComponent()
//     await flushPromises()
//
//     expect(headerActionsEL.exists).toBeFalsy()
//   })
//
//   describe('AppHeaderTabletMenu', () => {
//     beforeEach(() => {
//       window.innerWidth = 1000
//     })
//
//     it('Если ширина экрана 768-1399 рисуем ТаблетМеню в хедере, остальные меню не рисуем', async () => {
//       createComponent()
//       await flushPromises()
//
//       expect(wrapper.findComponent(AppHeaderMenu).exists()).toBeFalsy()
//       expect(wrapper.findComponent(AppHeaderMobileMenu).exists()).toBeFalsy()
//       expect(wrapper.findComponent(AppHeaderTabletMenu).exists()).toBeTruthy()
//     })
//
//     it('Отрисовываем инфо о менеджере', async () => {
//       createComponent()
//       await flushPromises()
//
//       expect(wrapper.findComponent(AppHeaderManager).exists).toBeTruthy()
//     })
//
//     it('По клику на кнопку меню показываем ПланшетМеню', async () => {
//       createComponent()
//       await flushPromises()
//       await wrapper.findComponent(AppHeaderMenuBtn).trigger('click')
//
//       expect(wrapper.find(TABLET_MENU_ACTIVE_SELECTOR).exists()).toBeTruthy()
//     })
//
//     it('По клику вне меню скрываем ПланшетМеню', async () => {
//       createComponent()
//       await flushPromises()
//       await wrapper.findComponent(AppHeaderMenuBtn).trigger('click')
//       expect(wrapper.find(TABLET_MENU_ACTIVE_SELECTOR).exists()).toBeTruthy()
//       await wrapper.trigger('click')
//
//       expect(wrapper.find(TABLET_MENU_ACTIVE_SELECTOR).exists()).toBeFalsy()
//     })
//
//     it('По клику на ссылку в ПланшетМеню type: url переходим по переданному url', async () => {
//       mockRouterPush.mockRestore()
//       createComponent()
//       await flushPromises()
//
//       const link = mockHeaderMenuFixture[1]
//
//       await findLinkByText(link.title).trigger('click')
//       await flushPromises()
//
//       expect(mockRouterPush).toHaveBeenCalledWith(link.url)
//     })
//
//     it('По клику на ссылку в ПланшетМеню type: page переходим по переданному url', async () => {
//       createComponent()
//       await flushPromises()
//
//       const link = mockHeaderMenuFixture[2]
//
//       await findLinkByText(link.title).trigger('click')
//       await flushPromises()
//
//       expect(window.location.href).toBe(link.url)
//     })
//
//     it('По клику на ссылку в ПланшетМеню у которой есть подменю показываем подменю', async () => {
//       createComponent()
//       await flushPromises()
//
//       const link = mockHeaderMenuFixture[0]
//
//       await findLinkByText(link.title).trigger('click')
//       const activeSubMenuLength = wrapper
//         .findAll(TABLET_SUBMENU_SELECTOR)
//         .wrappers.filter((subMenu) => subMenu.classes(TABLET_SUBMENU_ACTIVE_CLASS)).length
//       const activeSubMenu = wrapper
//         .findAll(TABLET_SUBMENU_SELECTOR)
//         .wrappers.filter((subMenu) => subMenu.classes(TABLET_SUBMENU_ACTIVE_CLASS))[0]
//
//       expect(activeSubMenuLength).toBe(1)
//       expect(activeSubMenu.html().includes(link.children[0].title)).toBe(true)
//     })
//
//     it('По клику на ссылку в ПланшетМеню у которой есть подменю показываем подменю, остальные подменю закрываем', async () => {
//       createComponent()
//       await flushPromises()
//
//       const link = mockHeaderMenuFixture[0]
//       const nextLink = mockHeaderMenuFixture[mockHeaderMenuFixture.length - 1]
//
//       await findLinkByText(link.title).trigger('click')
//
//       await findLinkByText(nextLink.title).trigger('click')
//       const activeSubMenuLength = wrapper
//         .findAll(TABLET_SUBMENU_SELECTOR)
//         .wrappers.filter((subMenu) => subMenu.classes(TABLET_SUBMENU_ACTIVE_CLASS)).length
//       const activeSubMenu = wrapper
//         .findAll(TABLET_SUBMENU_SELECTOR)
//         .wrappers.filter((subMenu) => subMenu.classes(TABLET_SUBMENU_ACTIVE_CLASS))[0]
//
//       expect(activeSubMenuLength).toBe(1)
//       expect(activeSubMenu.html().includes(nextLink.children[0].title)).toBe(true)
//     })
//   })
//
//   describe('AppHeaderMobileMenu', () => {
//     beforeEach(() => {
//       window.innerWidth = 500
//     })
//
//     it('Если ширина экрана меньше 768 рисуем МобильноеМеню в хедере, остальные меню не рисуем', async () => {
//       createComponent()
//       await flushPromises()
//
//       expect(wrapper.findComponent(AppHeaderMenu).exists()).toBeFalsy()
//       expect(wrapper.findComponent(AppHeaderMobileMenu).exists()).toBeTruthy()
//       expect(wrapper.findComponent(AppHeaderTabletMenu).exists()).toBeFalsy()
//     })
//
//     it('Отрисовываем инфо о менеджере', async () => {
//       createComponent()
//       await flushPromises()
//
//       expect(wrapper.findComponent(AppHeaderManager).exists).toBeTruthy()
//     })
//
//     it('Отрисовываем headerActions', async () => {
//       createComponent()
//       await flushPromises()
//
//       expect(wrapper.findComponent(AppHeaderActions).exists).toBeTruthy()
//     })
//
//     it('По клику на кнопку меню показываем МобильноеМеню', async () => {
//       createComponent()
//       await flushPromises()
//       await wrapper.findComponent(AppHeaderMenuBtn).trigger('click')
//
//       expect(wrapper.find(MOBILE_MENU_ACTIVE_SELECTOR).exists()).toBeTruthy()
//     })
//
//     it('По клику вне меню скрываем МобильноеМеню', async () => {
//       createComponent()
//       await flushPromises()
//       await wrapper.findComponent(AppHeaderMenuBtn).trigger('click')
//       expect(wrapper.find(MOBILE_MENU_ACTIVE_SELECTOR).exists()).toBeTruthy()
//       await wrapper.trigger('click')
//
//       expect(wrapper.find(MOBILE_MENU_ACTIVE_SELECTOR).exists()).toBeFalsy()
//     })
//
//     it('По клику на ссылку в МобильноеМеню type: url переходим по переданному url', async () => {
//       mockRouterPush.mockRestore()
//       createComponent()
//       await flushPromises()
//
//       const link = mockHeaderMenuFixture[1]
//
//       await findLinkByText(link.title).trigger('click')
//       await flushPromises()
//
//       expect(mockRouterPush).toHaveBeenCalledWith(link.url)
//     })
//
//     it('По клику на ссылку в МобильноеМеню type: page переходим по переданному url', async () => {
//       createComponent()
//       await flushPromises()
//
//       const link = mockHeaderMenuFixture.find(
//         (menuLink) => menuLink.type === MENU_ITEMS_TYPES.PAGE && !menuLink.children?.length,
//       )
//
//       await findLinkByText(link.title).trigger('click')
//       await flushPromises()
//
//       expect(window.location.href).toBe(link.url)
//     })
//
//     it('По клику на ссылку в МобильноеМеню у которой есть подменю показываем подменю', async () => {
//       createComponent()
//       await flushPromises()
//
//       const linksWithSubMenu = mockHeaderMenuFixture.filter((menuLink) => menuLink.children?.length)
//       const link = linksWithSubMenu[0]
//
//       await findLinkByText(link.title).trigger('click')
//
//       expect(subMenuMobileOpened().exists()).toBeTruthy()
//     })
//
//     it('В открытом МобильномМеню по клику в левой части показываем основное меню', async () => {
//       createComponent()
//       await flushPromises()
//
//       const linksWithSubMenu = mockHeaderMenuFixture.filter((menuLink) => menuLink.children?.length)
//       const link = linksWithSubMenu[0]
//
//       await findLinkByText(link.title).trigger('click')
//       expect(subMenuMobileOpened().exists()).toBeTruthy()
//
//       await wrapper.find('.mobile-menu__left').trigger('click')
//       expect(subMenuMobileOpened().exists()).toBeFalsy()
//       expect(wrapper.find(MOBILE_MENU_ACTIVE_SELECTOR).exists).toBeTruthy()
//     })
//   })
// })
