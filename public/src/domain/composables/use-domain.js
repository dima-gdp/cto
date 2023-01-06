import { getExistingApiInstance } from '@/api'
import LogicError from '@/domain/errors/logic-error'

export default function useDomain() {
  async function getDomainByName(hostName) {
    if (!hostName) {
      throw new LogicError('Не задан hostName!')
    }
    const domainName =
      hostName === 'localhost' || hostName.includes('192.168.') ? 'reg.100metrovka.com' : hostName
    const api = getExistingApiInstance()

    const { data } = await api.domain.getMany({
      filter: {
        name: domainName,
        active: true,
        'event.active': true,
      },
      include: ['event'].join(','),
      fields: {
        domain: ['name', 'auth-group-id'].join(','),
        event: ['id', 'default-language', 'available-languages', 'active'].join(','),
      },
    })

    if (!data.length) {
      throw new LogicError('Не найдет активный домен с активным мероприятием')
    }

    const [domain] = data
    const defaultLanguage = domain?.event?.defaultLanguage
    const availableLanguages = domain?.event?.availableLanguages

    domain.eventId = +domain?.event?.id
    domain.id = +domain.id
    domain.defaultLanguage = defaultLanguage
    domain.availableLanguages = availableLanguages
    delete domain.event

    return domain
  }

  return {
    getDomainByName,
  }
}
