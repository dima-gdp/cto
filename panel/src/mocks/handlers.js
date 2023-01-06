// todo: придумать абстракцию
import { rest } from 'msw'
import resourceEventMenu from '../../../msw/api-v1/events/menu'
import resourceEventMenuItem from '../../../msw/api-v1/events/menu-item'

// const resourceEventMenu = require('../../../msw/api-v1/events/menu')

function createRequestHandler(response) {
  return (req, res, ctx) => {
    return res(
      ctx.json({
        ...response,
      })
    )
  }
}

function createRequestHandlerWithError(response) {
  return (req, res, ctx) => {
    return res(ctx.status(422), ctx.json({ ...response }))
  }
}

const menuHandlers = [
  // rest.get('*/events/menu/*', createRequestHandler(resourceEventMenu.getOne)),
  // rest.get('*/events/menu', createRequestHandler(resourceEventMenu.getMany)),
  // rest.post('*/events/menu', createRequestHandler(resourceEventMenu.create)),
  // rest.patch('*/events/menu/:menuId', createRequestHandler(resourceEventMenu.update)),
  // rest.delete('*/events/menu/:menuId', createRequestHandler(resourceEventMenu.delete)),
]

const menuItemHandlers = [
  // rest.get('*/events/menu/item/:itemId', createRequestHandler(resourceEventMenuItem.getOne)),
  // rest.get('*/events/menu/item', createRequestHandler(resourceEventMenuItem.getMany)),
  // rest.post('*/events/menu/item', createRequestHandler(resourceEventMenuItem.create)),
  // rest.patch('*/events/menu/item/:itemId', createRequestHandler(resourceEventMenuItem.update)),
  // rest.delete('*/events/menu/item/:itemId', createRequestHandler(resourceEventMenuItem.delete)),
]

const handlers = [...menuItemHandlers, ...menuHandlers]

export default handlers
