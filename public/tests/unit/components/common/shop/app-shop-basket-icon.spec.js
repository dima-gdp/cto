import { shallowMount } from '@vue/test-utils'
import Vue from 'vue'
import iview from '@/assets/vendor/view-design/src'
import AppShopAppBasketIcon from '@/components/common/shop/app-shop-basket-icon'
import Feather from '@/assets/vendor/vue-feather/src/feather.vue'
import { EMPTY_LOCALE_MESSAGE } from '@/plugins/i18n'

Vue.use(iview)

const SHOP_PRODUCT_IN_BASKET = 'shop.product.inBasket'

const mock$tr = jest.fn().mockImplementation((key) => {
  if (key === 'shop.product.inBasket') {
    return SHOP_PRODUCT_IN_BASKET
  }
  return EMPTY_LOCALE_MESSAGE
})

describe('@/components/common/shop/app-shop-basket.vue', () => {
  let wrapper

  const createComponent = (isHighlighted = false) => {
    wrapper = shallowMount(AppShopAppBasketIcon, {
      propsData: {
        isHighlighted,
      },
      stubs: {
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

  it('Если входящий параметр isHighlighted:true', async () => {
    createComponent(true)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('Если входящий параметр isHighlighted:false', async () => {
    createComponent()
    expect(wrapper.html()).toMatchSnapshot()
  })
})
