import { rest } from 'msw'
import resourceDomain from '../../../msw/api-v1/domain'
import resourceEvent from '../../../msw/api-v1/events/event'
import resourceShop from '../../../msw/api-v1/events/stores/store'
import { createRequestHandler } from '@/mocks/helpers'

export const domainHandlers = [
  rest.get('*/api/v1/domain', (req, res, ctx) => {
    const query = req.url.searchParams
    const filterName = query.get('filter[name]')

    if (filterName === 'nonExistingHost') {
      return createRequestHandler(resourceDomain.getManyNotFound)(req, res, ctx)
    }
    return createRequestHandler(resourceDomain.getMany)(req, res, ctx)
  }),
]

export const eventHandlers = [
  rest.get(
    '*/api/v1/events/event/eventWithoutForm',
    createRequestHandler(resourceEvent.getOneWithoutForm),
  ),
  rest.get('*/api/v1/events/event/:eventId', createRequestHandler(resourceEvent.getOne)),
]

export const shopHandlers = [
  rest.get('*/api/v1/events/stores/store', createRequestHandler(resourceShop.getMany)),
]
