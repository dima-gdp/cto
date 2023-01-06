import {
  kebabToCamel,
  snakeToCamel,
  camelToKebab,
  snakeToKebab,
  camelize,
  kebalize,
  parseCookie,
  isComplexType,
  pluck,
} from '@/utils'

describe('/utils', () => {
  it('kebabToCamel переводит строку из стиля написания kebab-case в сamelCase', () => {
    expect(kebabToCamel('kebab-to-camel')).toBe('kebabToCamel')
  })

  it('snakeToCamel переводит строку из стиля написания snake_case в сamelCase', () => {
    expect(snakeToCamel('snake_to_camel')).toBe('snakeToCamel')
  })

  it('camelToKebab переводит строку из стиля написания сamelCase в kebab-case', () => {
    expect(camelToKebab('camelToKebab')).toBe('camel-to-kebab')
  })

  it('snakeToKebab переводит строку из стиля написания snake_case в kebab-case', () => {
    expect(snakeToKebab('snake_to_kebab')).toBe('snake-to-kebab')
  })

  it('camelize переводит ключи объекта из стиля написания kebab-case/snake_case в сamelСase', () => {
    const obj = {
      fee_fie_foe: 'fum',
      beep_boop: [{ abc_xyz: 'mno' }, { 'foo-bar': 'baz' }],
    }
    const objResult = {
      feeFieFoe: 'fum',
      beepBoop: [{ abcXyz: 'mno' }, { fooBar: 'baz' }],
    }
    expect(camelize(obj)).toEqual(objResult)
  })

  it('kebalize переводит ключи объекта из стиля написания сamelСase/snake_case в kebab-case', () => {
    const obj = {
      feeFieFoe: 'fum',
      beep_boop: [{ abcXyz: 'mno' }, { foo_bar: 'baz' }],
    }
    const objResult = {
      'fee-fie-foe': 'fum',
      'beep-boop': [{ 'abc-xyz': 'mno' }, { 'foo-bar': 'baz' }],
    }
    expect(kebalize(obj)).toEqual(objResult)
  })

  it('parseCookie преобразует строку(cookie) в объект ключ/значение', () => {
    const cookie =
      'create-tg-visit=true; _ga=GA1.2.126532696.1498716380; tg-visit=36d6de91c84fefeb40db7955cbdaaa415e2476c9; token=DulTLMYJLjuuC.wRnyD0QKIGGbkCtRaBJJQupQcz9QlWhWctqQ.XQvhD-EShV6F8jyO9ewWUJg3YRCIBcef10psMxmLKBGwje9SFfT8wY9cdSzFFV9oIfrP.ntYk8mvYS9sURvJRFXycmqL3tfCfEwBjvfkVbHCMiMc-c37LIvLNa9bL; platform=Desktop; referrer="https://foo.bar.com/"; beaker.session.id=9cc01370a32cdafda7dcdd096c6809b3fd5a6d6b405e7afaf8194717855e6246f68f545e'
    const cookieResult = {
      'create-tg-visit': 'true',
      _ga: 'GA1.2.126532696.1498716380',
      'tg-visit': '36d6de91c84fefeb40db7955cbdaaa415e2476c9',
      token:
        'DulTLMYJLjuuC.wRnyD0QKIGGbkCtRaBJJQupQcz9QlWhWctqQ.XQvhD-EShV6F8jyO9ewWUJg3YRCIBcef10psMxmLKBGwje9SFfT8wY9cdSzFFV9oIfrP.ntYk8mvYS9sURvJRFXycmqL3tfCfEwBjvfkVbHCMiMc-c37LIvLNa9bL',
      platform: 'Desktop',
      referrer: '"https://foo.bar.com/"',
      'beaker.session.id':
        '9cc01370a32cdafda7dcdd096c6809b3fd5a6d6b405e7afaf8194717855e6246f68f545e',
    }
    expect(parseCookie(cookie)).toEqual(cookieResult)
  })

  it('isComplexType вернет значение (true/false) является ли аргумент массивом или объектом', () => {
    const string = 'string'
    const arr = ['[object Object]', '[object Array]']
    const object = {
      value: '[object Object]',
    }
    expect(isComplexType(string)).toBe(false)
    expect(isComplexType(arr)).toBe(true)
    expect(isComplexType(object)).toBe(true)
  })

  it('pluck возвращает значение из вложенных ключей, разделенных через точку', () => {
    const obj = {
      key1: {
        key2: {
          key3: 'value',
        },
      },
      key4: 'value4',
    }
    expect(pluck(obj, 'key4')).toBe(obj.key4)
    expect(pluck(obj, 'key1.key2.key3')).toBe(obj.key1.key2.key3)
  })
})
