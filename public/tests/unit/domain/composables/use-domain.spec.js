import useDomain from '@/domain/composables/use-domain'
import { mockApiDomainGetMany } from '@/api/mocs/api-domain-mock'
import LogicError from '@/domain/errors/logic-error'

const DOMAIN_NAME = 'reg.100metrovka.com'
const DOMAIN = {
  name: 'reg.100metrovka.com',
  authGroupId: 20,
  id: 49,
  eventId: 1,
  defaultLanguage: 'ru',
  availableLanguages: ['ru', 'en'],
}

const mockDomainGetMany = jest.fn()
jest.mock('@/api', () => ({
  getExistingApiInstance: () => ({
    domain: {
      getMany: mockDomainGetMany,
    },
  }),
}))

describe('/domain/composables/use-domain', () => {
  describe('getDomainByName', () => {
    it('Выбрасывает LogicError, если не передать в него hostName', async () => {
      await expect(useDomain().getDomainByName()).rejects.toThrowError(LogicError)
    })

    it('Выбрасывает LogicError, если не передать в него hostName', async () => {
      mockDomainGetMany.mockResolvedValue({ data: [] })

      await expect(useDomain().getDomainByName(DOMAIN_NAME)).rejects.toThrowError(LogicError)
    })

    it('возвращает домен', async () => {
      mockDomainGetMany.mockResolvedValue(mockApiDomainGetMany)
      const domain = await useDomain().getDomainByName(DOMAIN_NAME)

      expect(domain).toEqual(DOMAIN)
    })
  })
})
