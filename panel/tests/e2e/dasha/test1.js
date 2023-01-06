/* describe("тест", function() {

    before(() => alert("Тестирование началось – перед тестами"));
    after(() => alert("Тестирование закончилось – после всех тестов"));

    beforeEach(() => alert("Перед тестом – начинаем выполнять тест"));
    afterEach(() => alert("После теста – заканчиваем выполнение теста"));

    it('тест 1', () => alert(1));
    it('тест 2', () => alert(2));

  }); */

describe('pow', function () {
  it('для отрицательных n возвращает NaN', function () {
    assert.isNaN(pow(2, -1))
  })

  it('для дробных n возвращает NaN', function () {
    assert.isNaN(pow(2, 1.5))
  })
  describe('возводит х в стпень 3', function () {
    function makeTest(x) {
      const expected = x * x * x
      it(`${x} в степени 3 будет ${expected}`, function () {
        assert.equal(pow(x, 3), expected)
      })
    }

    for (let x = 1; x <= 10; x++) {
      makeTest(x)
    }
  })
})
