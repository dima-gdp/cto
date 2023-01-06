describe('Trying to implement drag-n-drop', () => {
  before(() => {
    // Cypress.config('baseUrl', null);

    cy.viewport(1000, 600)
    cy.wait(2000)
    cy.visit('http://angular-oxkc7l-zirwfs.stackblitz.io')
    cy.wait(5000)
    cy.url().should('contain', 'angular').get('h2').should('contain', 'To do')
  })

  it('works (simply)', () => {
    const draggable = Cypress.$('#cdk-drop-list-0 > :nth-child(1)')[0] // Pick up this
    const droppable = Cypress.$('#cdk-drop-list-1 > :nth-child(4)')[0] // Drop over this

    const coords = droppable.getBoundingClientRect()
    draggable.dispatchEvent(new MouseEvent('mousedown'))
    draggable.dispatchEvent(new MouseEvent('mousemove', { clientX: 10, clientY: 0 }))
    draggable.dispatchEvent(
      new MouseEvent('mousemove', {
        clientX: coords.x + 10,
        clientY: coords.y + 10, // A few extra pixels to get the ordering right
      })
    )
    draggable.dispatchEvent(new MouseEvent('mouseup'))

    cy.get('#cdk-drop-list-1').should('contain', 'Get to work')
    cy.get('#cdk-drop-list-1 > .cdk-drag').eq(3).should('contain', 'Get to work')
  })
})
