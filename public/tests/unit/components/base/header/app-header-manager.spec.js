import { mount } from '@vue/test-utils'
import AppHeaderManager from '@/components/base/header/app-header-manager.vue'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

describe('@/components/base/header/app-header-manager.vue', () => {
  let wrapper
  let store

  const createComponent = () => {
    store = new Vuex.Store({
      state: {
        event: {
          data: {
            email: 'manager@pointreg.com',
            phone: {
              info: 'Елизавета Гаврилова - Менеджер POINTREG',
              number: '+7 (920) 258-13-50',
              extension: '256',
            },
          },
        },
      },
    })

    wrapper = mount(AppHeaderManager, {
      store,
    })
  }

  afterEach(() => {
    wrapper.destroy()
  })

  it('Когда есть все данные для отрисовки(телефон, телефон добавочный, почта, инфо)', () => {
    createComponent()
    expect(wrapper.html()).toMatchSnapshot()
  })
})
