import { mount } from '@vue/test-utils'
import AppHeaderMenuBtn from '@/components/base/header/app-header-menu-button.vue'
import i18n from '@/plugins/i18n'
import { EMPTY_LOCALE_MESSAGE } from '@/plugins/i18n'

const I18N_KEYS = {
  'header.menu.button': 'header.menu.button',
}

const mock$tr = jest.fn().mockImplementation((key) => {
  return I18N_KEYS[key] || EMPTY_LOCALE_MESSAGE
})

describe('@/components/base/header/app-header-menu-button.vue', () => {
  let wrapper

  const createComponent = (isMenuOpen) => {
    wrapper = mount(AppHeaderMenuBtn, {
      i18n,
      propsData: {
        isMenuOpen,
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

  it('Выводим текст из i18n для текста кнопки', async () => {
    createComponent()

    expect(wrapper.html().includes(I18N_KEYS['header.menu.button'])).toBe(true)
  })

  it('Когда меню открыто', () => {
    createComponent(true)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('Когда меню закрыто', () => {
    createComponent(false)
    expect(wrapper.html()).toMatchSnapshot()
  })
})
