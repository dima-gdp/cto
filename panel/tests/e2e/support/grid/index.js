Cypress.Commands.add('pagination', (xhr, alias) => {
  // Создаем переменную с мета информацией для удобства работы с ней
  const meta = xhr.responseBody.meta

  const { perPage, totalCount, pageCount } = cy.common.parseMeta(meta)

  // Прореряе что в пагинации есть именно это кол-во обьектов
  cy.get('.table-pagination__info').contains(`Всего ${totalCount} записей`)
  // Проверяем что по умолчанию первая страница и то вернуться на предыдущую страницу нельзя
  cy.get('.ivu-page-item-active').contains('1')
  cy.get('.ivu-page-prev').should('have.class', 'ivu-page-disabled')
  // Если страница одна
  if (pageCount > 1) {
    // Переход на следующую страницу
    cy.get('.ivu-page-next').click()
    // Ожидание успешного ответа
    cy.wait(alias).its('status').should('eq', 200)
    // Проверка что можно вернуться назад
    cy.get('.ivu-page-prev').should('not.have.class', 'ivu-page-disabled')
    // Перезод на страницу назад
    cy.get('.ivu-page-prev').click()
    // Ожидание успешного ответа
    cy.wait(alias).its('status').should('eq', 200)
    // Если страниц больше 5
    if (pageCount > 5) {
      // Переход по кнопке + 5 страниц
      cy.get('.ivu-page-item-jump-next').click()
      // Ожидание успешного ответа
      cy.wait(alias).its('status').should('eq', 200)
      // Проверка что текущая страница именно 6
      cy.get('.ivu-page-item-active').contains('6')
      // Возврат на - 5 страниц
      cy.get('.ivu-page-item-jump-prev').click()
      // Ожидание успешного ответа
      cy.wait(alias).its('status').should('eq', 200)
    }
    // Проверка что последняя страница именно та, что пришло в api
    cy.get(`.table-pagination__pagination [title="${pageCount}"]`).contains(pageCount)
    // Переход на последнюю страницу
    cy.get(`.table-pagination__pagination [title="${pageCount}"]`).click()
    // Ожидание успешного ответа
    cy.wait(alias).its('status').should('eq', 200)
    // Переход на первую страницу
    cy.get('.table-pagination__pagination [title="1"]').click()
    // Ожидание успешного ответа
    cy.wait(alias).its('status').should('eq', 200)
  }
})
