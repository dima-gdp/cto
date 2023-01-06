import { getExistingApiInstance } from '@/api'
import { TIME_STATUSES } from '@/utils'

export default function useStream() {
  async function getHallGroupWithHalls(streamId) {
    const api = getExistingApiInstance()
    const { data: hallGroup } = await api.hallGroup.getOne(streamId, {
      include: 'halls,programFile',
      filter: {
        active: true,
        autoActiveTimeStatus: TIME_STATUSES.IN_PROGRESS,
      },
    })

    const halls = hallGroup.halls
      ? hallGroup.halls
          .filter((hall) => hall.active && hall.autoActiveTimeStatus === TIME_STATUSES.IN_PROGRESS)
          .sort((a, b) => b.sort - a.sort)
      : []
    delete hallGroup.halls

    return {
      hallGroup,
      halls,
    }
  }

  return {
    getHallGroupWithHalls,
  }
}
