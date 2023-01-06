export default function defineApiUrl(env) {
  if (env === 'prod') {
    return 'https://api.pointreg.ru/'
  } else if (env === 'stage') {
    return 'https://api-service.dev.pointreg.ru/'
  } else if (env === 'dev') {
    return process.env.VUE_APP_API_HOST
  } else {
    throw new Error('Неверно задана переменная process.env.ENV')
  }
}
