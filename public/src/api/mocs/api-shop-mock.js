export const mockShopFixture = {
  id: '2',
  name: 'М(RU) - "reg.100metrovka.com Тест3_1"',
  description: 'fsdfsd илорилорлоро\nджодшлодоодл\nsdf\ndsfs\nssdfd\nsdf',
  eventId: 1,
  sellingStartedAt: '2019-12-12T00:00:00+0300',
  sellingClosedAt: '2021-12-21T18:00:00+0300',
  sellingTimeStatus: 'during',
  settings: null,
  active: true,
  paymentProviders: [5, 28],
  lang: 'ru',
}

export const mockShopSellingClosedFixture = {
  id: '2',
  name: 'М(RU) - "reg.100metrovka.com Тест3_1"',
  description: 'fsdfsd илорилорлоро\nджодшлодоодл\nsdf\ndsfs\nssdfd\nsdf',
  eventId: 1,
  sellingStartedAt: '2019-12-12T00:00:00+0300',
  sellingClosedAt: '2021-12-21T18:00:00+0300',
  sellingTimeStatus: 'after',
  settings: null,
  active: true,
  paymentProviders: [5, 28],
  lang: 'ru',
}

export const mockShopBeforeSellingFixture = {
  id: '2',
  name: 'М(RU) - "reg.100metrovka.com Тест3_1"',
  description: 'fsdfsd илорилорлоро\nджодшлодоодл\nsdf\ndsfs\nssdfd\nsdf',
  eventId: 1,
  sellingStartedAt: '2019-12-12T00:00:00+0300',
  sellingClosedAt: '2021-12-21T18:00:00+0300',
  sellingTimeStatus: 'before',
  settings: null,
  active: true,
  paymentProviders: [5, 28],
  lang: 'ru',
}

export const mockShopFixtureWithoutDescription = {
  id: '2',
  name: 'М(RU) - "reg.100metrovka.com Тест3_1"',
  eventId: 1,
  sellingStartedAt: '2019-12-12T00:00:00+0300',
  sellingClosedAt: '2021-12-21T18:00:00+0300',
  sellingTimeStatus: 'during',
  settings: null,
  active: true,
  paymentProviders: [5, 28],
  lang: 'ru',
}

export const mockProductsFixture = {
  tickets: [
    {
      id: '4',
      name: 'тестовый товар 2',
      type: 'ticket',
      description:
        'максимальная длина описания товара - 255 символов .  максимальная длина описания товара - 255 символов . максимальная длина описания товара - 255 символов . максимальная длина описания товара - 255 символов . максимальная длина описания товара - 255 симво',
      storeId: 2,
      sort: 101,
      price: 15000,
      currency: 'RUB',
      priceRub: 15000,
      isCurrencyAllowed: false,
      isRateBlocked: false,
      settings: [],
      active: true,
      limitCount: null,
      sellingCount: null,
      orderLimitCount: null,
      sellingStartedAt: null,
      sellingClosedAt: null,
      sellingTimeStatus: 'during',
    },
  ],
  others: [
    {
      id: '7',
      name: 'тестовый товар',
      type: 'other',
      description: 'ура товарищи! айтишник может создавать товары',
      storeId: 2,
      sort: 101,
      price: 182,
      currency: 'RUB',
      priceRub: 182,
      isCurrencyAllowed: false,
      isRateBlocked: false,
      settings: [],
      active: true,
      limitCount: null,
      sellingCount: null,
      orderLimitCount: null,
      sellingStartedAt: null,
      sellingClosedAt: '2021-12-20T00:00:00+0300',
      sellingTimeStatus: 'during',
    },
  ],
}

export const mockCurrenciesFixture = [
  {
    label: 'USD',
    value: 74.37,
    id: 'USD',
  },
  {
    label: 'EUR',
    value: 88.14,
    id: 'EUR',
  },
]

export const mockCreateOrderFixture = {
  storeId: '2',
  userId: 19579,
  status: 'created',
  storeType: 'event',
  createdAt: 1633681792,
  updatedAt: 1633681792,
  id: '4743',
  currency: 'RUB',
  cost: '15000',
}
