/// <reference types="Cypress" />

before(function () {
  cy.login('admin@s256.ru', 'devmydev')
})

describe('Check import', () => {
  it('file upload import', () => {
    cy.visit('http://panel.cto.s256.ru/home')
    cy.get(':nth-child(9) > span').should('text', 'Импорты').click()
    cy.main()
    cy.url().should('eq', 'http://panel.cto.s256.ru/imports/list')
    // Визуальная проверка страницы Импорты
    cy.get('.ivu-divider-inner-text').should('text', '\n          Импорты\n        ')
    cy.get('.ivu-card-body__btn-create > .ivu-icon')
    cy.get('.ivu-card-body__btn-create > span').should('text', '\n      Создать импорт\n    ')
    cy.get(':nth-child(1) > .ivu-table-cell > .ivu-table-cell-sort').should('text', 'ID')
    cy.get(':nth-child(1) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropup')
    cy.get(':nth-child(1) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropdown')
    cy.get(':nth-child(2) > .ivu-table-cell > .ivu-table-cell-sort').should('text', 'Дата создания')
    cy.get(':nth-child(2) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropup')
    cy.get(':nth-child(2) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropdown')
    cy.get(':nth-child(3) > .ivu-table-cell > .ivu-table-cell-sort').should('text', 'Файл импорта')
    cy.get(':nth-child(3) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropup')
    cy.get(':nth-child(3) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropdown')
    cy.get('thead > tr > :nth-child(4) > .ivu-table-cell > span').should('text', 'Статус ')
    cy.get(':nth-child(4) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropup')
    cy.get(':nth-child(4) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropdown')
    cy.get('thead > tr > :nth-child(5) > .ivu-table-cell').should('text', 'Комментарий   ')
    cy.get(':nth-child(5) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropup')
    cy.get(':nth-child(5) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropdown')
    cy.get('thead > tr > :nth-child(6) > .ivu-table-cell > span').should('text', 'Импортировал')
    cy.get('.table-pagination__info')
    cy.get('.ivu-page-prev > a > .ivu-icon')
    cy.get('.ivu-page-item')
    cy.get('.ivu-page-next')

    cy.get('.ivu-card-body__btn-create > .ivu-icon')
    cy.get('.ivu-card-body__btn-create > span')
      .should('text', '\n      Создать импорт\n    ')
      .click()
    cy.get('p > .ivu-icon')
    cy.get('p > span').should('text', 'Импортировать')
    cy.get(':nth-child(1) > .ivu-form-item-label').should('text', 'Модели импорта')
    cy.get('.ivu-select-placeholder').should('text', 'выберите модель импорта')
    cy.get('.ivu-icon.ivu-icon-ios-arrow-down.ivu-select-arrow')
    cy.get(':nth-child(2) > .ivu-form-item-label').should('text', 'Файл импорта')
    cy.get('.ivu-upload > div > p').should('text', '\n        Загрузите файл импора: .xlsx\n      ')
    // проверяем обязательность полей
    cy.get('.import-detail__btn-block > .ivu-btn > span')
      .should('text', '\n          Импортировать\n        ')
      .click()
    cy.get('.ivu-message-custom-content > span').should('text', 'В форме есть ошибки!')
    cy.get(':nth-child(1) > .ivu-form-item-content > .ivu-form-item-error-tip').should(
      'text',
      'Не может быть пустым полем'
    )
    cy.get(':nth-child(2) > .ivu-form-item-content > .ivu-form-item-error-tip').should(
      'text',
      'Не может быть пустым полем'
    )
    // проверяем обязательность поля загрузки файла
    cy.get('.ivu-icon.ivu-icon-ios-arrow-down.ivu-select-arrow').click()
    cy.get('.ivu-select-item')
      .should('text', '\n                Импорт пользователей\n              ')
      .click()
    cy.get('.ivu-select-selected-value').should(
      'text',
      '\n                Импорт пользователей\n              '
    )
    cy.get('.import-detail__btn-block > .ivu-btn').click()
    cy.get('.ivu-message-custom-content > span').should('text', 'В форме есть ошибки!')
    cy.get(':nth-child(1) > .ivu-form-item-content > .ivu-form-item-error-tip').should(
      'not.be',
      'visible'
    )
    cy.get(':nth-child(2) > .ivu-form-item-content > .ivu-form-item-error-tip').should(
      'text',
      'Не может быть пустым полем'
    )

    // загружаем файл
    cy.server()
    cy.route({
      method: 'POST',
      url: '/api/v1/files/file/upload',
    }).as('upload')

    cy.get('.ivu-upload > div > .ivu-icon').click()
    cy.fixture('importTest.xlsx').then((fileContent) => {
      cy.get(':nth-child(1) > :nth-child(1) > .ivu-upload > input').upload(
        {
          fileContent,
          fileName: 'importTest.xlsx',
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          encoding: 'utf-8',
          content_encoding: ' ',
        },
        {
          // uploadType: 'input'
          subjectType: 'input',
        }
      )
      /* cy.get('.ivu-message-custom-content').as('sucsess').then((suc)=>{
                expect(suc).itself.value('Файл успешно загружен')

            }) */
    })
    cy.wait('@upload').then((xhr) => {
      assert('xhr.status', '200')
    })

    // проверяем, что файл загрузился и проверяем, что его можно удалить
    cy.get('.upload-info__text').should('contain', 'Прикреплен файл:')
    cy.get('.ivu-progress-bg') // прогресс-бар зеленый
    cy.get('.upload-info__delete').click() // удаляем файл
    cy.wait(6000)
    cy.get('.upload-info__text').should('not.be', 'visible')
    cy.get('.ivu-progress-bg').should('not.be', 'visible') // прогресс-бар

    cy.get('.import-detail__btn-block > .ivu-btn').click() // нажимаем Импортировать - ошибка (так как файл для импорта удалили)
    cy.get('.ivu-message-custom-content > span').should('text', 'В форме есть ошибки!')
    cy.get(':nth-child(1) > .ivu-form-item-content > .ivu-form-item-error-tip').should(
      'not.be',
      'visible'
    )
    cy.get(':nth-child(2) > .ivu-form-item-content > .ivu-form-item-error-tip').should(
      'text',
      'Не может быть пустым полем'
    )
    cy.wait(3000)

    // снова добавляем файл и импортируем его
    cy.get('.ivu-upload > div > .ivu-icon').click()
    cy.fixture('importTest.xlsx').then((fileContent) => {
      cy.get(':nth-child(1) > :nth-child(1) > .ivu-upload > input').upload(
        {
          fileContent: fileContent,
          fileName: 'importTest.xlsx',
          // mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          // fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          encoding: 'utf8',
        },
        {
          // uploadType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          uploadType: 'input',
        }
      )
    })

    /* describe('Testing the excel form', function () {
           // it ('Uploading the right file imports data from the excel successfully', function() {

               // const testUrl = 'http://localhost:3000/excel_form';
                const fileName = 'importTest.xlsx';
                const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
                const fileInput = 'input[type=file]';

              //  cy.visit(testUrl);
                cy.upload_file(fileName, fileType, fileInput);
                cy.get('#other_form_input2').type('input_content2');
                .
                .
                .
                cy.get('button').contains('Submit').click();

                cy.get('.result-dialog').should('contain', 'X elements from the excel where successfully imported');
            })
        }) */

    cy.wait('@upload').then((xhr) => {
      assert('xhr.status', '200')
    })

    // проверяем, что файл загрузился
    cy.get('.upload-info__text').should('contain', 'Прикреплен файл:')
    cy.get('.ivu-progress-bg') // прогресс-бар зеленый

    cy.get('.import-detail__btn-block > .ivu-btn').click() // нажимаем Импортировать
    // cy.get('.ivu-message-custom-content > span').should('text','Импорт загружен')
    // проверяем, что перешли на список импортов и проверяем, что добавился наш импорт
    /* cy.url().should('eq','http://panel.cto.s256.ru/imports/list')
        cy.get('.ivu-table-tbody > :nth-child(1) > :nth-child(1) > .ivu-table-cell > span')
        cy.get('.ivu-table-tbody > :nth-child(1) > :nth-child(2) > .ivu-table-cell > span')
        cy.get(':nth-child(1) > :nth-child(3) > .ivu-table-cell > .ivu-btn').should('text','Импорт пользователей')
        cy.get(':nth-child(1) > :nth-child(4) > .ivu-table-cell > .ivu-tag > .ivu-tag-text').should('text','Импорт в очереди')
        cy.get('.ivu-table-tbody > :nth-child(1) > :nth-child(6) > .ivu-table-cell > span') */
  })
})
