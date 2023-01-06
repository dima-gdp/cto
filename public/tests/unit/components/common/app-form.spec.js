import { mockFormDataFixture } from '@/api/mocs/api-form-mock'
import { shallowMount } from '@vue/test-utils'
import Vue from 'vue'
import { flushPromises } from '@/utils'
import { FieldEventBus } from '@/components/common/field-renderer/field-event-bus'
import AppForm from '@/components/common/app-form.vue'
import iview from '@/assets/vendor/view-design/src'

Vue.use(iview)

const FIELD_VALUES_INVALID = [
  {
    id: '600198',
    userId: 19579,
    fieldId: 41,
    entityId: 22851,
    value: 'Леонидовна',
    entity: 'registration',
  },
]
const FIELD_VALUES_VALID = [
  {
    id: '6114888',
    userId: 19579,
    fieldId: 39,
    entityId: 22851,
    value: 'Бунина@mail',
    entity: 'registration',
  },
  {
    id: '6114889',
    userId: 19579,
    fieldId: 40,
    entityId: 22851,
    value: 'cncn',
    entity: 'registration',
  },
  {
    id: '6114890',
    userId: 19579,
    fieldId: 41,
    entityId: 22851,
    value: 'Леонидовна',
    entity: 'registration',
  },
  {
    id: '6114891',
    userId: 19579,
    fieldId: 43,
    entityId: 22851,
    value: '+79923333333',
    entity: 'registration',
  },
  {
    id: '6114892',
    userId: 19579,
    fieldId: 49,
    entityId: 22851,
    value: 'Аллергология и иммунология',
    entity: 'registration',
  },
  {
    id: '6114893',
    userId: 19579,
    fieldId: 53,
    entityId: 22851,
    value: 'Бактериолог',
    entity: 'registration',
  },
  {
    id: '6114894',
    userId: 19579,
    fieldId: 62,
    entityId: 22851,
    value: {
      id: 4225,
      city: 'Klagenfurt',
      region: 'Bundesland Kärnten',
    },
    entity: 'registration',
  },
  {
    id: '6114895',
    userId: 19579,
    fieldId: 66,
    entityId: 22851,
    value: 'Академик-секретарь',
    entity: 'registration',
  },
  {
    id: '6114896',
    userId: 19579,
    fieldId: 83,
    entityId: 22851,
    value: ['Согласен на обработку персональных данных'],
    entity: 'registration',
  },
  {
    id: '6114897',
    userId: 19579,
    fieldId: 99,
    entityId: 22851,
    value: {
      id: 20,
      country: 'Австрия',
    },
    entity: 'registration',
  },
  {
    id: '6114898',
    userId: 19579,
    fieldId: 101,
    entityId: 22851,
    value: 'Больница',
    entity: 'registration',
  },
]
const EMITTED_FORM_DATA = [
  {
    form: [
      {
        fieldId: '39',
        value: 'Бунина@mail',
      },
      {
        fieldId: '40',
        value: 'cncn',
      },
      {
        fieldId: '41',
        value: 'Леонидовна',
      },
      {
        fieldId: '43',
        value: '+79923333333',
      },
      {
        fieldId: '49',
        value: 'Аллергология и иммунология',
      },
      {
        fieldId: '53',
        value: 'Бактериолог',
      },
      {
        fieldId: '62',
        value: {
          id: 4225,
          city: 'Klagenfurt',
          region: 'Bundesland Kärnten',
        },
      },
      {
        fieldId: '66',
        value: 'Академик-секретарь',
      },
      {
        fieldId: '83',
        value: ['Согласен на обработку персональных данных'],
      },
      {
        fieldId: '99',
        value: {
          id: 20,
          country: 'Австрия',
        },
      },
      {
        fieldId: '101',
        value: 'Больница',
      },
    ],
    entityId: 22851,
  },
]

const SUBMIT_BTN_TEXT = 'submit'
const submitSlotHtml = `<button>${SUBMIT_BTN_TEXT}</button>`

const mockGetFormData = jest.fn()
const mockGetValuesFunction = jest.fn()
const mockMessageError = jest.fn()
const mock$tr = jest.fn()

jest.mock('@/domain/composables/use-form', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    getFormData: mockGetFormData,
  })),
}))

describe('@/components/common/app-form.vue', () => {
  let wrapper
  const createComponent = (props) => {
    wrapper = shallowMount(AppForm, {
      propsData: props,
      slots: {
        submit: submitSlotHtml,
      },
      mocks: {
        $Message: { error: mockMessageError },
        $tr: mock$tr,
      },
    })
  }

  afterEach(() => {
    wrapper.destroy()
    mockGetValuesFunction.mockClear()
  })

  it('При инициализации компонента добавляем прослушку события "initValidation"', async () => {
    mockGetFormData.mockResolvedValue(mockFormDataFixture)
    createComponent({ formId: 1 })
    await flushPromises()

    expect(FieldEventBus._events.initValidation.length).toBe(1)
  })

  it('При удалении компонента отписываемся от прослушки события "initValidation"', async () => {
    mockGetFormData.mockResolvedValue(mockFormDataFixture)
    createComponent({ formId: 1 })
    await flushPromises()
    wrapper.destroy()

    expect(FieldEventBus._events?.initValidation?.length).toBeFalsy()
  })

  it('Если форма находится в не активном состоянии(входящий параметр disabled равен true), то не показываем форму', async () => {
    mockGetFormData.mockResolvedValue(mockFormDataFixture)
    createComponent({ formId: 1, disabled: true })
    await flushPromises()

    expect(wrapper.find('form').exists()).toBeFalsy()
  })

  it('Отрисовываются поля формы, полученные с api', async () => {
    mockGetFormData.mockResolvedValue(mockFormDataFixture)
    createComponent({ formId: 1 })
    await flushPromises()
    const formItems = wrapper.findAll('formitem-stub').length

    expect(formItems).toBe(mockFormDataFixture.fields.length)
  })

  it('Если передана функция для получения значений полей, то отрисовываются значения полей', async () => {
    mockGetValuesFunction.mockResolvedValue(FIELD_VALUES_INVALID)
    mockGetFormData.mockResolvedValue(mockFormDataFixture)
    createComponent({ formId: 1, getValuesFunction: mockGetValuesFunction })
    await flushPromises()

    expect(mockGetValuesFunction).toHaveBeenCalled()

    const fieldWithValue = wrapper
      .findAll('fieldrenderer-stub')
      .wrappers.find((field) => field.props('value') === FIELD_VALUES_INVALID[0].value)

    expect(fieldWithValue).toBeTruthy()
  })

  it('Отрисовывается scoped slot #submit', async () => {
    mockGetFormData.mockResolvedValue(mockFormDataFixture)
    createComponent({ formId: 1 })
    await flushPromises()
    const submitBtn = wrapper
      .findAll('button')
      .wrappers.find((btn) => btn.text() === SUBMIT_BTN_TEXT)

    expect(submitBtn.isVisible()).toBeTruthy()
  })

  describe('Тест метода submit, который передается на верх через scoped slot', () => {
    it('Если форма не отрисована,не емитим событие submit', async () => {
      mockGetFormData.mockResolvedValue(mockFormDataFixture)
      createComponent({ formId: 1, disabled: true })
      await flushPromises()
      await wrapper.vm.submit()

      expect(wrapper.emitted('submit')).toBeFalsy()
    })

    it('Если форма не валидна, то не емитим событие submit и показываем alert', async () => {
      mockGetFormData.mockResolvedValue(mockFormDataFixture)
      createComponent({ formId: 1 })
      await flushPromises()
      wrapper.vm.$refs.form.validate = async () => false
      await wrapper.vm.submit()
      expect(wrapper.emitted('submit')).toBeFalsy()

      expect(mockMessageError).toHaveBeenCalled()
    })

    it('Если форма валидна, то емитим событие submit с данными формы', async () => {
      mockGetValuesFunction.mockResolvedValue(FIELD_VALUES_VALID)
      mockGetFormData.mockResolvedValue(mockFormDataFixture)
      createComponent({ formId: 1, getValuesFunction: mockGetValuesFunction })
      await flushPromises()
      wrapper.vm.$refs.form.validate = async () => true
      await wrapper.vm.submit()

      expect(wrapper.emitted('submit')[0]).toEqual(EMITTED_FORM_DATA)
    })

    it('Если у формы входной параметр clearForm = true, то после эмита стираем значения формы', async () => {
      mockGetValuesFunction.mockResolvedValue(FIELD_VALUES_VALID)
      mockGetFormData.mockResolvedValue(mockFormDataFixture)
      createComponent({ formId: 1, getValuesFunction: mockGetValuesFunction, clearForm: true })
      await flushPromises()
      wrapper.vm.$refs.form.validate = async () => true
      await wrapper.vm.submit()
      const fieldWithValue = wrapper
        .findAll('fieldrenderer-stub')
        .wrappers.find((field) => field.props('value'))

      expect(fieldWithValue).toBeFalsy()
    })
  })
})
