export default function createAuthInterceptor(token) {
  return {
    interceptFunction(config) {
      config.headers['Authorization'] = 'Bearer ' + token
      return config
    },
    name: 'auth',
  }
}
