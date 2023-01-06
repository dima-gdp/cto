import pagesModule from '@/store/modules/pages'
import LogicError from '@/domain/errors/logic-error'
import { setupServer } from 'msw/node'
import { userMenuHandlers } from '@/mocks/handlers'

const server = setupServer(...userMenuHandlers)

const FAKE_PATH = 'fake path'
const FAKE_CAPTION = 'fake caption'
const FAKE_PAGES = [
  {
    accessCount: 0,
    active: true,
    createdAt: '2021-06-09T18:24:32+0300',
    entityId: 2,
    eventId: 1,
    id: '7397',
    isStarted: false,
    lang: 'ru',
    limitedAccess: false,
    path: '/event/1/store',
    title: 'Магазин',
    type: 'store',
    updatedAt: null,
  },
  {
    accessCount: 0,
    active: true,
    createdAt: '2021-06-09T18:24:32+0300',
    entityId: 5,
    eventId: 1,
    id: '7534',
    isStarted: false,
    lang: 'ru',
    limitedAccess: false,
    path: '/event/1/static-pages/5',
    title: 'Спикеры',
  },
  {
    accessCount: 0,
    active: true,
    createdAt: '2021-06-09T18:24:32+0300',
    entityId: 35,
    eventId: 1,
    id: '7594',
    isStarted: false,
    lang: 'ru',
    limitedAccess: false,
    path: '/event/1/request/35',
    title: 'Заявка на участие в круглом столе',
    type: 'request',
    updatedAt: null,
  },
  {
    accessCount: 0,
    active: true,
    createdAt: '2021-06-09T18:24:32+0300',
    entityId: 132,
    eventId: 1,
    id: '7655',
    isStarted: false,
    lang: 'ru',
    limitedAccess: false,
    path: '/event/1/request/132',
    title: 'Заявка на участие в благотворительном забеге',
    type: 'request',
    updatedAt: null,
  },
  {
    accessCount: 0,
    active: true,
    createdAt: '2021-06-09T18:24:32+0300',
    entityId: 9,
    eventId: 1,
    id: '7682',
    isStarted: false,
    lang: 'ru',
    limitedAccess: false,
    path: '/event/1/stream/9',
    title: 'Тест 2',
    type: 'stream',
    updatedAt: '2021-09-27T16:13:26+0300',
  },
  {
    accessCount: 0,
    active: true,
    createdAt: '2021-06-21T16:01:51+0300',
    entityId: 124,
    eventId: 1,
    id: '7827',
    isStarted: false,
    lang: 'ru',
    limitedAccess: false,
    path: '/event/1/stream/124',
    title: 'тест',
    type: 'stream',
    updatedAt: '2021-06-21T16:01:51+0300',
  },
  {
    accessCount: 0,
    active: true,
    createdAt: '2021-06-09T18:24:32+0300',
    entityId: null,
    eventId: 1,
    id: '7871',
    isStarted: false,
    lang: 'ru',
    limitedAccess: false,
    path: '/event/1/profile',
    title: 'Профиль',
    type: 'user_profile',
    updatedAt: null,
  },
  {
    accessCount: 0,
    active: true,
    createdAt: '2021-06-09T18:24:32+0300',
    entityId: null,
    eventId: 1,
    id: '15240',
    isStarted: false,
    lang: 'ru',
    limitedAccess: false,
    path: '/event/1/orders',
    title: 'Мои заказы',
    type: 'user_orders',
    updatedAt: null,
  },
  {
    accessCount: 0,
    active: true,
    createdAt: '2021-06-11T16:28:59+0300',
    entityId: null,
    eventId: 1,
    id: '15341',
    isStarted: false,
    lang: 'ru',
    limitedAccess: false,
    path: '/events',
    title: 'Список мероприятий',
    type: 'event_list',
    updatedAt: null,
  },
]

const FAKE_STATE = {
  data: [
    {
      title: FAKE_CAPTION,
      path: FAKE_PATH,
    },
  ],
}

const mockCommit = jest.fn()

describe('@/store/modules/pages', () => {
  describe('getters', () => {
    it('getPageTitleByRoute возвращает заголовок страницы по роуту', () => {
      const getPageTitleByRoute = pagesModule.getters.getPageTitleByRoute(FAKE_STATE)
      const title = getPageTitleByRoute(FAKE_PATH)

      expect(title).toBe(FAKE_CAPTION)
    })

    it('getPageTitleByRoute бросит LogicError, если страницы с таким path нет', () => {
      const getPageTitleByRoute = pagesModule.getters.getPageTitleByRoute(FAKE_STATE)

      expect(() => getPageTitleByRoute('non existing path')).toThrow(LogicError)
    })
  })

  describe('mutations', () => {
    it('SET_PAGES наполняет стору', () => {
      const EMPTY_STATE = pagesModule.state()
      const FAKE_PAYLOAD = [{ fake: 'payload' }]
      pagesModule.mutations.SET_PAGES(EMPTY_STATE, FAKE_PAYLOAD)

      expect(EMPTY_STATE).toEqual(expect.objectContaining({ data: FAKE_PAYLOAD }))
    })
  })

  describe('actions', () => {
    beforeAll(() => server.listen())
    afterEach(() => {
      server.resetHandlers()
      jest.resetAllMocks()
    })
    afterAll(() => server.close())

    it('fetchPages загружает страницы и кладет из в стору', async () => {
      await pagesModule.actions.fetchPages(
        { commit: mockCommit, rootState: { auth: { userId: 'userId' } } },
        { eventId: '1' },
      )
      // возможно стоит проверять каждый тип?
      expect(mockCommit).toHaveBeenCalledWith(
        'SET_PAGES',
        expect.arrayContaining([expect.objectContaining(FAKE_PAGES[0])]),
      )
    })

    it('fetchPages ничего не делает, если нету userId (пользователь не авторизован)', async () => {
      await pagesModule.actions.fetchPages(
        { commit: mockCommit, rootState: { auth: {} } },
        { eventId: '1' },
      )
      // возможно стоит проверять каждый тип?
      expect(mockCommit).not.toHaveBeenCalled()
    })
  })
})
