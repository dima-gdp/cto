import { getExistingApiInstance } from '@/api'

export default function useForm() {
  async function getFormData(formId) {
    const api = getExistingApiInstance()

    const { data } = await api.form.getOne(formId, {
      include: ['fields.values', 'groups'].join(','),
    })
    return data
  }

  async function updateRegistrationData({ form, registrationId }) {
    const api = getExistingApiInstance()
    await api.formRecord.updateRegistration(registrationId, { form })
  }

  async function createRegistrationData({ form, eventId, userId }) {
    const api = getExistingApiInstance()
    await api.formRecord.createRegistration({ form, eventId, userId })
  }

  return {
    getFormData,
    createRegistrationData,
    updateRegistrationData,
  }
}
