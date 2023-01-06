// todo: придумать абстракцию
import { rest } from 'msw'
import resourceUserMenu from '../../../msw/api-v1/users/menu'
import { createRequestHandler } from '@/mocks/helpers'

export const userMenuHandlers = [
  rest.get('*/users/menu/:userId', createRequestHandler(resourceUserMenu.getOne)),
]

const handlers = []

export default handlers
