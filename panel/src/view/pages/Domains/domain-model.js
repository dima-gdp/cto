export function validateDomainPayload(payload) {
  if (!payload.name) {
    throw new Error('Необходимо указать имя домена!')
  } else if (!payload.eventId) {
    throw new Error('Необходимо связанное мероприятие!')
  } else if (!payload.authGroupId) {
    throw new Error('Необходимо указать базу пользователей!')
  }

  return true
}
