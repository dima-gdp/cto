import Qs from 'qs'
import { camelize } from '@/utils'

function paramsSerializeRequestInterceptor(config) {
  config.paramsSerializer = (params) => Qs.stringify(camelize(params))
  return config
}

export default {
  interceptFunction: paramsSerializeRequestInterceptor,
  name: 'paramsSerializeRequestInterceptor',
}
