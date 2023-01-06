it('Отчеты reports', function () {
  cy.visit('http://panel.cto.s256.ru/reports/list')
  cy.url().should('eq', 'http://panel.cto.s256.ru/reports/list')
  // Визуальная проверка страницы Отчеты
  cy.get('.ivu-divider-inner-text').should('text', 'Отчеты')
  cy.get(':nth-child(1) > .table-filter__item > .search-input > .ivu-input').should(
    'have.attr',
    'placeholder',
    'ID'
  )
  cy.get(':nth-child(2) > .table-filter__item > .search-input > .ivu-input').should(
    'have.attr',
    'placeholder',
    'Наименование'
  )
  cy.get(':nth-child(1) > .ivu-table-cell > .ivu-table-cell-sort').should('text', 'ID')
  cy.get(':nth-child(1) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropup')
  cy.get(':nth-child(1) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropdown')
  cy.get(':nth-child(2) > .ivu-table-cell > .ivu-table-cell-sort').should('text', 'Наименование')
  cy.get(':nth-child(2) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropup')
  cy.get(':nth-child(2) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropdown')
  cy.get(':nth-child(3) > .ivu-table-cell > .ivu-table-cell-sort').should('text', 'Создан')
  cy.get(':nth-child(3) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropup')
  cy.get(':nth-child(3) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropdown')
  cy.get(':nth-child(4) > .ivu-table-cell > .ivu-table-cell-sort').should('text', 'Статус')
  cy.get(':nth-child(4) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropup')
  cy.get(':nth-child(4) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropdown')
  cy.get(':nth-child(5) > .ivu-table-cell > .ivu-table-cell-sort').should('text', 'Готовность')
  cy.get(':nth-child(5) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropup')
  cy.get(':nth-child(5) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropdown')
  cy.get(':nth-child(6) > .ivu-table-cell > span').should('text', 'Скачать')
  cy.get('.table-pagination__info')
  cy.get('.ivu-page-prev > a > .ivu-icon')
  cy.get('.ivu-page-item-active > a')
  cy.get('.ivu-page-next > a > .ivu-icon')
  cy.get('.ivu-table-tbody > :nth-child(1) > :nth-child(1) > .ivu-table-cell > span') // .should('text','1')
  cy.get('.ivu-table-tbody > :nth-child(1) > :nth-child(2) > .ivu-table-cell > span').should(
    'text',
    'Выгрузка анкет'
  )
  const t = cy.clock()
  // alert(Date.now())
  const now = new Date()
  alert(now.toLocaleString())
  // cy.get('.ivu-table-tbody > :nth-child(1) > :nth-child(3) > .ivu-table-cell > span').should('text',now.toLocaleString())
  cy.get(':nth-child(1) > :nth-child(4) > .ivu-table-cell > .ivu-tag > .ivu-tag-text').should(
    'text',
    'Не просмотрен'
  )
  // cy.get(':nth-child(1) > :nth-child(5) > .ivu-table-cell > .ivu-tag > .ivu-tag-text').should('text','Отчет готовится')
  // cy.get(':nth-child(1) > :nth-child(6) > .ivu-table-cell > .ivu-btn').should('text','')

  // cy.get(':nth-child(1) > :nth-child(6) > .ivu-table-cell > .ivu-btn').waite().should('text','Скачать')
})
