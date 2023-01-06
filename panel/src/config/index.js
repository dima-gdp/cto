function defineApiUrl(env) {
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

export default {
  title: 'Start-admin',
  cookieExpires: 30,
  useI18n: false,
  baseUrl: defineApiUrl(process.env.VUE_APP_ENV),
  homeName: 'home',
  plugin: {
    'error-store': {
      showInHeader: false,
      developmentOff: true,
    },
  },
}
