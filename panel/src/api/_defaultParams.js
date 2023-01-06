import Store from '@/store'

const initParams = (params) => {
  // Берем данные из стора -
  // id мероприятия и текущую роль
  const { eventId } = Store.state.app
  const { access } = Store.state.user

  // Если такое мероприятие - существует и
  // текущая роль не администратор и не айтишник
  if (eventId && !['administrator', 'it'].includes(access)) {
    // Инициализируем параметры которые мы будем
    // добавлять к запросам
    const include = params.include ? `${params.include},event` : 'event'
    const defaultParams = { ...params, include }
    defaultParams.filter['event.id'] = eventId
    return defaultParams
  }

  return params
}

export { initParams }
