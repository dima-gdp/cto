describe('Авторизация', function () {
  it('Вход в панель', function () {
    cy.setCookie('token', '')
    cy.setCookie('user', '')
    cy.server()
    cy.route({ method: 'POST', url: '/api/v1/user/auth' }).as('UserAuth')
    cy.visit('login')
    cy.contains('h1', 'Авторизация')
    cy.get(':nth-child(1) > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input').type(
      Cypress.env('userName')
    )
    cy.get(':nth-child(2) > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input').type(
      Cypress.env('userPassword')
    )
    cy.contains('Войти').click()
    cy.wait('@UserAuth').should('have.property', 'status', 200)

    cy.contains('Сводная информация')
  })
})
