import useEvent from '@/domain/composables/use-event'
import { mockApiEventGetOne } from '@/api/mocs/api-event-mock'
import LogicError from '@/domain/errors/logic-error'

const mockEventGetOne = jest.fn()
const mockEventGetMany = jest.fn()
const mockGetUserMenu = jest.fn()
const mockEventToEventGetMany = jest.fn()

jest.mock('@/api', () => ({
  getExistingApiInstance: () => ({
    event: {
      getOne: mockEventGetOne,
      getMany: mockEventGetMany,
    },
    user: {
      getUserMenu: mockGetUserMenu,
    },
    eventToEvent: {
      getMany: mockEventToEventGetMany,
    },
  }),
}))

describe('/domain/composables/use-event', () => {
  const FAKE_EVENT_ID = 2844

  describe('getEventData', () => {
    it('Выбрасывает ошибку LogicError, если не передать параметр eventId', async () => {
      await expect(useEvent().getEventData()).rejects.toThrowError(LogicError)
    })

    it('getEventData возвращает eventData', async () => {
      mockEventGetOne.mockResolvedValue(mockApiEventGetOne)
      const eventData = await useEvent().getEventData(FAKE_EVENT_ID)

      expect(eventData).toEqual(mockApiEventGetOne.data)
    })
  })
})
