import domainModule from '@/store/modules/domain'
import { setupServer } from 'msw/node'
import { domainHandlers } from '@/mocks/server-handlers'

const server = setupServer(...domainHandlers)

jest.mock('@/domain/services/app-load-service', () => jest.fn())

const FAKE_STATE = {
  data: { id: 'some id', eventId: 'fake event id', authGroupId: 'fake event id' },
}
const FAKE_DOMAIN = {
  name: 'reg.100metrovka.com',
  authGroupId: 20,
  id: 49,
  eventId: 1,
  defaultLanguage: 'ru',
  availableLanguages: ['ru', 'en'],
}

const mockCommit = jest.fn()

describe('@/store/modules/domain.js', () => {
  describe('getters', () => {
    it('parentEventId возвращает eventId, связанный с доменом', () => {
      const parentEventId = domainModule.getters.parentEventId(FAKE_STATE)

      expect(parentEventId).toBe(FAKE_STATE.data.eventId)
    })

    it('parentEventId возвращает authGroupId, связанную с доменом', () => {
      const authGroupId = domainModule.getters.currentAuthGroupId(FAKE_STATE)

      expect(authGroupId).toBe(FAKE_STATE.data.authGroupId)
    })
  })

  describe('mutations', () => {
    it('SET_DOMAIN устанавливает данные, мутируя стейт', () => {
      const EMPTY_STATE = { data: {} }
      const FAKE_PAYLOAD = { payload: 'fake' }

      domainModule.mutations.SET_DOMAIN(EMPTY_STATE, FAKE_PAYLOAD)

      expect(EMPTY_STATE).toEqual(expect.objectContaining({ data: FAKE_PAYLOAD }))
    })
  })

  describe('actions', () => {
    beforeAll(() => server.listen())
    afterEach(() => server.resetHandlers())
    afterAll(() => server.close())
    it('fetchDomain забирает данные через useDomain и кладет в стейт', async () => {
      await domainModule.actions.fetchDomain({ commit: mockCommit }, { hostName: 'localhost' })

      expect(mockCommit).toHaveBeenCalledWith('SET_DOMAIN', expect.objectContaining(FAKE_DOMAIN))
    })
  })
})
