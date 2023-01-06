describe('Список юр.лиц', function () {
  before(function () {
    cy.login(Cypress.env('userName'), Cypress.env('userPassword'))
  })
  it('Проверка страницы и загрузки данных', function () {
    cy.server()
    cy.route('GET', '/api/v1/legal-entity?sort=-id').as('legalEntity')
    cy.visit('/juridical/list')
    cy.main()
    cy.wait('@legalEntity')
      .should('have.property', 'status', 200)
      .then((xhr) => {})
  })

  it('Проверка поиска', function () {
    cy.server()
    cy.route({ method: 'GET', url: '/api/v1/legal-entity?*' }).as('searchEntity')
    cy.get('.ivu-input').type('9999999{enter}')
    cy.wait('@searchEntity').should('have.property', 'status', 200)
    cy.get('td > span').should('text', 'Нет данных')
  })
})
