export default function createDomainInterceptor(domainId) {
  return {
    interceptFunction(config) {
      if (!config.params) {
        config.params = {}
      }
      config.params.domainId = domainId
      return config
    },
    name: 'domain',
  }
}
