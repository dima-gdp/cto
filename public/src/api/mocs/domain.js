import { onResponse } from '@/api/interceptor-service'

export const DOMAIN_DATA_MOCK = {
  data: {
    data: [
      {
        id: '49',
        type: 'domain',
        attributes: {
          name: 'reg.100metrovka.com',
          'auth-group-id': 20,
        },
        relationships: {
          event: {
            data: {
              id: '2844',
              type: 'event',
            },
          },
        },
      },
    ],
    included: [
      {
        id: '2844',
        type: 'event',
        attributes: {
          id: 2844,
        },
        meta: {
          languages: ['ru'],
        },
      },
    ],
    meta: {
      'total-count': 1,
      'page-count': 1,
      'current-page': 1,
      'per-page': 20,
    },
  },
}

export const DOMAIN_STATE_PAYLOAD = {
  id: 49,
  name: 'reg.100metrovka.com',
  authGroupId: 20,
  eventId: 2844,
}

export async function GET_DOMAIN_DATA_MOCK() {
  return await onResponse(DOMAIN_DATA_MOCK)
}
