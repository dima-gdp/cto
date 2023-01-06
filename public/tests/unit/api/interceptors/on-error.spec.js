import { onError } from '@/api/interceptors/on-error'
import { AXIOS_TIMEOUT_ERROR } from '@/utils/constants'
import HttpError from '@/domain/errors/http-error'

describe('@/api/interceptors/on-error', () => {
  it('Если error message = AXIOS_TIMEOUT_ERROR, то прокидываем HttpError', () => {
    const error = new Error(AXIOS_TIMEOUT_ERROR)
    expect(() => {
      onError(error)
    }).toThrow(HttpError)
  })

  it('Если нет response, то прокидываем error', () => {
    const error = new Error()
    expect(() => {
      onError(error)
    }).toThrow(error)
  })

  it('Прокидывает HttpError c соответствующими полями', () => {
    const error = {
      response: {
        data: {
          key: 'value',
        },
        status: 'status',
        statusText: 'statusText',
      },
      request: 'request',
    }

    try {
      onError(error)
    } catch (e) {
      expect((e.message = `${error.statusText}: ${error.status}`))
      expect((e.status = error.status))
      expect((e.payload = { ...error.data }))
      expect((e.request = error.request))
    }

    expect(() => {
      onError(error)
    }).toThrow(HttpError)
  })
})
