/// <reference types="Cypress" />
describe('Test LambdaTest Website XHR', () => {
  before('visit proper page', () => {
    cy.visit('http://med.s256.ru/')
    cy.get('.header__enter-block > [href="/user/sign-in/login"]').click()
  })
  it('Perform login and verify XHR', () => {
    // Start the server
    cy.server()
    cy.route({
      method: 'GET',
      url: '/api/v1/module/shedule?page=1&per-page=6',
    }).as('schedule')

    cy.fixture('TestUser').as('testuser')
    cy.get('@testuser').then((testuser) => {
      cy.get(':nth-child(1) > .el-form-item__content > .el-input > .el-input__inner')
        .debug()
        .type(testuser.UserName)
      // cy.get('.input-append-btn > .el-input__inner').debug().type(testuser.Password,{log:false});
      cy.xpath('//input[@type="password"]').type(testuser.Password, { log: false })
    })
    cy.get('.btn-block-login > .el-button--primary').click()

    cy.wait('@schedule').then((xhr) => {
      assert('xhr.status', '200')
    })
  })
})
