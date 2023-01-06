import { axiosInstance } from './api-instance'
import { onError } from '@/api/interceptors/on-error'

const interceptorsMap = new Map()

/**
 * @callback requestInterceptor
 * @param config
 * @returns config
 */

/**
 *
 * @param {requestInterceptor} interceptFunction
 * @param name
 */
export function addRequestInterceptor({ interceptFunction, name }) {
  const id = axiosInstance.interceptors.request.use(interceptFunction, onError)

  interceptorsMap.set(name, id)
}

export function addResponseInterceptor({ interceptFunction, name }) {
  const id = axiosInstance.interceptors.response.use(interceptFunction, onError)

  interceptorsMap.set(name, id)
}

export function removeRequestInterceptor(name) {
  const id = interceptorsMap.get(name)
  if (id) {
    axiosInstance.interceptors.request.eject(id)
    interceptorsMap.delete(name)
  }
}

export function removeResponseInterceptor(name) {
  const id = interceptorsMap.get(name)
  if (id) {
    axiosInstance.interceptors.response.eject(id)
    interceptorsMap.delete(name)
  }
}
