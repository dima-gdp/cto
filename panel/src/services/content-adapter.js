import { getContentList } from '@/api/permission'

export default function contentAdapter() {

  /**
   * Адаптер получения списка контента
   * @param {Object} params
   * @returns {Promise<array>}
   */
  async function getContent(params) {
    const { data } = await getContentList(params)
    return data
  }

  return { getContent }
}
