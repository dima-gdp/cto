/// <reference types="Cypress" />

context('Actions', () => {
  beforeEach(() => {
    cy.visit('https://fineuploader.com/demos.html')
  })

  it('file upload demo', () => {
    cy.fixture('EAWeekly.png').then((fileContent) => {
      cy.get(
        '#fine-uploader-gallery > .qq-uploader-selector > .qq-upload-button-selector > input'
      ).upload(
        {
          fileContent,
          fileName: 'EAWeekly.png',
          mimeType: 'image/png',
        },
        {
          uploadType: 'input',
        }
      )
    })
  })
})
