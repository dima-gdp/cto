import { translateFn, EMPTY_LOCALE_MESSAGE } from '@/plugins/i18n'
import store from '@/store'

let unsubscribeLocalesLoading = () => {}

function titleSetter(route) {
  if (route?.meta?.isDynamic) {
    document.title = store.getters['pages/getPageTitleByRoute'](route.path)
  } else {
    document.title = route.meta.getTitle(translateFn)
  }
}

function setTitle(to) {
  document.title = EMPTY_LOCALE_MESSAGE

  const appIsLoading = store.state.appIsLoading
  if (appIsLoading) {
    unsubscribeLocalesLoading()

    unsubscribeLocalesLoading = store.subscribe((mutation) => {
      if (mutation.type === 'SET_APP_IS_LOADING' && mutation.payload === false) {
        titleSetter(to)
      }
    })
  } else {
    titleSetter(to)
  }
}

export default {
  setTitle,
}
