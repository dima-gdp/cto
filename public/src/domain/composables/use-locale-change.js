import { getExistingApiInstance } from '@/api'

export default function useLocaleChange() {
  async function getLocales(eventId, lang) {
    const api = getExistingApiInstance()
    const { data } = await api.i18n.getFullLocales(eventId, lang)

    return data?.data
  }

  return {
    getLocales,
  }
}
