import { ROLES } from '@/domain/role'
import router from "@/router";

export default function useMetric() {
  function goBack(role, eventId) {
    if (role === ROLES.manager) {
      router.push(`/metrics/list`)
    } else {
      router.push(`/events/edit/${eventId}/metrics`)
    }
  }

  return {
    goBack,
  }
}
