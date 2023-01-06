import { getExistingApiInstance } from '@/api'

export default function useDomainContent() {
  async function getContentItemList(domainId, entityId, lang) {
    const api = getExistingApiInstance()
    const { data } = await api.domainContent.getMany({
      domainId,
      filter: { entityId: entityId, active: true },
      perPage: 0,
    })

    const filteredByLang = data?.filter((i) => i.lang === lang)
    return filteredByLang
  }
  async function getContentItem(id) {
    const api = getExistingApiInstance()
    const res = await api.domainContent.getOne(id)
    return res.data
  }
  return {
    getContentItemList,
    getContentItem,
  }
}
