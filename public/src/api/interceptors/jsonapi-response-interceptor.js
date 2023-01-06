import { Deserializer } from 'jsonapi-serializer'
import { camelize } from '@/utils'

async function jsonapiResponseInterceptor(res) {
  const jsonApiOpts = { keyForAttribute: 'camelCase', dataLinks: {} }
  const deserializer = new Deserializer(jsonApiOpts)

  const { data, status } = res
  const { meta = {} } = data

  const camelMeta = camelize(meta)

  if (data.data) {
    const desData = await deserializer.deserialize(data).catch((err) => {
      throw new Error(err.stack)
    })

    return {
      data: desData || [],
      meta: camelMeta || {},
      status,
    }
  }

  return {
    data: res.data || [],
    meta: camelMeta || {},
    status,
  }
}

export default {
  interceptFunction: jsonapiResponseInterceptor,
  name: 'jsonapiResponseInterceptor',
}
