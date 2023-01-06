import config from '@/config'

export default function useEventLanding() {
  function getSrcEventStyleEl(colorId) {
    return `${config.baseUrl}api/v1/styles/css?id=${colorId}`
  }

  return  {
    getSrcEventStyleEl,
  }
}
