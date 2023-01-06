import { compareId } from '@/utils'

const getters = {
  isActiveEventIsChild: (state, getters) => {
    const parentId = getters['domain/parentEventId']
    const activeId = getters['event/currentEventId']

    return !compareId(parentId, activeId)
  },
}

export default getters
