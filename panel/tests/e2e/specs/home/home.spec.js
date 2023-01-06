describe('Вход ранее авторизованного пользователя', function () {
  before(function () {
    cy.login(Cypress.env('userName'), Cypress.env('userPassword'))
  })
  it('Открытие страницы', function () {
    cy.visit('home')
    cy.main()
  })
})
