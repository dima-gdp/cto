import { uploadFile } from '@/api/files'

export default {
  editor: {
    lang: 'ru',
  },
  plugins: ['reorder'],
  image: {
    async upload(upload, data) {
      const imagesPromises = []

      for (const key in data.files) {
        if (typeof data.files[key] === 'object') {
          const formData = new FormData()
          formData.append('file', data.files[key])

          imagesPromises.push(uploadFile(formData))
        }
      }

      const images = (await Promise.all(imagesPromises)).reduce((acc, curr) => {
        acc[curr.data.name] = {
          url: `${curr.data.baseUrl}${curr.data.path}`,
          id: curr.data.id,
        }

        return acc
      }, {})

      upload.complete(images, data.e)
    },
  },
}
