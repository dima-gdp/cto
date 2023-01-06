import BaseEndpoint from '@/api/endpoints/base-endpoint'

export default class FileEndpoint extends BaseEndpoint {
  upload(formData) {
    return this.request({
      url: `${this._url}/upload`,
      method: 'POST',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  }
}
