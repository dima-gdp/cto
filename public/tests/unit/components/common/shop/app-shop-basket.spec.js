import AppShopBasket from '@/components/common/shop/app-shop-basket'
import { shallowMount } from '@vue/test-utils'
import Vue from 'vue'
import Vuex from 'vuex'
import { mockShopFixture } from '@/api/mocs/api-shop-mock'
import ShopService from '@/domain/services/shop-service'
import iview from '@/assets/vendor/view-design/src'
import Alert from '@/assets/vendor/view-design/src/components/alert/alert.vue'
import Button from '@/assets/vendor/view-design/src/components/button/button.vue'
import i18n from '@/plugins/i18n'
import { TIME_STATUSES } from '@/utils/constants'
import Feather from '@/assets/vendor/vue-feather/src/feather.vue'
import { EMPTY_LOCALE_MESSAGE } from '@/plugins/i18n'

Vue.use(iview)
Vue.use(Vuex)

const mockClearBasket = jest.fn()
const mockRouterPush = jest.fn()
const mockSuccessMessage = jest.fn()

const I18N_KEYS = {
  'shop.orderBar.selected': 'shop.orderBar.selected',
  'shop.orderBar.product': 'shop.orderBar.product',
  'shop.orderBar.sum': 'shop.orderBar.sum',
  'shop.btn.makeOrder': 'shop.btn.makeOrder',
}

const mock$tr = jest.fn().mockImplementation((key) => {
  return I18N_KEYS[key] || EMPTY_LOCALE_MESSAGE
})

describe('@/components/common/shop/app-shop-basket.vue', () => {
  const BASKET = [
    {
      product: {
        id: '4',
        name: 'тестовый товар 2 ',
        type: 'ticket',
        description: 'a',
        storeId: 2,
        sort: 101,
        price: 15000,
        currency: 'RUB',
        priceRub: 15000,
        isCurrencyAllowed: false,
        isRateBlocked: false,
        settings: [],
        active: true,
        limitCount: null,
        sellingCount: null,
        orderLimitCount: null,
        sellingStartedAt: null,
        sellingClosedAt: null,
        sellingTimeStatus: 'during',
      },
      amount: 1,
    },
  ]

  let wrapper
  let store

  const createComponent = ({ shop, productsInBasket }) => {
    store = new Vuex.Store({
      modules: {
        shop: {
          namespaced: true,
          state: {
            productsInBasket,
          },
          mutations: {
            CLEAR_BASKET: mockClearBasket,
          },
        },
      },
    })

    wrapper = shallowMount(AppShopBasket, {
      store,
      i18n,
      propsData: {
        shop,
      },
      mocks: {
        $route: {
          path: '/event/1/store',
        },
        $router: {
          push: mockRouterPush,
        },
        $Message: {
          success: mockSuccessMessage,
        },
      },
      stubs: {
        Alert,
        Feather,
      },
      mixins: [
        {
          methods: {
            $tr: mock$tr,
          },
        },
      ],
    })
  }

  afterEach(() => {
    wrapper.destroy()
  })

  it('Если корзина пуста, то не отрисовываем компонент', async () => {
    createComponent({ shop: mockShopFixture, productsInBasket: [] })

    expect(wrapper.isVisible()).toBeFalsy()
  })

  it('Отрисовываем корзину, если она не пустая', async () => {
    createComponent({ shop: mockShopFixture, productsInBasket: BASKET })

    expect(wrapper.isVisible()).toBeTruthy()
  })

  it('Выводим текст из i18n для суммы заказа', async () => {
    createComponent({ shop: mockShopFixture, productsInBasket: BASKET })

    expect(wrapper.html().includes(I18N_KEYS['shop.orderBar.sum'])).toBe(true)
  })

  describe('Alert', () => {
    it('Отрисовываем алерт, если продажи не разрешены по времени', async () => {
      createComponent({
        shop: { sellingTimeStatus: TIME_STATUSES.ENDED },
        productsInBasket: BASKET,
      })

      const AlertComponent = wrapper.findComponent(Alert)

      expect(AlertComponent.isVisible()).toBeTruthy()
    })

    it('Передает в компонент Alert type: warning, если продажи окончены', async () => {
      createComponent({
        shop: { ...mockShopFixture, sellingTimeStatus: TIME_STATUSES.ENDED },
        productsInBasket: BASKET,
      })

      const AlertComponent = wrapper.findComponent(Alert)

      expect(AlertComponent.props('type')).toBe('warning')
    })

    it('Передает в компонент Alert type: success, если продажи не окончены', async () => {
      createComponent({
        shop: { ...mockShopFixture, sellingTimeStatus: TIME_STATUSES.WILL_START },
        productsInBasket: BASKET,
      })

      const AlertComponent = wrapper.findComponent(Alert)

      expect(AlertComponent.props('type')).toBe('success')
    })

    it('Передает в компонент Alert banner: true', async () => {
      createComponent({
        shop: { ...mockShopFixture, sellingTimeStatus: TIME_STATUSES.WILL_START },
        productsInBasket: BASKET,
      })

      const AlertComponent = wrapper.findComponent(Alert)

      expect(AlertComponent.props('banner')).toBe(true)
    })

    it('Передает в default slot компонента Alert текст', async () => {
      const ALERT_SLOT_TEXT = 'Временной статус магазина'
      jest.spyOn(ShopService, 'getShopDateStatusMessage').mockReturnValue(ALERT_SLOT_TEXT)

      createComponent({
        shop: { ...mockShopFixture, sellingTimeStatus: TIME_STATUSES.WILL_START },
        productsInBasket: BASKET,
      })
      const AlertComponentSlotText = wrapper.findComponent(Alert).vm.$slots.default[0].text

      expect(AlertComponentSlotText.trim()).toBe(ALERT_SLOT_TEXT)
    })

    it('Не отрисовываем алерт, если продажи разрешены по времени', async () => {
      createComponent({ shop: mockShopFixture, productsInBasket: BASKET })

      const AlertComponent = wrapper.findComponent(Alert)

      expect(AlertComponent.exists()).toBeFalsy()
    })
  })

  describe('Кнопка "Оформить заказ"', () => {
    it('Не отрисовываем кнопку "Оформить заказ", если продажи не разрешены по времени', async () => {
      createComponent({
        shop: { ...mockShopFixture, sellingTimeStatus: TIME_STATUSES.WILL_START },
        productsInBasket: BASKET,
      })

      const ButtonComponent = wrapper.findComponent(Button)

      expect(ButtonComponent.exists()).toBeFalsy()
    })

    it('Отрисовываем кнопку "Оформить заказ", если продажи разрешены по времени', async () => {
      createComponent({ shop: mockShopFixture, productsInBasket: BASKET })

      const ButtonComponent = wrapper.findComponent(Button)

      expect(ButtonComponent.isVisible()).toBeTruthy()
    })

    it('Передаем в кнопку "Оформить заказ" соответствующий текст из i18n', async () => {
      createComponent({ shop: mockShopFixture, productsInBasket: BASKET })

      const ButtonComponent = wrapper.findComponent(Button)

      expect(ButtonComponent.vm.$slots.default[0].text.trim()).toBe(I18N_KEYS['shop.btn.makeOrder'])
    })

    it('Передаем type: "primary" в компонент кнопки "Оформить заказ"', async () => {
      createComponent({ shop: mockShopFixture, productsInBasket: BASKET })

      const ButtonComponent = wrapper.findComponent(Button)

      expect(ButtonComponent.props('type')).toBe('primary')
    })

    it('По клику на кнопку "Оформить заказ" емитим событие "create-order" на вверх', async () => {
      createComponent({ shop: mockShopFixture, productsInBasket: BASKET })

      const ButtonComponent = wrapper.findComponent(Button)
      await ButtonComponent.vm.$emit('click')

      expect(wrapper.emitted('create-order')).toBeTruthy()
    })
  })

  it('По клику на кнопку "Очистить корзину", вызываем мутацию CLEAR_BASKET', async () => {
    createComponent({ shop: mockShopFixture, productsInBasket: BASKET })

    const ClearProductsIcon = wrapper
      .findAllComponents(Feather)
      .wrappers.filter((feather) => feather.props('type') === 'x')[0]

    await ClearProductsIcon.vm.$emit('click')

    expect(mockClearBasket).toHaveBeenCalledWith(store.state.shop, undefined)
    mockClearBasket.mockRestore()
  })

  //TODO: Написать тесты на верстку, у которой html меняется в зависимости от размера экрана
})
