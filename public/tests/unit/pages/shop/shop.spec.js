import { shallowMount } from '@vue/test-utils'
import Vue from 'vue'
import Vuex from 'vuex'
import Shop from '@/pages/shop/shop.vue'
import { flushPromises } from '@/utils'
import {
  mockCurrenciesFixture,
  mockProductsFixture,
  mockShopFixture,
  mockShopFixtureWithoutDescription,
  mockCreateOrderFixture,
} from '@/api/mocs/api-shop-mock'
import ShopService from '@/domain/services/shop-service'
import iview from '@/assets/vendor/view-design/src'
import AppProductCard from '@/components/common/app-product-card'
import AppShopBasket from '@/components/common/shop/app-shop-basket'
import AppInfoBlock from '@/components/common/app-info-block'
import AppMarkdown from '@/components/common/app-markdown'
import Alert from '@/assets/vendor/view-design/src/components/alert/alert.vue'
import i18n from '@/plugins/i18n'
import { TIME_STATUSES } from '@/utils/constants'

Vue.use(iview)
Vue.use(Vuex)

const mockGetEventStore = jest.fn()
const mockGetProducts = jest.fn().mockResolvedValue(mockProductsFixture)
const mockGetCurrencies = jest.fn().mockResolvedValue(mockCurrenciesFixture)
const mockIsSomeTicketSelected = jest.fn()
const mockCreateOrder = jest.fn()
const mockRouterPush = jest.fn()
const mockSuccessMessage = jest.fn()
const mockErrorMessage = jest.fn()
// Моки мутаций
const mockUpdateAmountBasket = jest.fn()
const mockClearBasket = jest.fn()
const mockSetCurrencies = jest.fn()

jest.mock('@/domain/composables/shop/use-shop', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    getEventStore: mockGetEventStore,
    getProducts: mockGetProducts,
    getCurrencies: mockGetCurrencies,
    createOrder: mockCreateOrder,
  })),
}))

process.env.NODE_ENV = 'test'

describe('@/pages/shop/shop.vue', () => {
  const SHOP_MESSAGE = 'Продажа билетов закончится 21 декабря 2021 г.'
  const TYPES_PRODUCT = {
    TICKET: 'ticket',
    OTHER: 'other',
  }
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
  const ORDERS_FOR_CREATE_ORDER = [
    {
      id: '4',
      count: 1,
    },
  ]
  const SHOP_ID = 10
  const CURRENT_EVENT_ID = 1

  const CHANGE_AMOUNT_PAYLOAD_TICKET_ITEM = {
    newAmount: 1,
    orderItem: {
      amount: 0,
      product: {
        active: true,
        currency: 'RUB',
        description:
          'максимальная длина описания товара - 255 символов .  максимальная длина описания товара - 255 символов . максимальная длина описания товара - 255 символов . максимальная длина описания товара - 255 символов . максимальная длина описания товара - 255 симво',
        id: '4',
        isCurrencyAllowed: false,
        isRateBlocked: false,
        limitCount: null,
        name: 'тестовый товар 2',
        orderLimitCount: null,
        price: 15000,
        priceRub: 15000,
        sellingClosedAt: null,
        sellingCount: null,
        sellingStartedAt: null,
        sellingTimeStatus: 'during',
        settings: [],
        sort: 101,
        storeId: 2,
        type: 'ticket',
      },
    },
  }
  const CHANGE_AMOUNT_PAYLOAD_OTHER_ITEM = {
    newAmount: 1,
    orderItem: {
      amount: 0,
      product: {
        active: true,
        currency: 'RUB',
        description: 'ура товарищи! айтишник может создавать товары',
        id: '7',
        isCurrencyAllowed: false,
        isRateBlocked: false,
        limitCount: null,
        name: 'тестовый товар',
        orderLimitCount: null,
        price: 182,
        priceRub: 182,
        sellingClosedAt: '2021-12-20T00:00:00+0300',
        sellingCount: null,
        sellingStartedAt: null,
        sellingTimeStatus: 'during',
        settings: [],
        sort: 101,
        storeId: 2,
        type: 'other',
      },
    },
  }

  let wrapper
  let store

  jest.spyOn(ShopService, 'getShopDateStatusMessage').mockReturnValue(SHOP_MESSAGE)

  const createComponent = (productsInBasket = []) => {
    store = new Vuex.Store({
      modules: {
        shop: {
          namespaced: true,
          state: {
            productsInBasket,
            currencies: [],
          },
          mutations: {
            SET_CURRENCIES: mockSetCurrencies,
            CLEAR_BASKET: mockClearBasket,
            UPDATE_AMOUNT_IN_BASKET: mockUpdateAmountBasket,
          },
          getters: {
            shopId: () => SHOP_ID,
            isSomeTicketSelected: () => mockIsSomeTicketSelected,
          },
        },
        event: {
          namespaced: true,
          getters: {
            currentEventId: () => CURRENT_EVENT_ID,
          },
        },
      },
    })

    wrapper = shallowMount(Shop, {
      store,
      i18n,
      mocks: {
        $route: {
          path: '/event/1/store',
        },
        $router: {
          push: mockRouterPush,
        },
        $Message: {
          success: mockSuccessMessage,
          error: mockErrorMessage,
        },
      },
      stubs: {
        AppInfoBlock,
        Alert,
      },
    })
  }

  afterEach(() => {
    wrapper.destroy()
  })

  it('Устанавливает валюту', async () => {
    mockGetEventStore.mockResolvedValue(mockShopFixture)

    createComponent()
    await flushPromises()

    expect(mockSetCurrencies).toHaveBeenCalledWith(store.state.shop, mockCurrenciesFixture)

    mockSetCurrencies.mockRestore()
  })

  describe('AppInfoBlock', () => {
    it('Если есть магазин, то отрисовываем компонент AppInfoBlock', async () => {
      mockGetEventStore.mockResolvedValue(mockShopFixture)

      createComponent()
      await flushPromises()
      const InfoBlock = wrapper.findComponent(AppInfoBlock)

      expect(InfoBlock.isVisible()).toBeTruthy()
    })

    it('В компонент AppInfoBlock передаем описание', async () => {
      mockGetEventStore.mockResolvedValue(mockShopFixture)

      createComponent()
      await flushPromises()
      const InfoBlock = wrapper.findComponent(AppInfoBlock)

      expect(InfoBlock.props('description')).toBe(mockShopFixture.description)
    })

    it('В компонент AppInfoBlock передаем  лимит текста', async () => {
      const LIMIT_TEXT = 85
      mockGetEventStore.mockResolvedValue(mockShopFixture)

      createComponent()
      await flushPromises()
      const InfoBlock = wrapper.findComponent(AppInfoBlock)

      expect(InfoBlock.props('limit')).toBe(LIMIT_TEXT)
    })

    it('Если нет магазина, то не отрисовываем компонент AppInfoBlock', async () => {
      mockGetEventStore.mockResolvedValue(null)

      createComponent()
      await flushPromises()

      expect(wrapper.findComponent(AppInfoBlock).exists()).toBeFalsy()
    })

    describe('AppMarkdown', () => {
      it('Если есть информация о магазине, то отрисовываем компонент AppMarkdown', async () => {
        mockGetEventStore.mockResolvedValue(mockShopFixture)

        createComponent()
        await flushPromises()
        const AppMarkdownComponent = wrapper.findComponent(AppMarkdown)

        expect(AppMarkdownComponent.isVisible()).toBeTruthy()
      })

      it('Если нет информации о магазине, то не отрисовываем ее', async () => {
        mockGetEventStore.mockResolvedValue(mockShopFixtureWithoutDescription)

        createComponent()
        await flushPromises()

        expect(wrapper.findComponent(AppMarkdown).exists()).toBeFalsy()
      })

      it('В компонент AppMarkdown передаем описание', async () => {
        mockGetEventStore.mockResolvedValue(mockShopFixture)

        createComponent()
        await flushPromises()
        const AppMarkdownComponent = wrapper.findComponent(AppMarkdown)

        expect(AppMarkdownComponent.props('text')).toBe(mockShopFixture.description)
      })
    })

    describe('Alert', () => {
      it('Если есть магазин, отрисовывает компонент Alert', async () => {
        mockGetEventStore.mockResolvedValue(mockShopFixture)

        createComponent()
        await flushPromises()
        const AlertComponent = wrapper.findComponent(Alert)

        expect(AlertComponent.isVisible()).toBeTruthy()
      })

      it('Передает в Alert banner: true', async () => {
        mockGetEventStore.mockResolvedValue(mockShopFixture)

        createComponent()
        await flushPromises()
        const AlertComponent = wrapper.findComponent(Alert)

        expect(AlertComponent.props('banner')).toBe(true)
      })

      it('Передает в Alert type: warning, если продажи окончены', async () => {
        mockGetEventStore.mockResolvedValue({
          ...mockShopFixture,
          sellingTimeStatus: TIME_STATUSES.ENDED,
        })

        createComponent()
        await flushPromises()
        const AlertComponent = wrapper.findComponent(Alert)

        expect(AlertComponent.props('type')).toBe('warning')
      })

      it('Передает в Alert type: success, если продажи окончены', async () => {
        mockGetEventStore.mockResolvedValue({
          ...mockShopFixture,
          sellingTimeStatus: TIME_STATUSES.WILL_START,
        })

        createComponent()
        await flushPromises()
        const AlertComponent = wrapper.findComponent(Alert)

        expect(AlertComponent.props('type')).toBe('success')
      })

      it('Передает в default slot компонента Alert текст', async () => {
        mockGetEventStore.mockResolvedValue(mockShopFixture)

        createComponent()
        await flushPromises()
        const AlertComponentSlotText = wrapper.findComponent(Alert).vm.$slots.default[0].text

        expect(AlertComponentSlotText.trim()).toBe(SHOP_MESSAGE)
      })
    })
  })

  describe('AppProductCard', () => {
    it('Если прилетели товары типа - билет, то отрисовываем их(AppProductCard) в количестве, прилетевшем с апи', async () => {
      mockGetEventStore.mockResolvedValue(mockShopFixture)

      createComponent()
      await flushPromises()
      const ticketsLength = wrapper
        .findAllComponents(AppProductCard)
        .wrappers.filter((ticket) => ticket.props('product').type === TYPES_PRODUCT.TICKET).length

      expect(ticketsLength).toBe(mockProductsFixture.tickets.length)
    })

    it('Передаем пропсами товар(типа - билет) в компонент, который их отрисовывает(AppProductCard)', async () => {
      mockGetEventStore.mockResolvedValue(mockShopFixture)

      createComponent()
      await flushPromises()
      const tickets = wrapper
        .findAllComponents(AppProductCard)
        .wrappers.filter((ticket) => ticket.props('product').type === TYPES_PRODUCT.TICKET)

      expect(tickets[0].props('product')).toEqual(mockProductsFixture.tickets[0])
    })

    it('Если компонент товара(типа - билет) сгенерировал событие change-amount, то вызываем мутацию UpdateAmountBasket', async () => {
      mockGetEventStore.mockResolvedValue(mockShopFixture)

      createComponent()
      await flushPromises()
      const Ticket = wrapper
        .findAllComponents(AppProductCard)
        .wrappers.filter((ticket) => ticket.props('product').type === TYPES_PRODUCT.TICKET)[0]

      await Ticket.vm.$emit('change-amount', 1)
      await flushPromises()

      expect(mockUpdateAmountBasket).toHaveBeenCalledWith(
        store.state.shop,
        CHANGE_AMOUNT_PAYLOAD_TICKET_ITEM,
      )

      mockUpdateAmountBasket.mockRestore()
    })

    it('Если компонент товара(типа - другое) сгенерировал событие change-amount, то вызываем мутацию UpdateAmountBasket', async () => {
      mockGetEventStore.mockResolvedValue(mockShopFixture)

      createComponent()
      await flushPromises()
      const Other = wrapper
        .findAllComponents(AppProductCard)
        .wrappers.filter((ticket) => ticket.props('product').type === TYPES_PRODUCT.OTHER)[0]

      await Other.vm.$emit('change-amount', 1)
      await flushPromises()

      expect(mockUpdateAmountBasket).toHaveBeenCalledWith(
        store.state.shop,
        CHANGE_AMOUNT_PAYLOAD_OTHER_ITEM,
      )

      mockUpdateAmountBasket.mockRestore()
    })

    it('Если прилетели товары типа - другое, то отрисовываем их(AppProductCard) в количестве, прилетевшем с апи', async () => {
      mockGetEventStore.mockResolvedValue(mockShopFixture)

      createComponent()
      await flushPromises()
      const othersLength = wrapper
        .findAllComponents(AppProductCard)
        .wrappers.filter((ticket) => ticket.props('product').type === TYPES_PRODUCT.OTHER).length

      expect(othersLength).toBe(mockProductsFixture.others.length)
    })

    it('Передаем пропсами товар(типа - другое) в компонент, который их отрисовывает(AppProductCard)', async () => {
      mockGetEventStore.mockResolvedValue(mockShopFixture)

      createComponent()
      await flushPromises()
      const others = wrapper
        .findAllComponents(AppProductCard)
        .wrappers.filter((ticket) => ticket.props('product').type === TYPES_PRODUCT.OTHER)

      expect(others[0].props('product')).toEqual(mockProductsFixture.others[0])
    })
  })

  describe('AppShopBasket', () => {
    it('Передает в компонент корзины(AppShopBasket) объект магазина', async () => {
      mockGetEventStore.mockResolvedValue(mockShopFixture)

      createComponent()
      await flushPromises()

      expect(wrapper.findComponent(AppShopBasket).props('shop')).toEqual(mockShopFixture)
    })

    it('При получении события снизу create-order cоздаем заказ', async () => {
      mockGetEventStore.mockResolvedValue(mockShopFixture)
      mockCreateOrder.mockResolvedValue(mockCreateOrderFixture)

      createComponent(BASKET)
      await flushPromises()
      await wrapper.findComponent(AppShopBasket).vm.$emit('create-order')

      expect(mockCreateOrder).toHaveBeenCalledWith(ORDERS_FOR_CREATE_ORDER, SHOP_ID)

      mockCreateOrder.mockRestore()
    })

    it('Если заказ создан успешно, то выводим сообщение сверху (Alert)', async () => {
      mockSuccessMessage.mockRestore()
      mockGetEventStore.mockResolvedValue(mockShopFixture)
      mockCreateOrder.mockResolvedValue(mockCreateOrderFixture)

      createComponent(BASKET)
      await flushPromises()

      await wrapper.findComponent(AppShopBasket).vm.$emit('create-order')
      await flushPromises()

      expect(mockSuccessMessage).toHaveBeenCalled()
    })

    it('Если заказ создан успешно, то очищаем корзину', async () => {
      mockClearBasket.mockRestore()
      mockGetEventStore.mockResolvedValue(mockShopFixture)
      mockCreateOrder.mockResolvedValue(mockCreateOrderFixture)

      createComponent(BASKET)
      await flushPromises()

      await wrapper.findComponent(AppShopBasket).vm.$emit('create-order')
      await flushPromises()

      expect(mockClearBasket).toHaveBeenCalledWith(store.state.shop, undefined)
    })

    it('Если заказ создан успешно, то отправляем пользователя на страницу заказа', async () => {
      mockRouterPush.mockRestore()
      mockGetEventStore.mockResolvedValue(mockShopFixture)
      mockCreateOrder.mockResolvedValue(mockCreateOrderFixture)

      createComponent(BASKET)
      await flushPromises()

      await wrapper.findComponent(AppShopBasket).vm.$emit('create-order')
      await flushPromises()

      expect(mockRouterPush).toHaveBeenCalledWith({
        path: `/event/${CURRENT_EVENT_ID}/orders/${mockCreateOrderFixture.id}`,
        query: { lang: 'ru' },
      })
    })

    it('Если в момент заказа произошла ошибка, и у ошибки есть поле message, то выводим сообщение сверху(Alert)', async () => {
      const createOrderError = {
        message: 'message',
      }
      mockGetEventStore.mockResolvedValue(mockShopFixture)
      mockCreateOrder.mockRejectedValue(createOrderError)

      createComponent(BASKET)
      await flushPromises()

      await wrapper.findComponent(AppShopBasket).vm.$emit('create-order')
      await flushPromises()

      expect(mockErrorMessage).toHaveBeenCalledWith(createOrderError.message)
    })

    it('Если в момент заказа произошла ошибка, и у ошибки нет поля message, то не выводим сообщение сверху(Alert)', async () => {
      mockErrorMessage.mockRestore()
      const createOrderError = {
        not_message: 'Its not a message',
      }
      mockGetEventStore.mockResolvedValue(mockShopFixture)
      mockCreateOrder.mockRejectedValue(createOrderError)

      createComponent(BASKET)
      await flushPromises()
      await wrapper.findComponent(AppShopBasket).vm.$emit('create-order')
      await flushPromises()

      expect(mockErrorMessage).not.toHaveBeenCalled()
    })

    it('Если в момент заказа произошла ошибка, выводим ее в консоль', async () => {
      const createOrderError = {
        message: 'message',
      }
      const spyConsoleError = jest.spyOn(console, 'error')
      mockGetEventStore.mockResolvedValue(mockShopFixture)
      mockCreateOrder.mockRejectedValue(createOrderError)

      createComponent(BASKET)
      await flushPromises()
      await wrapper.findComponent(AppShopBasket).vm.$emit('create-order')
      await flushPromises()

      expect(spyConsoleError).toHaveBeenCalledWith(createOrderError)
      spyConsoleError.mockRestore()
    })
  })
})
