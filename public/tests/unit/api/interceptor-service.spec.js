import {
  addRequestInterceptor,
  addResponseInterceptor,
  removeRequestInterceptor,
  removeResponseInterceptor,
} from '@/api/interceptor-service'
import { onError } from '@/api/interceptors/on-error'

const mockUse = jest.fn()
const mockEject = jest.fn()

jest.mock('@/api/api-instance', () => {
  return {
    axiosInstance: {
      interceptors: {
        request: {
          use: jest
            .fn()
            .mockImplementation((interceptFunction, onError) =>
              mockUse(interceptFunction, onError),
            ),
          eject: jest.fn().mockImplementation((name) => mockEject(name)),
        },
        response: {
          use: jest
            .fn()
            .mockImplementation((interceptFunction, onError) =>
              mockUse(interceptFunction, onError),
            ),
          eject: jest.fn().mockImplementation((name) => mockEject(name)),
        },
      },
    },
  }
})

describe('@/api/interceptor-service.js', () => {
  const NAME_INTERCEPTOR = 'nameInterceptor'
  const FUNC_INTERCEPTOR = () => 'test'
  const TEST_ID_INTERCEPTOR = 1

  beforeEach(() => {
    mockUse.mockClear()
    mockEject.mockClear()
  })

  it('addRequestInterceptor добавляет перехватчик в axiosInstance', () => {
    mockUse.mockReturnValue(TEST_ID_INTERCEPTOR)
    addRequestInterceptor({ interceptFunction: FUNC_INTERCEPTOR, name: NAME_INTERCEPTOR })

    expect(mockUse).toHaveBeenCalledWith(FUNC_INTERCEPTOR, onError)
  })

  it('addResponseInterceptor добавляет перехватчик в axiosInstance', () => {
    mockUse.mockReturnValue(TEST_ID_INTERCEPTOR)
    addResponseInterceptor({ interceptFunction: FUNC_INTERCEPTOR, name: NAME_INTERCEPTOR })

    expect(mockUse).toHaveBeenCalledWith(FUNC_INTERCEPTOR, onError)
  })

  it('removeRequestInterceptor удаляет перехватчик', () => {
    mockUse.mockReturnValue(TEST_ID_INTERCEPTOR)
    addRequestInterceptor({ interceptFunction: FUNC_INTERCEPTOR, name: NAME_INTERCEPTOR })

    removeRequestInterceptor(NAME_INTERCEPTOR)
    expect(mockEject).toHaveBeenCalledWith(TEST_ID_INTERCEPTOR)
  })

  it('removeRequestInterceptor не пробует удалить перехватчик, если его нет', () => {
    removeRequestInterceptor(NAME_INTERCEPTOR)
    expect(mockEject).not.toHaveBeenCalled()
  })

  it('removeResponseInterceptor удаляет перехватчик', () => {
    mockUse.mockReturnValue(TEST_ID_INTERCEPTOR)
    addRequestInterceptor({ interceptFunction: FUNC_INTERCEPTOR, name: NAME_INTERCEPTOR })

    removeResponseInterceptor(NAME_INTERCEPTOR)
    expect(mockEject).toHaveBeenCalledWith(TEST_ID_INTERCEPTOR)
  })

  it('removeResponseInterceptor не пробует удалить перехватчик, если его нет', () => {
    removeResponseInterceptor(NAME_INTERCEPTOR)
    expect(mockEject).not.toHaveBeenCalled()
  })
})
