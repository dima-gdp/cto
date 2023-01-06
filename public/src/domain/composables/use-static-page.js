import { getExistingApiInstance } from '@/api'

export default function useStaticPage() {
  async function getStaticPage(staticPageId) {
    const api = getExistingApiInstance()
    const { data } = await api.staticPage.getOne(staticPageId)

    return data
  }
  async function getStartPageId(eventId) {
    const api = getExistingApiInstance()
    const { data } = await api.staticPage.getMany({
      filter: {
        eventId,
        type: 'default',
      },
      fields: {
        page: 'id,type',
      },
    })

    if (!data.length) {
      return null
    }
    const [startPage] = data

    return startPage.id
  }

  return { getStaticPage, getStartPageId }
}
