import { getExistingApiInstance } from '@/api'
import { DOCUMENT_STATUS_ENUM } from '@/utils/constants'

export default function useDocument() {
  async function getDocument(eventId, userId, documentId) {
    const api = getExistingApiInstance()
    const params = {
      include: 'document,file',
      filter: {
        eventId: eventId,
        userId: userId,
        templateId: documentId,
      },
    }
    const { data } = await api.document.getMany(params)
    const [document] = data
    return {
      document,
    }
  }
  async function setUserDocument(documentId) {
    const api = getExistingApiInstance()
    const params = {
      include: 'document,file',
    }
    const { data } = await api.document.update(
      documentId,
      { status: DOCUMENT_STATUS_ENUM.RECREATE },
      params,
    )
    return {
      document: data,
    }
  }

  return {
    getDocument,
    setUserDocument,
  }
}
