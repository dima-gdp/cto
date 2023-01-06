import { getExistingApiInstance } from '@/api'

export default function useRequest() {
  async function getRequest(id) {
    const api = getExistingApiInstance()
    const { data } = await api.request.getOne(id, { include: 'form' })
    return data
  }
  async function getUserRequests(id, userId, category) {
    const api = getExistingApiInstance()
    const params = {
      filter: {
        userId: userId,
        'request.id': id,
        'request.category': category,
      },
      perPage: 0,
      include: 'request',
    }
    const { data } = await api.userRequest.getMany(params)
    return data
  }
  async function deleteUserRequests(id) {
    const api = getExistingApiInstance()
    const { data } = await api.userRequest.delete(id)
    return data
  }
  async function createRequest(params) {
    const api = getExistingApiInstance()
    const { data } = await api.formRecord.createRequest(params)
    return data
  }

  return {
    getRequest,
    getUserRequests,
    deleteUserRequests,
    createRequest,
  }
}
