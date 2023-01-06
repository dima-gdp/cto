import AppShopPriceView from '@/components/common/shop/app-shop-price-view'
import { shallowMount } from '@vue/test-utils'
import Vue from 'vue'
import Vuex from 'vuex'
import iview from '@/assets/vendor/view-design/src'
import i18n from '@/plugins/i18n'
import Feather from '@/assets/vendor/vue-feather/src/feather.vue'
import { CURRENCY_ENUM, CURRENCY_SYMBOL_ENUM } from '@/utils/constants'

Vue.use(iview)
Vue.use(Vuex)

describe('@/components/common/shop/app-shop-basket.vue', () => {
  let wrapper
  let store

  const createComponent = (currency = CURRENCY_ENUM.RUB) => {
    store = new Vuex.Store({
      modules: {
        shop: {
          namespaced: true,
          state: {
            currencies: [
              { label: 'USD', value: 73.43, id: 'USD' },
              { label: 'EUR', value: 84.79, id: 'EUR' },
            ],
          },
        },
      },
    })

    wrapper = shallowMount(AppShopPriceView, {
      store,
      i18n,
      propsData: {
        currency,
        price: 1000,
        priceRub: 1000,
      },
      stubs: {
        Feather,
      },
    })
  }

  afterEach(() => {
    wrapper.destroy()
  })

  it('Если текущая валюта равна рублю', async () => {
    createComponent()

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('Если текущая валюта не равна рублю', async () => {
    createComponent(CURRENCY_ENUM.EUR)

    expect(wrapper.html()).toMatchSnapshot()
  })
})
