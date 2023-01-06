import { Serializer } from 'jsonapi-serializer'

function jsonapiRequestInterceptor(config) {
  if (config.data) {
    const { type } = config.data
    const attributes = Object.keys(config.data)

    if (type && attributes) {
      const s = new Serializer(type, { attributes, keyForAttribute: 'underscore_case' })
      config.data = s.serialize(config.data)
    }
  }

  return config
}

export default {
  interceptFunction: jsonapiRequestInterceptor,
  name: 'jsonapiRequestInterceptor',
}
