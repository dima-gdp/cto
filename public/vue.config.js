const path = require('path')

module.exports = {
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [path.resolve(__dirname, 'src/styles/abstract/**/*.scss')],
    },
    i18n: {
      locale: 'ru',
      fallbackLocale: 'ru',
      localeDir: 'locales',
      enableInSFC: false,
    },
  },
  publicPath: '/',
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
        },
      },
    },
  },
  // todo: исключить попадание файла mockServiceWorker в билд на продакшене (в папку dist)
  // chainWebpack: (config) => {
  //   config.module.rule('js').exclude.add(path.resolve(__dirname, 'public/mockServiceWorker.js'))
  // },
}
