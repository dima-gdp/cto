export default class OrderService {
  /**
   * Возвращает список методов оплаты
   * @param {array} providers
   * @return string[]
   */
  static getPaymentMethods(providers) {
    return providers.reduce((providers, provider) => [...providers, ...provider.settings.paymentMethods], [])
  }
}
