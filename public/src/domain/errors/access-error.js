export default class AccessError extends Error {
  type = 'access'
  constructor(route) {
    super('У вас нет доступа к этой странице - ' + route?.path)
  }
}
