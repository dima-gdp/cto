import eventModule from '@/store/modules/event'
import { setupServer } from 'msw/node'
import { eventHandlers, shopHandlers } from '@/mocks/server-handlers'
import LogicError from '@/domain/errors/logic-error'

const handlers = [...eventHandlers, ...shopHandlers]

const server = setupServer(...handlers)

const mockCommit = jest.fn()

const FAKE_STATE = {
  data: {
    id: 'fake id',
  },
}
const FAKE_EVENT = {
  active: true,
  id: '1',
}

const FAKE_STORE_ID = '2'

describe('@/store/modules/event.js', () => {
  describe('getters', () => {
    it('currentEventId возвращает текущее загруженное мероприятие', () => {
      const eventId = eventModule.getters.currentEventId(FAKE_STATE)

      expect(eventId).toBe(FAKE_STATE.data.id)
    })
  })

  describe('mutations', () => {
    it('SET_EVENT_DATA мутирует стор с пейлоадом евента', () => {
      const EMPTY_STORE = { data: {} }
      const FAKE_PAYLOAD = { fake: 'payload' }

      eventModule.mutations.SET_EVENT_DATA(EMPTY_STORE, FAKE_PAYLOAD)
      expect(EMPTY_STORE).toEqual(expect.objectContaining({ data: FAKE_PAYLOAD }))
    })
  })

  describe('actions', () => {
    beforeAll(() => server.listen())
    afterEach(() => {
      server.resetHandlers()
      jest.resetAllMocks()
    })
    afterAll(() => server.close())

    it('fetchLocaleRelatedEventData загружает евент и айди его магазина', async () => {
      await eventModule.actions.fetchLocaleRelatedEventData(
        { commit: mockCommit },
        { eventId: '1', locale: 'ru' },
      )

      expect(mockCommit).toHaveBeenCalledWith('SET_EVENT_DATA', expect.objectContaining(FAKE_EVENT))
      expect(mockCommit).toHaveBeenCalledWith('shop/SET_SHOP_ID', FAKE_STORE_ID, { root: true })
    })

    it('fetchLocaleRelatedEventData бросает ошибку LogicError, если у евента нету формлинка', async () => {
      await expect(
        eventModule.actions.fetchLocaleRelatedEventData(
          { commit: mockCommit },
          { eventId: 'eventWithoutForm', locale: 'ru' },
        ),
      ).rejects.toThrow(LogicError)

      expect(mockCommit).not.toHaveBeenCalled()
    })
  })
})
