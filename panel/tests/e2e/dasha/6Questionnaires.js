// import { watchFile } from "fs";

// https://docs.cypress.io/api/introduction/api.html

// <script src="jquery.js"></script>
// <script src="chai.js"></script>
// <script src="chai-jquery.js"></script>
/* {chromeWebSecurity: false}
beforeEach(function () {
  Cypress.Cookies.preserveOnce('s256.ru', 'remember_token')
  }) */

before(function () {
  cy.login('admin@s256.ru', 'devmydev')
})
describe('Questionnaires', function () {
  /* it('questionarres', function() {
    cy.visit('http://panel.cto.s256.ru/worksheets/list')
    cy.url().should('eq','http://panel.cto.s256.ru/worksheets/list')
    //Визуальная проверка страницы Анкеты
    cy.get('.ivu-divider-inner-text').should('text','Анкеты')
    cy.get('.ivu-card-body__btn-create > .ivu-icon')
    cy.get('.ivu-card-body__btn-create > span').should('text','\n      Создать отчет\n    ')
    cy.get(':nth-child(1) > .table-filter__item > .search-input > .ivu-input').should('have.attr','placeholder','ID')
    cy.get(':nth-child(2) > .table-filter__item > .search-input > .ivu-input').should('have.attr','placeholder','Email')
    cy.get(':nth-child(3) > .table-filter__item > .search-input > .ivu-input').should('have.attr','placeholder','Телефон')
    cy.get(':nth-child(4) > .table-filter__item > .search-input > .ivu-select-selection > div > .ivu-select-input').should('have.attr','placeholder','Мероприятие')
    cy.get('.ivu-date-picker-rel > .ivu-input-wrapper > .ivu-input')
    cy.get('.ivu-col-span-2 > .ivu-btn > .ivu-icon')
    cy.get('.ivu-col-span-2 > .ivu-btn').click()
    cy.get(':nth-child(5) > .table-filter__item > .search-input > .ivu-input').should('have.attr','placeholder','Фамилия')
    cy.get(':nth-child(6) > .table-filter__item > .search-input > .ivu-input').should('have.attr','placeholder','Имя')
    cy.get(':nth-child(7) > .table-filter__item > .search-input > .ivu-input').should('have.attr','placeholder','Отчество')
    cy.get(':nth-child(8) > .table-filter__item > .search-input > .ivu-select-selection > div > .ivu-select-input').should('have.attr','placeholder','Юр. лицо')
    cy.get(':nth-child(8) > .table-filter__item > .search-input > .ivu-select-selection > div > i')
    cy.get('.ivu-date-picker-rel > .ivu-input-wrapper > .ivu-input').should('have.attr','placeholder','Дата создания')
    cy.get('.ivu-input-suffix > .ivu-icon')
    cy.get(':nth-child(1) > .ivu-table-cell > .ivu-table-cell-sort').should('text','ID')
    cy.get(':nth-child(1) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropdown')
    cy.get(':nth-child(1) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropup')
    cy.get(':nth-child(2) > .ivu-table-cell > .ivu-table-cell-sort').should('text','Email')
    cy.get(':nth-child(2) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropdown')
    cy.get(':nth-child(2) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropup')
    cy.get(':nth-child(3) > .ivu-table-cell > .ivu-table-cell-sort').should('text','Телефон')
    cy.get(':nth-child(3) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropdown')
    cy.get(':nth-child(3) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropup')
    cy.get(':nth-child(4) > .ivu-table-cell > .ivu-table-cell-sort').should('text','ФИО')
    cy.get(':nth-child(4) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropdown')
    cy.get(':nth-child(4) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropup')
    cy.get('thead > tr > :nth-child(5) > .ivu-table-cell > span').should('text','Название мероприятия')
    cy.get('thead > tr > :nth-child(6) > .ivu-table-cell > span').should('text','Дата регистрации')
    cy.get('thead > tr > .ivu-table-column-center > .ivu-table-cell')
    cy.get('.table-pagination__info')
    cy.get('.ivu-page-prev > a > .ivu-icon')
    cy.get('.ivu-page-item')
    cy.get('.ivu-page-next')
    cy.get('.ivu-card-body__btn-create > .ivu-icon')
    cy.get('.ivu-card-body__btn-create > span').should('text','\n      Создать отчет\n    ').click()
    cy.get('.ivu-message-custom-content > span').should('text','Вы успешно сформировали отчет')

  }) */

  it('materials', function () {
    cy.visit('http://panel.cto.s256.ru/requests/list')
    cy.url().should('eq', 'http://panel.cto.s256.ru/requests/list')
    // Визуальная проверка страницы Материалы
    cy.get('.ivu-divider-inner-text').should('text', 'Материалы')
    cy.get(':nth-child(1) > .table-filter__item > .search-input > .ivu-input').should(
      'have.attr',
      'placeholder',
      'ID'
    )
    cy.get(
      ':nth-child(2) > .table-filter__item > .search-input > .ivu-select-selection > div > .ivu-select-input'
    ).should('have.attr', 'placeholder', 'Мероприятие')
    cy.get(
      ':nth-child(2) > .table-filter__item > .search-input > .ivu-select-selection > div > .ivu-icon'
    )
    cy.get(
      ':nth-child(3) > .table-filter__item > .search-input > .ivu-select-selection > div > .ivu-select-input'
    ).should('have.attr', 'placeholder', 'Категория материала')
    cy.get(
      ':nth-child(3) > .table-filter__item > .search-input > .ivu-select-selection > div > .ivu-icon'
    )
    cy.get(':nth-child(4) > .table-filter__item > .search-input > .ivu-input').should(
      'have.attr',
      'placeholder',
      'Название материала'
    )
    cy.get('.ivu-col-span-2 > .ivu-btn > .ivu-icon')
    cy.get('.ivu-col-span-2 > .ivu-btn').click()
    cy.get(':nth-child(5) > .table-filter__item > .search-input > .ivu-input').should(
      'have.attr',
      'placeholder',
      'Email'
    )
    cy.get(':nth-child(6) > .table-filter__item > .search-input > .ivu-input').should(
      'have.attr',
      'placeholder',
      'Имя'
    )
    cy.get(':nth-child(7) > .table-filter__item > .search-input > .ivu-input').should(
      'have.attr',
      'placeholder',
      'Отчество'
    )
    cy.get(
      ':nth-child(8) > .table-filter__item > .search-input > .ivu-select-selection > div > .ivu-select-input'
    ).should('have.attr', 'placeholder', 'Юр. лицо')
    cy.get(
      ':nth-child(8) > .table-filter__item > .search-input > .ivu-select-selection > div > .ivu-icon'
    )
    cy.get(':nth-child(9) > .table-filter__item > .search-input > .ivu-input').should(
      'have.attr',
      'placeholder',
      'Фамилия'
    )
    cy.get('.ivu-date-picker-rel > .ivu-input-wrapper > .ivu-input').should(
      'have.attr',
      'placeholder',
      'Дата создания'
    )
    cy.get('.ivu-input-suffix > .ivu-icon')

    cy.get(':nth-child(1) > .ivu-table-cell > .ivu-table-cell-sort').should('text', 'ID')
    cy.get(':nth-child(1) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropup')
    cy.get(':nth-child(1) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropdown')
    cy.get(':nth-child(2) > .ivu-table-cell > .ivu-table-cell-sort').should('text', 'ФИО')
    cy.get(':nth-child(2) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropup')
    cy.get(':nth-child(2) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropdown')
    cy.get(':nth-child(3) > .ivu-table-cell > .ivu-table-cell-sort').should(
      'text',
      'Название материала'
    )
    cy.get(':nth-child(3) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropup')
    cy.get(':nth-child(3) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropdown')
    cy.get(':nth-child(4) > .ivu-table-cell > .ivu-table-cell-sort').should('text', 'Телефон')
    cy.get(':nth-child(4) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropup')
    cy.get(':nth-child(4) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropdown')
    cy.get(':nth-child(5) > .ivu-table-cell > .ivu-table-cell-sort').should('text', 'Дата подачи')
    cy.get(':nth-child(5) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropup')
    cy.get(':nth-child(5) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropdown')
    cy.get('.table-pagination__info')
    cy.get('.ivu-page-prev > a > .ivu-icon')
    cy.get('.ivu-page-item')
    cy.get('.ivu-page-next')
    cy.get('.ivu-card-body__btn-create > .ivu-icon')
    cy.get('.ivu-card-body__btn-create > span').should('text', '\n      Создать отчет\n    ')
  })
  it('Заказы orders', function () {
    cy.visit('http://panel.cto.s256.ru/orders/list')
    cy.url().should('eq', 'http://panel.cto.s256.ru/orders/list')
    // Визуальная проверка страницы Заказы
    cy.get('.ivu-divider-inner-text').should('text', 'Заказы')
    cy.get(':nth-child(1) > .table-filter__item > .search-input > .ivu-input').should(
      'have.attr',
      'placeholder',
      'ID'
    )
    cy.get(':nth-child(2) > .table-filter__item > .search-input > .ivu-input').should(
      'have.attr',
      'placeholder',
      'Email'
    )
    cy.get(
      ':nth-child(3) > .table-filter__item > .search-input > .ivu-select-selection > div > .ivu-select-input'
    ).should('have.attr', 'placeholder', 'Мероприятие')
    cy.get(
      ':nth-child(3) > .table-filter__item > .search-input > .ivu-select-selection > div > .ivu-icon'
    )
    cy.get(
      ':nth-child(4) > .table-filter__item > .search-input > .ivu-select-selection > div > .ivu-select-input'
    ).should('have.attr', 'placeholder', 'Статус оплаты')
    cy.get(
      ':nth-child(4) > .table-filter__item > .search-input > .ivu-select-selection > div > .ivu-icon'
    )
    cy.get('.ivu-col-span-2 > .ivu-btn > .ivu-icon')
    cy.get('.ivu-col-span-2 > .ivu-btn').click()
    cy.get(':nth-child(5) > .table-filter__item > .search-input > .ivu-input').should(
      'have.attr',
      'placeholder',
      'Фамилия'
    )
    cy.get(
      ':nth-child(6) > .table-filter__item > .search-input > .ivu-select-selection > div > .ivu-select-input'
    ).should('have.attr', 'placeholder', 'Статус заказа')
    cy.get(
      ':nth-child(6) > .table-filter__item > .search-input > .ivu-select-selection > div > .ivu-icon'
    )
    cy.get(':nth-child(7) > .table-filter__item > .search-input > .ivu-input').should(
      'have.attr',
      'placeholder',
      'Отчество'
    )
    cy.get(
      ':nth-child(8) > .table-filter__item > .search-input > .ivu-select-selection > div > .ivu-select-input'
    ).should('have.attr', 'placeholder', 'Юр. лицо')
    cy.get(
      ':nth-child(8) > .table-filter__item > .search-input > .ivu-select-selection > div > .ivu-icon'
    )
    cy.get('.ivu-date-picker-rel > .ivu-input-wrapper > .ivu-input').should(
      'have.attr',
      'placeholder',
      'Дата создания'
    )
    cy.get('.ivu-input-suffix > .ivu-icon')
    cy.get(':nth-child(10) > .table-filter__item > .search-input > .ivu-input').should(
      'have.attr',
      'placeholder',
      'Имя'
    )

    cy.get(':nth-child(1) > .ivu-table-cell > .ivu-table-cell-sort').should('text', 'ID')
    cy.get(':nth-child(1) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropup')
    cy.get(':nth-child(1) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropdown')
    cy.get(':nth-child(2) > .ivu-table-cell > .ivu-table-cell-sort').should('text', 'Статус')
    cy.get(':nth-child(2) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropup')
    cy.get(':nth-child(2) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropdown')
    cy.get(':nth-child(3) > .ivu-table-cell > .ivu-table-cell-sort').should('text', 'ФИО')
    cy.get(':nth-child(3) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropup')
    cy.get(':nth-child(3) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropdown')
    cy.get('thead > tr > :nth-child(4) > .ivu-table-cell > span').should(
      'text',
      'Название мероприятия'
    )
    cy.get(':nth-child(5) > .ivu-table-cell > .ivu-table-cell-sort').should('text', 'Сумма')
    cy.get(':nth-child(5) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropup')
    cy.get(':nth-child(5) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropdown')
    cy.get(':nth-child(6) > .ivu-table-cell > .ivu-table-cell-sort').should('text', 'Оплата')
    cy.get(':nth-child(6) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropup')
    cy.get(':nth-child(6) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropdown')
    cy.get(':nth-child(7) > .ivu-table-cell > .ivu-table-cell-sort').should('text', 'Дата создания')
    cy.get(':nth-child(7) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropup')
    cy.get(':nth-child(7) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropdown')
    cy.get(':nth-child(8) > .ivu-table-cell > span')
    cy.get('.table-pagination__info')
    cy.get('.ivu-page-prev > a > .ivu-icon')
    cy.get('.ivu-page-item')
    cy.get('.ivu-page-next')
  })

  it('users', function () {
    cy.visit('http://panel.cto.s256.ru/users/list')
    cy.url().should('eq', 'http://panel.cto.s256.ru/users/list')
    // Визуальная проверка страницы Пользователи
    cy.get('.ivu-divider-inner-text').should('text', 'Пользователи')
    cy.get('a.ivu-card-body__btn-create > .ivu-icon')
    cy.get('a.ivu-card-body__btn-create > span').should(
      'text',
      '\n      Создать пользователя\n    '
    )
    cy.get('button.ivu-card-body__btn-create > .ivu-icon')
    cy.get('button.ivu-card-body__btn-create > span').should('text', '\n      Создать отчет\n    ')
    cy.get(':nth-child(1) > .table-filter__item > .search-input > .ivu-input').should(
      'have.attr',
      'placeholder',
      'ID'
    )
    cy.get(':nth-child(2) > .table-filter__item > .search-input > .ivu-input').should(
      'have.attr',
      'placeholder',
      'Фамилия'
    )
    cy.get(':nth-child(3) > .table-filter__item > .search-input > .ivu-input').should(
      'have.attr',
      'placeholder',
      'Имя'
    )
    cy.get(':nth-child(4) > .table-filter__item > .search-input > .ivu-input').should(
      'have.attr',
      'placeholder',
      'Отчество'
    )
    cy.get('.ivu-col-span-2 > .ivu-btn > .ivu-icon')
    cy.get('.ivu-col-span-2 > .ivu-btn').click()
    cy.get(':nth-child(5) > .table-filter__item > .search-input > .ivu-input').should(
      'have.attr',
      'placeholder',
      'Email'
    )
    cy.get(':nth-child(6) > .table-filter__item > .search-input > .ivu-input').should(
      'have.attr',
      'placeholder',
      'Номер телефона'
    )
    cy.get('.ivu-date-picker-rel > .ivu-input-wrapper > .ivu-input').should(
      'have.attr',
      'placeholder',
      'Дата создания'
    )
    cy.get('.ivu-input-suffix > .ivu-icon')

    cy.get(':nth-child(1) > .ivu-table-cell > .ivu-table-cell-sort').should('text', 'ID')
    cy.get(':nth-child(1) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropup')
    cy.get(':nth-child(1) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropdown')
    cy.get(':nth-child(2) > .ivu-table-cell > .ivu-table-cell-sort').should('text', 'ФИО')
    cy.get(':nth-child(2) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropup')
    cy.get(':nth-child(2) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropdown')
    cy.get(':nth-child(3) > .ivu-table-cell > .ivu-table-cell-sort').should('text', 'Email')
    cy.get(':nth-child(3) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropup')
    cy.get(':nth-child(3) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropdown')
    cy.get('thead > tr > :nth-child(4) > .ivu-table-cell > span').should('text', 'Телефон ')
    cy.get(':nth-child(4) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropup')
    cy.get(':nth-child(4) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropdown')
    cy.get(':nth-child(5) > .ivu-table-cell > .ivu-table-cell-sort').should(
      'text',
      'Дата регистрации'
    )
    cy.get(':nth-child(5) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropup')
    cy.get(':nth-child(5) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropdown')
    cy.get('.ivu-table-column-center > .ivu-table-cell > span')
    cy.get('.table-pagination__info')
    cy.get('.ivu-page-prev > a > .ivu-icon')
    cy.get('.ivu-page-item')
    cy.get('.ivu-page-next')
  })
})
