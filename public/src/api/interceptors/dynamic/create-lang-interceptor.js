export default function createLangInterceptor(lang) {
  return {
    interceptFunction(config) {
      if (!config.params) {
        config.params = {}
      }
      config.params.lang = lang
      return config
    },
    name: 'lang',
  }
}
