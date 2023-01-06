describe('Main page', function () {
  before(function () {
    cy.login(Cypress.env('userName'), Cypress.env('userPassword'))
  })
  it('Check main page', function () {
    cy.visit('home')

    cy.main()
  })
})
