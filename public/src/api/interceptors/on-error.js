import { AXIOS_TIMEOUT_ERROR } from '@/utils/constants'
import HttpError from '@/domain/errors/http-error'

export function onError(error) {
  if (error.message === AXIOS_TIMEOUT_ERROR) {
    throw new HttpError({
      message: 'Timeout! Запрос не вернул ответ за достаточное время',
    })
  }

  if (!error.response) {
    throw error
  }
  const { data, status, statusText } = error.response

  const httpError = new HttpError({
    message: `${statusText}: ${status}`,
    status,
    payload: { ...data },
    request: error.request,
  })

  console.error(httpError.shortErrorInfo)

  throw httpError
}
