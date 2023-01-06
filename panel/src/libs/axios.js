import axios from 'axios'
import Qs from 'qs'
import store from '@/store'
import { getToken, kebalize } from '@/libs/util'
import { toCamelCase } from '@/libs/tools'
import { Notice } from 'iview'
import { Serializer, Deserializer } from 'jsonapi-serializer'

const addErrorLog = (errorInfo) => {
  const {
    statusText,
    status,
    request: { responseURL },
  } = errorInfo
  const info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL,
  }
  if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}

class HttpRequest {
  constructor(baseUrl = baseURL) {
    this.baseUrl = baseUrl
    this.queue = {}
  }
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      serialize: true,
      access: true,
      headers: {
        'Content-Type': 'application/json',
      },
      paramsSerializer: (params) => {
        return Qs.stringify(params, {
          indices: false,
          encode: false,
        })
      },
    }
    return config
  }
  destroy(url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      // Spin.hide()
    }
  }
  interceptors(instance, options, suppressNotice) {
    const url = options.url
    instance.interceptors.request.use(
      (config) => {
        if (getToken() && options.access === true) {
          config.headers.Authorization = 'Bearer  ' + getToken()
        }

        if (options.serialize && options.type) {
          const serializer = new Serializer(options.type, {
            attributes: Object.keys(config.data),
            keyForAttribute: 'underscore_case',
          })
          config.data = serializer.serialize(config.data)
        }
        if (!Object.keys(this.queue).length) {
          // Spin.show()
        }
        this.queue[url] = true
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    instance.interceptors.response.use(
      async (res) => {
        this.destroy(url)

        const { status } = res
        let { data } = res

        let meta = {}

        if (res.data.meta) {
          meta = Object.fromEntries(
            Object.entries(res.data.meta).map(([k, v]) => [toCamelCase(k), v])
          )
        }
        if (options.serialize === true && data) {
          data = await new Deserializer({
            keyForAttribute: 'camelCase',
          }).deserialize(data, (err, result) => {
            if (err) {
              console.error(err.stack)
            }
            return result
          })
          // Преобразуем id для всех запросов из строки в число
          if (data.length > 0) {
            data.forEach((res) => {
              res.id = +res.id
            })
          }
        }
        return { data, status, meta }
      },
      async (error) => {
        this.destroy(url)
        if (error.response) {
          let errorInfo = error.response
          if (!errorInfo) {
            const {
              request: { statusText, status },
              config,
            } = JSON.parse(JSON.stringify(error))
            errorInfo = {
              statusText,
              status,
              request: { responseURL: config.url },
            }
          }
          const message = {
            title: errorInfo.status === 401 ? 'Session expired' : 'Network error',
          }

          if (errorInfo.data && errorInfo.data.errors) {
            const errors = errorInfo.data.errors
            message['title'] = errors[0]['title']
            message['desc'] = errors[0]['detail']
          }

          if (errorInfo.status !== 401 && url !== 'user/login' && !suppressNotice) {
            Notice.error(message)
          }

          addErrorLog(errorInfo)
        } else {
          Notice.error({
            title: 'Произошла ошибка сети',
            desc: 'Пожалуйста проверьте ваше соединение с сетью и повторите попытку',
          })
        }
        return Promise.reject(error)
      }
    )
  }
  request(options, suppressNotice = false) {
    const instance = axios.create()
    options = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance, options, suppressNotice)
    return instance.request(options)
  }
}
export default HttpRequest
