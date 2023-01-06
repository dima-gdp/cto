Cypress.Commands.add('login', (email, password) => {
  cy.request('POST', Cypress.env('apiUrl') + '/api/v1/user/auth', {
    data: { type: 'logins', attributes: { email: email, password: password } },
  }).then((response) => {
    const token = response.body.data.attributes.token
    const userId = response.body.data.id
    cy.setCookie('token', token)
    cy.setCookie('user', `${userId}`)
  })
})
