export class AbstractMethod {
  constructor() {
    throw new Error('Метод должен быть переопределен в наследнике!')
  }
}
