import AppProductCard from '@/components/common/app-product-card'
import { shallowMount } from '@vue/test-utils'
import Vue from 'vue'
import Vuex from 'vuex'
import ShopService from '@/domain/services/shop-service'
import iview from '@/assets/vendor/view-design/src'
import Button from '@/assets/vendor/view-design/src/components/button/button.vue'
import { mockProductsFixture } from '@/api/mocs/api-shop-mock'
import AppTextEllipsis from '@/components/common/app-text-ellipsis'
import AppShopPriceView from '@/components/common/shop/app-shop-price-view'
import AppShopAppBasketIcon from '@/components/common/shop/app-shop-basket-icon'
import InputNumber from '@/assets/vendor/view-design/src/components/input-number/input-number.vue'
import { EMPTY_LOCALE_MESSAGE } from '@/plugins/i18n'

Vue.use(iview)
Vue.use(Vuex)

const I18N_KEYS = {
  'shop.btn.delete': 'shop.btn.delete',
  'shop.btn.order': 'shop.btn.order',
  'shop.product.inBasket': 'shop.product.inBasket',
  'shop.product.available': 'shop.product.available',
  'shop.product.ticket.alreadySelected': 'shop.product.ticket.alreadySelected',
  'shop.product.other.outOfStock': 'shop.product.other.outOfStock',
}

const mockRouterPush = jest.fn()
const mockSuccessMessage = jest.fn()

const mock$tr = jest.fn().mockImplementation((key) => {
  return I18N_KEYS[key] || EMPTY_LOCALE_MESSAGE
})

describe('@/components/common/shop/app-shop-basket.vue', () => {
  const TICKET = mockProductsFixture.tickets[0]
  const OTHER = mockProductsFixture.others[0]

  let wrapper
  let store

  const createComponent = ({ product, productsInBasket, isSomeTicketSelected }) => {
    store = new Vuex.Store({
      modules: {
        shop: {
          namespaced: true,
          state: {
            productsInBasket,
          },
          getters: {
            isSomeTicketSelected: () => isSomeTicketSelected,
          },
        },
      },
    })

    wrapper = shallowMount(AppProductCard, {
      store,
      propsData: {
        product,
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
      mixins: [
        {
          methods: {
            $tr: mock$tr,
          },
        },
      ],
    })
  }

  const getProductCardBottomHTML = () => wrapper.find('.shop-ticket__bottom-info').html()

  afterEach(() => {
    wrapper.destroy()
  })

  describe('AppTextEllipsis', () => {
    it('Отрисовывает заголовок товара', () => {
      createComponent({ product: TICKET, productsInBasket: [], isSomeTicketSelected: false })
      const TitleComponent = wrapper
        .findAllComponents(AppTextEllipsis)
        .wrappers.filter((el) => el.props('text') === TICKET.name)[0]

      expect(TitleComponent.isVisible()).toBeTruthy()
    })

    it('Передает компоненту заголовка товара(AppTextEllipsis) lines: 2', () => {
      createComponent({ product: TICKET, productsInBasket: [], isSomeTicketSelected: false })
      const TitleComponent = wrapper
        .findAllComponents(AppTextEllipsis)
        .wrappers.filter((el) => el.props('text') === TICKET.name)[0]

      expect(TitleComponent.props('lines')).toBe(2)
    })

    it('Отрисовывает описание товара', () => {
      createComponent({ product: TICKET, productsInBasket: [], isSomeTicketSelected: false })
      const DescriptionComponent = wrapper
        .findAllComponents(AppTextEllipsis)
        .wrappers.filter((el) => el.props('text') === TICKET.description)[0]

      expect(DescriptionComponent.isVisible()).toBeTruthy()
    })

    it('Передает компоненту описания товара(AppTextEllipsis) lines: 2', () => {
      createComponent({ product: TICKET, productsInBasket: [], isSomeTicketSelected: false })
      const DescriptionComponent = wrapper
        .findAllComponents(AppTextEllipsis)
        .wrappers.filter((el) => el.props('text') === TICKET.description)[0]

      expect(DescriptionComponent.props('lines')).toBe(2)
    })
  })

  describe('AppShopPriceView', () => {
    it('Отрисовывает цену(AppShopPriceView)', () => {
      createComponent({ product: TICKET, productsInBasket: [], isSomeTicketSelected: false })

      expect(wrapper.findComponent(AppShopPriceView).isVisible()).toBeTruthy()
    })

    it('Передает в AppShopPriceView currency продукта)', () => {
      createComponent({ product: TICKET, productsInBasket: [], isSomeTicketSelected: false })

      const PriceComponent = wrapper.findComponent(AppShopPriceView)
      expect(PriceComponent.props('currency')).toBe(TICKET.currency)
    })

    it('Передает в AppShopPriceView price продукта)', () => {
      createComponent({ product: TICKET, productsInBasket: [], isSomeTicketSelected: false })

      const PriceComponent = wrapper.findComponent(AppShopPriceView)
      expect(PriceComponent.props('price')).toBe(TICKET.price)
    })

    it('Передает в AppShopPriceView price-rub продукта)', () => {
      createComponent({ product: TICKET, productsInBasket: [], isSomeTicketSelected: false })

      const PriceComponent = wrapper.findComponent(AppShopPriceView)
      expect(PriceComponent.props('priceRub')).toBe(TICKET.priceRub)
    })
  })

  describe('Если товар является ticket', () => {
    it('Если товар является ticket, то отрисовываем кнопку купить/удалить', () => {
      createComponent({ product: TICKET, productsInBasket: [], isSomeTicketSelected: false })

      expect(wrapper.findComponent(Button).isVisible()).toBeTruthy()
    })

    it('Если товар является ticket, и текущий товар выбран то в кнопку удалить передаем соответствующий текст из i18n', () => {
      jest.spyOn(ShopService, 'isItemAlreadySelected').mockReturnValue(true)
      createComponent({ product: TICKET, productsInBasket: [], isSomeTicketSelected: false })

      expect(wrapper.findComponent(Button).vm.$slots.default[0].text.trim()).toBe(
        I18N_KEYS['shop.btn.delete'],
      )
    })

    it('Если товар является ticket, и текущий товар не выбран то в кнопку добавить передаем соответствующий текст из i18n', () => {
      jest.spyOn(ShopService, 'isItemAlreadySelected').mockReturnValue(false)
      createComponent({ product: TICKET, productsInBasket: [], isSomeTicketSelected: false })

      expect(wrapper.findComponent(Button).vm.$slots.default[0].text.trim()).toBe(
        I18N_KEYS['shop.btn.order'],
      )
    })

    it('Передаем в кнопку купить/удалить long: true', () => {
      createComponent({ product: TICKET, productsInBasket: [], isSomeTicketSelected: true })

      expect(wrapper.findComponent(Button).props('long')).toBe(true)
    })

    it('Если добавили тикет в корзину, и это не текущий тикет, то блокируем кнопку купить/удалить', () => {
      jest.spyOn(ShopService, 'isItemAlreadySelected').mockReturnValue(false)
      createComponent({ product: TICKET, productsInBasket: [], isSomeTicketSelected: true })

      expect(wrapper.findComponent(Button).props('disabled')).toBe(true)
    })

    it('Если добавили тикет в корзину, и это не текущий тикет, то передаем type: primary в кнопку купить/удалить', () => {
      jest.spyOn(ShopService, 'isItemAlreadySelected').mockReturnValue(false)
      createComponent({ product: TICKET, productsInBasket: [], isSomeTicketSelected: true })

      expect(wrapper.findComponent(Button).props('type')).toBe('primary')
    })

    it('Если добавили тикет в корзину, и это текущий тикет, то передаем type: error в кнопку купить/удалить', () => {
      jest.spyOn(ShopService, 'isItemAlreadySelected').mockReturnValue(true)
      createComponent({ product: TICKET, productsInBasket: [], isSomeTicketSelected: true })

      expect(wrapper.findComponent(Button).props('type')).toBe('error')
    })

    it('Если добавили тикет в корзину, и это текущий тикет, то по клику на кнопку удалить, емитим событие change-amount с нулем', async () => {
      jest.spyOn(ShopService, 'isItemAlreadySelected').mockReturnValue(true)
      createComponent({ product: TICKET, productsInBasket: [], isSomeTicketSelected: true })
      await wrapper.findComponent(Button).vm.$emit('click')

      expect(wrapper.emitted('change-amount')[0][0]).toBe(0)
    })

    it('Если добавили тикет в корзину, и это не текущий тикет, то по клику на кнопку удалить, емитим событие change-amount c единицей', async () => {
      jest.spyOn(ShopService, 'isItemAlreadySelected').mockReturnValue(false)
      createComponent({ product: TICKET, productsInBasket: [], isSomeTicketSelected: true })
      await wrapper.findComponent(Button).vm.$emit('click')

      expect(wrapper.emitted('change-amount')[0][0]).toBe(1)
    })

    describe('shop-ticket__bottom-info', () => {
      it('Если товар является ticket, и не один тикет не в корзине, и количество товара не бесконечное', () => {
        const AVAILABLE_REMAINS = 5
        jest.spyOn(ShopService, 'getRemainsByProduct').mockReturnValue(AVAILABLE_REMAINS)
        jest.spyOn(ShopService, 'isItemAlreadySelected').mockReturnValue(false)
        createComponent({ product: TICKET, productsInBasket: [], isSomeTicketSelected: false })

        expect(getProductCardBottomHTML()).toMatchSnapshot()
      })

      it('Если товар является ticket, и текущий товар в корзине, и количество товара не бесконечное', () => {
        const AVAILABLE_REMAINS = 5
        jest.spyOn(ShopService, 'getRemainsByProduct').mockReturnValue(AVAILABLE_REMAINS)
        jest.spyOn(ShopService, 'isItemAlreadySelected').mockReturnValue(true)
        createComponent({ product: TICKET, productsInBasket: [], isSomeTicketSelected: true })

        expect(getProductCardBottomHTML()).toMatchSnapshot()
      })

      it('Если товар является ticket, и текущий товар в корзине, и количество товара бесконечное', () => {
        const INFINITY_REMAINS = Infinity
        jest.spyOn(ShopService, 'isItemAlreadySelected').mockReturnValue(true)
        jest.spyOn(ShopService, 'getRemainsByProduct').mockReturnValue(INFINITY_REMAINS)
        createComponent({ product: TICKET, productsInBasket: [], isSomeTicketSelected: true })

        expect(getProductCardBottomHTML()).toMatchSnapshot()
      })

      it('Если товар является ticket, и текущий товар не в корзине, и какой-то тикет в корзине', () => {
        jest.spyOn(ShopService, 'isItemAlreadySelected').mockReturnValue(false)
        createComponent({ product: TICKET, productsInBasket: [], isSomeTicketSelected: true })

        expect(getProductCardBottomHTML()).toMatchSnapshot()
      })
    })
  })

  describe('Если товар является other', () => {
    describe('Если это текущий other', () => {
      it('Если это текущий other, то отрисовываем InputNumber', () => {
        jest.spyOn(ShopService, 'isItemAlreadySelected').mockReturnValue(true)
        createComponent({ product: OTHER, productsInBasket: [], isSomeTicketSelected: true })

        expect(wrapper.findComponent(InputNumber).isVisible()).toBeTruthy()
      })

      it('Если это текущий other, то не отрисовываем кнопку купить/удалить', () => {
        jest.spyOn(ShopService, 'isItemAlreadySelected').mockReturnValue(true)
        createComponent({ product: OTHER, productsInBasket: [], isSomeTicketSelected: true })

        expect(wrapper.findComponent(Button).exists()).toBeFalsy()
      })

      it('Если это текущий other, то передаем в InputNumber value равное количеству товара', () => {
        const AMOUNT = 3
        jest.spyOn(ShopService, 'isItemAlreadySelected').mockReturnValue(true)
        jest.spyOn(ShopService, 'getAmountItemById').mockReturnValue(AMOUNT)
        createComponent({ product: OTHER, productsInBasket: [], isSomeTicketSelected: true })

        expect(wrapper.findComponent(InputNumber).props('value')).toBe(AMOUNT)
      })

      it('Если это текущий other, то передаем в InputNumber editable: false', () => {
        jest.spyOn(ShopService, 'isItemAlreadySelected').mockReturnValue(true)
        createComponent({ product: OTHER, productsInBasket: [], isSomeTicketSelected: true })

        expect(wrapper.findComponent(InputNumber).props('editable')).toBe(false)
      })

      it('Если это текущий other, то передаем в InputNumber controls-outside: true', () => {
        jest.spyOn(ShopService, 'isItemAlreadySelected').mockReturnValue(true)
        createComponent({ product: OTHER, productsInBasket: [], isSomeTicketSelected: true })

        expect(wrapper.findComponent(InputNumber).props('controlsOutside')).toBe(true)
      })

      it('Если это текущий other, то передаем в InputNumber min: 0', () => {
        jest.spyOn(ShopService, 'isItemAlreadySelected').mockReturnValue(true)
        createComponent({ product: OTHER, productsInBasket: [], isSomeTicketSelected: true })

        expect(wrapper.findComponent(InputNumber).props('min')).toBe(0)
      })

      it('Если это текущий other, то передаем в InputNumber max равный максимально доступному для продажи количеству', () => {
        const MAX_AMOUNT = 10
        jest.spyOn(ShopService, 'isItemAlreadySelected').mockReturnValue(true)
        jest.spyOn(ShopService, 'getRemainsByProduct').mockReturnValue(MAX_AMOUNT)
        createComponent({ product: OTHER, productsInBasket: [], isSomeTicketSelected: true })

        expect(wrapper.findComponent(InputNumber).props('max')).toBe(MAX_AMOUNT)
      })

      it('Если это текущий other, то при изменении value InputNumber, емитим наверх событие "change-amount" с нагрузкой', async () => {
        const PAYLOAD_FOR_CHANGE_AMOUNT = 'payload'
        jest.spyOn(ShopService, 'isItemAlreadySelected').mockReturnValue(true)
        jest.spyOn(ShopService, 'getAmountItemById').mockReturnValue(1)

        createComponent({ product: OTHER, productsInBasket: [], isSomeTicketSelected: true })
        await wrapper.findComponent(InputNumber).vm.$emit('input', PAYLOAD_FOR_CHANGE_AMOUNT)

        expect(wrapper.emitted('change-amount')[0][0]).toBe(PAYLOAD_FOR_CHANGE_AMOUNT)
      })
    })

    describe('Если это не текущий other', () => {
      it('Если это не текущий other, то не отрисовываем InputNumber', () => {
        jest.spyOn(ShopService, 'isItemAlreadySelected').mockReturnValue(false)
        createComponent({ product: OTHER, productsInBasket: [], isSomeTicketSelected: true })

        expect(wrapper.findComponent(InputNumber).exists()).toBeFalsy()
      })

      it('Если это не текущий other, то отрисовываем кнопку купить/удалить', () => {
        jest.spyOn(ShopService, 'isItemAlreadySelected').mockReturnValue(false)
        createComponent({ product: OTHER, productsInBasket: [], isSomeTicketSelected: true })

        expect(wrapper.findComponent(Button).isVisible()).toBeTruthy()
      })

      it('Если это не текущий other, то отрисовываем кнопку купить и передаем соответствующий текст из i18n', () => {
        jest.spyOn(ShopService, 'isItemAlreadySelected').mockReturnValue(false)
        createComponent({ product: OTHER, productsInBasket: [], isSomeTicketSelected: true })

        expect(wrapper.findComponent(Button).vm.$slots.default[0].text.trim()).toBe(
          I18N_KEYS['shop.btn.order'],
        )
      })

      it('Передаем в кнопку купить long: true', () => {
        createComponent({ product: OTHER, productsInBasket: [], isSomeTicketSelected: true })

        expect(wrapper.findComponent(Button).props('long')).toBe(true)
      })

      it('Если пользователь может купить товаров меньше 1, то блокируем кнопку купить', () => {
        jest.spyOn(ShopService, 'isItemAlreadySelected').mockReturnValue(false)
        jest.spyOn(ShopService, 'getRemainsByProduct').mockReturnValue(0)
        createComponent({ product: OTHER, productsInBasket: [], isSomeTicketSelected: true })

        expect(wrapper.findComponent(Button).props('disabled')).toBe(true)
      })

      it('Если пользователь может купить товаров больше 0, то не блокируем кнопку купить', () => {
        jest.spyOn(ShopService, 'isItemAlreadySelected').mockReturnValue(false)
        jest.spyOn(ShopService, 'getRemainsByProduct').mockReturnValue(5)
        createComponent({ product: OTHER, productsInBasket: [], isSomeTicketSelected: true })

        expect(wrapper.findComponent(Button).props('disabled')).toBe(false)
      })

      it('Передаем в кнопку купить type: primary', () => {
        jest.spyOn(ShopService, 'isItemAlreadySelected').mockReturnValue(false)
        createComponent({ product: OTHER, productsInBasket: [], isSomeTicketSelected: true })

        expect(wrapper.findComponent(Button).props('type')).toBe('primary')
      })

      it('По клику на кнопку купить, емитим событие change-amount c единицей', async () => {
        jest.spyOn(ShopService, 'isItemAlreadySelected').mockReturnValue(false)
        createComponent({ product: OTHER, productsInBasket: [], isSomeTicketSelected: true })
        await wrapper.findComponent(Button).vm.$emit('click')

        expect(wrapper.emitted('change-amount')[0][0]).toBe(1)
      })
    })

    describe('shop-ticket__bottom-info', () => {
      it('Если товар является other, и юзер может купить больше нуля товара, и если известно максимальное количество товара', () => {
        const AVAILABLE_REMAINS = 5
        jest.spyOn(ShopService, 'getRemainsByProduct').mockReturnValue(AVAILABLE_REMAINS)
        jest.spyOn(ShopService, 'isItemAlreadySelected').mockReturnValue(true)
        createComponent({ product: OTHER, productsInBasket: [], isSomeTicketSelected: true })

        expect(getProductCardBottomHTML()).toMatchSnapshot()
      })

      it('Если товар является other, и юзер не может купить товар', () => {
        const ZERO_REMAINS = 0
        jest.spyOn(ShopService, 'getRemainsByProduct').mockReturnValue(ZERO_REMAINS)
        jest.spyOn(ShopService, 'isItemAlreadySelected').mockReturnValue(true)
        createComponent({ product: OTHER, productsInBasket: [], isSomeTicketSelected: true })

        expect(getProductCardBottomHTML()).toMatchSnapshot()
      })

      it('Если товар является other, и юзер может купить товара больше 0, и количество товара бесконечно', () => {
        const INFINITY_REMAINS = Infinity
        jest.spyOn(ShopService, 'getRemainsByProduct').mockReturnValue(INFINITY_REMAINS)
        jest.spyOn(ShopService, 'isItemAlreadySelected').mockReturnValue(true)
        createComponent({ product: OTHER, productsInBasket: [], isSomeTicketSelected: true })

        expect(getProductCardBottomHTML()).toMatchSnapshot()
      })
    })
  })

  describe('AppShopAppBasketIcon', () => {
    it('Отрисовываем AppShopAppBasketIcon', () => {
      createComponent({ product: TICKET, productsInBasket: [], isSomeTicketSelected: false })

      expect(wrapper.findComponent(AppShopAppBasketIcon).isVisible()).toBeTruthy()
    })

    it('Передаем в AppShopAppBasketIcon is-highlighted: true, если продукт добавлен в корзину', () => {
      jest.spyOn(ShopService, 'isItemAlreadySelected').mockReturnValue(true)
      createComponent({ product: TICKET, productsInBasket: [], isSomeTicketSelected: false })

      expect(wrapper.findComponent(AppShopAppBasketIcon).props('isHighlighted')).toBe(true)
    })

    it('Передаем в AppShopAppBasketIcon is-highlighted: true, если продукт добавлен в корзину', () => {
      jest.spyOn(ShopService, 'isItemAlreadySelected').mockReturnValue(false)
      createComponent({ product: TICKET, productsInBasket: [], isSomeTicketSelected: false })

      expect(wrapper.findComponent(AppShopAppBasketIcon).props('isHighlighted')).toBe(false)
    })
  })
})
