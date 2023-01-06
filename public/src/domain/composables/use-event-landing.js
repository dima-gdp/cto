import { getExistingApiInstance } from '@/api'

export default function useEventLanding() {
  async function getEventLandings(params) {
    const api = getExistingApiInstance()

    const { data } = await api.eventLanding.getMany(params)
    return data
  }

  return {
    getEventLandings,
  }
}
