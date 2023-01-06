import './commands'

Cypress.Cookies.defaults({
  whitelist: ['token', 'user'],
})

require('cypress-dark')
require('cypress-drag-drop')
