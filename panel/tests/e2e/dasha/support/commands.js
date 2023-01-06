// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import 'cypress-file-upload'

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

/* Cypress.Commands.add("loginToPortal", (email, password) => {

  cy.request('POST', 'http://apicto.s256.ru/api/v1/user/login?lang=ru', {data:{type:"login",attributes:{email:email,password:password}}})
    .then((response) => {
      let token = response.body.token
      let userId = response.body.id
      //cy.setTokens({ token: this.bearerToken });
      //cy.setCookie('token', token)
      //cy.setCookie('user', `${userId}`)
      //cy.request('GET', 'http://apicto.s256.ru/api/v1/user/exist?email=daria.studio256@gmail.com&lang=ru', {headers: {
    //Authorization: `Bearer ${token}`}})
    cy.request({
      url: "http://apicto.s256.ru/api/v1/user/exist?email=daria.studio256@gmail.com&lang=ru",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  })
    //cy.visit('http://public.cto.s256.ru/user-profile/shop')

        /*.then((response) => {
        //let email = response.body.meta.email
        let exist = response.body.meta.exist
        //cy.setCookie('email', `${email}`)
        cy.setCookie('exist', `true`)

    })
})

Cypress.Commands.add("getCompanies", token => {
  cy.request({
    url: "http://apicto.s256.ru/api/v1/user/exist?email=daria.studio256@gmail.com&lang=ru",
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).then(response => {
    var matchedCompany = [];
    const companies = response.body;
    companies.forEach(function(element, index) {
      if (companies[index].name.includes("test-")) {
        matchedCompany.push(companies[index].id);
      }
    });
    cy.wrap(matchedCompany).as("testCompanies");
  });
});

  Cypress.Commands.add("deleteTestCompanies", token => {
  cy.getCompanies().then(companies => {
    companies.forEach(function(element, index) {
      cy.request({
        method: "DELETE",
        url: `http://apicto.s256.ru/api/v1/user/exist?email=daria.studio256@gmail.com&lang=ru/${companies[index]}`,
        headers: {
          Authorization: `Bearer ${token}`,
          //"Content-type": "application/json"
        }
      });
    });
  });
}); */

Cypress.Commands.add('main', () => {
  const menuItems = [
    'Личные кабинеты',
    'Мероприятия',
    'Анкеты',
    'Материалы',
    'Заказы',
    'Формы',
    'Формы сбора данных',
    'Поля для форм',
    'Таблица тегов',
    'Пользователи',
    'Базы пользователей',
    'Пользователи',
    'Юр. лица',
    'Отчеты',
    'Импорты',
  ]
  cy.get('.logo-con > :nth-child(1)').should('be.visible')
  cy.get('.ivu-badge > a > .ivu-icon').should('have.attr', 'style', 'font-size: 21px;')
  cy.get('.header-bar__logout > div > .ivu-icon').should(
    'have.attr',
    'style',
    'font-size: 21px; color: rgb(237, 64, 20);'
  )
  for (const item of menuItems) {
    cy.get('.ivu-menu-light').contains(item)
  }
  cy.get('.ivu-menu-light > :nth-child(1) > .ivu-icon').should(
    'have.attr',
    'style',
    'font-size: 17px;'
  )
})

Cypress.Commands.add('juridical', () => {
  cy.get('.ivu-divider-inner-text').should('text', 'Юр. лица')
  cy.get('.ivu-card-body__btn-create > .ivu-icon')
  cy.get('.ivu-card-body__btn-create > span').should('text', '\n      Создать юр. лицо\n    ')
  cy.get('.ivu-card-body__btn-create').should('have.css', 'background-color', 'rgb(45, 140, 240)')
  cy.get('.ivu-input').should('have.attr', 'placeholder', 'ID')
  cy.get(':nth-child(1) > .ivu-table-cell > .ivu-table-cell-sort').should('text', 'ID')
  cy.get(':nth-child(1) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropup')
  cy.get(':nth-child(1) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropdown')
  cy.get(':nth-child(2) > .ivu-table-cell > .ivu-table-cell-sort').should(
    'text',
    'Внутреннее название юр.лица'
  )
  cy.get(':nth-child(2) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropup')
  cy.get(':nth-child(2) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropdown')
  cy.get('.ivu-table-column-center > .ivu-table-cell > span')
  cy.wait(3000)
  cy.get('.ivu-table-tbody > :nth-child(1) > :nth-child(1) > .ivu-table-cell > span') // в оригинале изначально нет ни одного юр лица - т е здесь пусто .should('not.exist')
  cy.get('.table-pagination__info')
  cy.contains('Всего').contains('записей')
  cy.get('.ivu-page-next > a > .ivu-icon')
  cy.get('.ivu-page-item > a')
  cy.get('.ivu-page-next > a > .ivu-icon')
})

Cypress.Commands.add('CreateJuridical', () => {
  // cy.get('p > .ivu-icon')
  cy.wait(14500)
  cy.get('.juridical-detail-edit__title').should('text', 'Основная информация')
  cy.get(':nth-child(1) > .ivu-form-item > .ivu-form-item-label').should('text', 'Тех. название:')
  cy.get(
    ':nth-child(1) > .ivu-form-item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
  )
    .should('have.attr', 'placeholder', 'используется внутри админ. панели')
    .type('test', { force: true })
    .should('have.value', 'test')
  cy.get(':nth-child(2) > .ivu-form-item > .ivu-form-item-label').should('text', 'Полное название:')
  cy.get(
    ':nth-child(2) > .ivu-form-item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
  )
    .should('have.attr', 'placeholder', 'полное название юр. лица')
    .type('test juridical')
    .should('have.value', 'test juridical')
  cy.get('.ivu-btn-primary > span').should('text', 'Сохранить')
  cy.get('.juridical-detail__btn-block > .ivu-btn-default > span').should('text', 'Применить')
})

Cypress.Commands.add('CheckJuridical', () => {
  cy.wait(13500)
  // cy.url().should('contain','https://panel-cto.s256.dev/juridical/edit')
  cy.get(':nth-child(1) > :nth-child(1) > .view-header__divider').should(
    'text',
    'Редактирование Юр. лица'
  ) // проверяю заголовок -  редактирование юр лица и далее все заполненные поля
  cy.btnBack()
  cy.get(':nth-child(1) > .ivu-form-item > .ivu-form-item-label').should('text', 'Тех. название:')
  cy.wait(12500)
  cy.get(
    ':nth-child(1) > .ivu-form-item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
  )
    .should('have.attr', 'placeholder', 'используется внутри админ. панели')
    .and('have.value', 'test')
  cy.get(':nth-child(2) > .ivu-form-item > .ivu-form-item-label').should('text', 'Полное название:')
  cy.get(
    ':nth-child(2) > .ivu-form-item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
  )
    .should('have.attr', 'placeholder', 'полное название юр. лица')
    .should('have.value', 'test juridical')
  cy.get('.juridical-detail__btn-block > .ivu-btn-primary > span').should('text', 'Сохранить')
  cy.get('.juridical-detail__btn-block > .ivu-btn-default > span').should('text', 'Применить')
  cy.get('.ivu-divider-inner-text > h3').should('text', 'Провайдеры оплаты')
  cy.get('.juridical-payments > .ivu-row > .ivu-col > .ivu-card > .ivu-card-head > p > span')
    .first()
    .should('text', 'Добавить провайдера')
  cy.get('.ivu-card-body > .ivu-btn > .ivu-icon')
  cy.get('.ivu-card-body > .ivu-btn > span').should('text', ' Добавить')
})

Cypress.Commands.add('CheckJuridicalWithProvider', () => {
  cy.wait(3000)
  cy.url().should('contain', 'https://panel-cto.s256.dev/juridical/edit')
  cy.get(':nth-child(1) > :nth-child(1) > .view-header__divider').should(
    'text',
    'Редактирование Юр. лица'
  ) // проверяю заголовок -  редактирование юр лица и далее все заполненные поля
  cy.btnBack()
  cy.get(':nth-child(1) > .ivu-form-item > .ivu-form-item-label').should('text', 'Тех. название:')
  cy.get(
    ':nth-child(1) > .ivu-form-item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
  )
    .should('have.attr', 'placeholder', 'используется внутри админ. панели')
    .should('have.value', 'test')
  cy.get(':nth-child(2) > .ivu-form-item > .ivu-form-item-label').should('text', 'Полное название:')
  cy.get(
    ':nth-child(2) > .ivu-form-item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
  )
    .should('have.attr', 'placeholder', 'полное название юр. лица')
    .should('have.value', 'test juridical')
  cy.get('.juridical-detail__btn-block > .ivu-btn-primary > span').should('text', 'Сохранить')
  cy.get('.juridical-detail__btn-block > .ivu-btn-default > span').should('text', 'Применить')
  cy.get('.ivu-divider-inner-text > h3').should('text', 'Провайдеры оплаты')
  cy.wait(3000)
  cy.get(':nth-child(1) > .ivu-col > .ivu-card > .ivu-card-head > p > span').should(
    'text',
    'test provider'
  )
  cy.get(':nth-child(2) > .ivu-card > .ivu-card-head > p > span').should(
    'text',
    'Добавить провайдера'
  )
  cy.get(':nth-child(2) > .ivu-card > .ivu-card-body > .ivu-btn > span').should('text', ' Добавить')
  cy.get(':nth-child(1) > .ivu-card > .ivu-card-body > .ivu-btn > span').should(
    'text',
    'Редактировать'
  )
})

Cypress.Commands.add('DeleteJuridical', () => {
  cy.wait(1000)
  cy.get('.ivu-table-tbody > :nth-child(1) > .ivu-table-column-center').click({ force: true })
  cy.get(
    ':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > [style="padding: 0px; color: rgb(237, 64, 20);"] > div'
  )
    .contains('Удаление')
    .click({ force: true })
  cy.get('.ivu-modal-confirm-head-title').should('text', 'Удаление юр. лица')
  cy.get('p').contains('Вы уверены что хотите удалить юр. лицо:')
  cy.get('.ivu-btn-text > span').should('text', 'Отменить').click({ force: true })
  cy.get('.table-pagination__info').contains('Всего 9 записей')
  cy.reload()
  cy.wait(20000)
  // cy.get('.ivu-table-tbody > :nth-child(1) > :nth-child(2) > .ivu-table-cell > span').should('text','test juridical')
  cy.get(
    ':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-dropdown-rel > a > .ivu-icon'
  ).click({ force: true })
  cy.get(
    ':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > [style="padding: 0px; color: rgb(237, 64, 20);"] > div'
  )
    .contains('Удаление')
    .click({ force: true })
  cy.get('.ivu-modal-confirm-head-title').should('text', 'Удаление юр. лица')
  cy.get('p').contains('Вы уверены что хотите удалить юр. лицо:')
  cy.get('.ivu-btn-text > span').should('text', 'Отменить')
  cy.get('.ivu-modal-confirm-footer > .ivu-btn-primary > span')
    .should('text', 'Удалить')
    .click({ force: true })
  cy.get('.ivu-message-custom-content > span').should('text', 'Юр. лицо успешно удалено')
  cy.wait(5000)
  cy.get('.table-pagination__info').contains('Всего 8 записей')
})
Cypress.Commands.add('CreateProviderYandex', () => {
  cy.wait(5000)
  cy.url().should('contain', 'https://panel-cto.s256.dev/juridical/provider-create')
  cy.main()
  cy.get('.ivu-divider-inner-text > span').should('text', 'Создать провайдера оплаты')
  cy.btnBack()
  cy.get('p > .ivu-icon')
  cy.get('p > span').should('text', 'Провайдер оплаты')
  cy.get(':nth-child(1) > .ivu-form-item-label').should('text', 'Название:')
  cy.get('.ivu-input')
    .should('have.attr', 'placeholder', 'Введите название')
    .type('test provider')
    .should('have.value', 'test provider')
  cy.get(':nth-child(2) > .ivu-form-item-label').should('text', 'Тип провайдера:')
  cy.get('.ivu-select-placeholder').should('text', 'выберите провайдера')
  cy.get('.ivu-select-selection > div > .ivu-icon').click()
  cy.get('.ivu-select-dropdown-list > :nth-child(2)').should('text', 'Безналичная оплата')
  cy.get('.ivu-select-dropdown-list > :nth-child(1)').should('text', 'ЮKassa').click()
  cy.get('.ivu-form > .ivu-card > .ivu-card-head > p > .ivu-icon')
  cy.get('.ivu-form > .ivu-card > .ivu-card-head > p > span').should('text', 'ЮKassa')
  cy.get('.ivu-row > :nth-child(1) > .ivu-form-item > .ivu-form-item-label').should(
    'text',
    'ID магазина'
  )
  cy.get(
    '.ivu-row > :nth-child(1) > .ivu-form-item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
  )
    .should('have.attr', 'placeholder', 'введите id магазина в я.кассе')
    .type('12345')
    .should('have.value', '12345')
  cy.get(':nth-child(2) > .ivu-form-item > .ivu-form-item-label').should('text', 'Секретный ключ')
  cy.get(
    ':nth-child(2) > .ivu-form-item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
  )
    .should('have.attr', 'placeholder', 'введите секретный ключ')
    .type('67890')
    .should('have.value', '67890')
  cy.get(':nth-child(3) > .ivu-form-item > .ivu-form-item-label').should('text', 'Способы оплаты')
  cy.get('.ivu-select-placeholder').should('text', 'выберите способы  оплаты')
  cy.get(
    ':nth-child(3) > .ivu-form-item > .ivu-form-item-content > .ivu-select > .ivu-select-selection > div > .ivu-icon'
  ).click()
  cy.contains('Банковская карта').click() // добавляем банковскую карту
  cy.contains('Яндекс.Деньги').click() // и яндекс деньги
  // cy.get('body').click()
  cy.get('.ivu-select-placeholder').should('not.be.visible') // "выберите способ оплаты" скрылся
  cy.get('.ivu-form-item-error-tip').should('not.be.visible') // сообщение об ошибке не видимо
  cy.get('.ivu-select-multiple > .ivu-select-selection > input')
    .should('have.attr', 'type', 'hidden')
    .and('value', 'bank_card,yandex_money') // проверяем, что банковская карта и яндекс деньги
  cy.get('.ivu-select-selection > :nth-child(2) > :nth-child(1) > .ivu-icon').click() // кликаем крестик  и проверяем, что банковкая карта удалилась
  cy.get('.ivu-select-multiple > .ivu-select-selection > input')
    .should('have.attr', 'type', 'hidden')
    .and('value', 'yandex_money')
  cy.get(
    ':nth-child(3) > .ivu-form-item > .ivu-form-item-content > .ivu-select > .ivu-select-selection > div > .ivu-icon'
  ).click()
  cy.get('.ivu-select-dropdown-list').contains('Яндекс.Деньги').click({ force: true }) // удаляем яндекс.деньги через список (а не на крестик)
  cy.get('.ivu-form-item-error-tip').should('text', 'Не может быть пустым') // сообщение об ошибке видимо
  cy.get('.ivu-select-multiple > .ivu-select-selection > input')
    .should('have.attr', 'type', 'hidden')
    .and('value', '') // проверяем, что пусто
  cy.get(
    ':nth-child(3) > .ivu-form-item > .ivu-form-item-content > .ivu-select > .ivu-select-selection > div > .ivu-icon'
  ).click()
  cy.contains('Сбербанк Онлайн (интернет-банк Сбербанка для частных лиц)').click() // выбрали сбербанк
  cy.get('body').click()
})

Cypress.Commands.add('CheckProviderYandex', () => {
  cy.wait(4500)
  cy.get('.ivu-divider-inner-text > span').should('text', 'Редактировать провайдера оплаты')
  cy.btnBack()
  cy.get('p > .ivu-icon')
  cy.get('p > span').first().should('text', 'Провайдер оплаты')
  cy.wait(1000)
  cy.get('.ivu-form > :nth-child(1) > .ivu-form-item-label').should('text', 'Название:')
  // cy.get('.ivu-input').should('have.attr','placeholder','используется внутри админ. панели').should('text','test provider')
  cy.get(':nth-child(2) > .ivu-form-item-label').should('text', 'Тип провайдера:')
  cy.wait(1000)
  cy.get('.ivu-select-selection > div > .ivu-icon') // тип провайдера ЮKassa:
  cy.get('.ivu-select > .ivu-select-selection > input')
    .should('have.attr', 'type', 'hidden')
    .and('value', 'yandex')
  cy.get('.ivu-select-selected-value').should('text', 'ЮKassa')
  cy.get('.ivu-checkbox-wrapper').should('text', '  Активность')
  cy.get('.ivu-form > .ivu-card > .ivu-card-head > p > .ivu-icon')
  cy.get('.ivu-form > .ivu-card > .ivu-card-head > p > span').should('text', 'test provider') // КАК УВИДЕТЬ ТЕКСТ?
  cy.get('.ivu-row > :nth-child(1) > .ivu-form-item > .ivu-form-item-label').should(
    'text',
    'ID магазина'
  )
  cy.get(
    '.ivu-row > :nth-child(1) > .ivu-form-item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
  )
    .should('have.attr', 'placeholder', 'введите id магазина в я.кассе')
    .should('have.value', '12345')
  cy.get(':nth-child(2) > .ivu-form-item > .ivu-form-item-label').should('text', 'Секретный ключ')
  cy.get(
    ':nth-child(2) > .ivu-form-item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
  )
    .should('have.attr', 'placeholder', 'введите секретный ключ')
    .should('have.value', '67890')
  cy.get(':nth-child(3) > .ivu-form-item > .ivu-form-item-label').should('text', 'Способы оплаты')
  cy.get('.ivu-tag-text').should(
    'text',
    'Сбербанк Онлайн (интернет-банк Сбербанка для частных лиц)'
  )
  cy.get('.ivu-btn-primary > span').should('text', 'Сохранить')
  cy.get('.provider-page__btn-block > .ivu-btn-default > span').should('text', 'Применить')
  cy.get('.ivu-btn-error > span').should('text', 'Удалить')
})

Cypress.Commands.add('ClickBack', () => {
  cy.get('.ivu-btn > .ivu-icon')
  cy.get('.view-header__back > .ivu-btn > span').should('text', 'Назад')
  cy.get('.view-header__back > .ivu-btn').focus().should('have.css', 'color', 'rgb(81, 90, 110)')
  cy.get('.view-header__back > .ivu-btn').click()
})

Cypress.Commands.add('btnBack', () => {
  cy.get('.ivu-btn > .ivu-icon')
  cy.get('.view-header__back > .ivu-btn > span').should('text', 'Назад')
  cy.get('.view-header__back > .ivu-btn').focus().should('have.css', 'color', 'rgb(81, 90, 110)')
})
Cypress.Commands.add('CreateEvent', () => {
  cy.get('.ivu-divider-inner-text > span').should('text', 'Создание мероприятия')
  cy.get('.org-form__title').should('text', 'Организационная информация')
  cy.get(':nth-child(1) > .org-form__item > .ivu-form-item-label').should(
    'text',
    'Техническое название'
  )
  cy.get(
    ':nth-child(1) > .org-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
  )
    .should('have.attr', 'placeholder', 'Введите название мероприятия')
    .type('Тестовое мероприятие ТЕСТ')
    .should('have.value', 'Тестовое мероприятие ТЕСТ')
  cy.get(':nth-child(2) > .org-form__item > .ivu-form-item-label').should(
    'text',
    'Домен для лк мероприятия'
  )
  cy.get(
    ':nth-child(2) > .org-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
  )
    .should('have.attr', 'placeholder', 'Укажите адрес личного кабинета')
    .type('http://test.ru')
    .should('have.value', 'http://test.ru')
  cy.get(':nth-child(3) > .org-form__item > .ivu-form-item-label').should(
    'text',
    'Юр.лицо - владелец данных'
  )
  cy.get('.ivu-select-placeholder').click()
  cy.get('.ivu-select-item').contains('test juridical').click()
  cy.get(':nth-child(4) > .org-form__item > .ivu-form-item-label').should(
    'text',
    'E-mail для отбивки о регистрации участника'
  )
  cy.get(
    ':nth-child(4) > .org-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
  ).should('have.attr', 'placeholder', 'Введите e-mail')
  cy.get(':nth-child(5) > .org-form__item > .ivu-form-item-label').should(
    'text',
    'Даты проведения мероприятия'
  )
  cy.get(
    ':nth-child(5) > .org-form__item > .ivu-form-item-content > .ivu-date-picker > .ivu-date-picker-rel > .ivu-input-wrapper > .ivu-input'
  ).should('have.attr', 'placeholder', 'Введите даты проведения')
  cy.get(
    ':nth-child(5) > .org-form__item > .ivu-form-item-content > .ivu-date-picker > .ivu-date-picker-rel > .ivu-input-wrapper > .ivu-input-suffix > .ivu-icon'
  ).click()
  cy.get('.ivu-date-picker-cells-cell-next-month > em').contains('1').click().click()
  // cy.get('.ivu-date-picker-cells-cell > em').contains('30').next().click()
  cy.get(':nth-child(6) > .org-form__item > .ivu-form-item-label').should(
    'text',
    'Даты регистрации'
  )
  cy.get(
    ':nth-child(6) > .org-form__item > .ivu-form-item-content > .ivu-date-picker > .ivu-date-picker-rel > .ivu-input-wrapper > .ivu-input'
  ).should('have.attr', 'placeholder', 'Введите даты регистрации')
  cy.get(
    ':nth-child(6) > .org-form__item > .ivu-form-item-content > .ivu-date-picker > .ivu-date-picker-rel > .ivu-input-wrapper > .ivu-input-suffix > .ivu-icon'
  )
  cy.get(
    ':nth-child(6) > .org-form__item > .ivu-form-item-content > .ivu-date-picker > .ivu-date-picker-rel > .ivu-input-wrapper > .ivu-input'
  ).type('2019-11-11 12:00:00 - 2019-11-12 18:30:30 {enter}')
  cy.get('body').click()
  cy.get('.ivu-color-picker-rel > .ivu-icon-ios-arrow-down').click() // цвет фона
  cy.get('.ivu-color-picker-confirm-color > .ivu-input-wrapper > .ivu-input').click() // цвет фона
  cy.get('.ivu-color-picker-confirm > .ivu-btn-primary').click() // цвет фона
  cy.get(':nth-child(8) > .org-form__item > .ivu-form-item-label').should('not.be.visible')
  cy.get('.ivu-switch').should('not.be.visible')
  cy.get(':nth-child(1) > .org-form-actions__btn > span').should('text', 'Применить')
  cy.get(':nth-child(2) > .org-form-actions__btn > span').should('text', 'Сохранить')
  cy.get(':nth-child(1) > .ivu-card > .ivu-card-body > .additional-info-list-item__title').should(
    'not.be.visible'
  )
  cy.get(':nth-child(2) > .ivu-card > .ivu-card-body > .additional-info-list-item__title').should(
    'not.be.visible'
  )
  cy.get(
    '.additional-info-list-item--right > .ivu-card > .ivu-card-body > .additional-info-list-item__title'
  ).should('not.be.visible')
  cy.get(':nth-child(4) > .ivu-card > .ivu-card-body > .additional-info-list-item__title').should(
    'not.be.visible'
  )
  cy.get(':nth-child(5) > .ivu-card > .ivu-card-body > .additional-info-list-item__title').should(
    'not.be.visible'
  )
})

Cypress.Commands.add('CheckEvent', () => {
  cy.get('.ivu-divider-inner-text > span').should('text', 'Редактирование мероприятия')
  cy.get('.org-form__title').should('text', 'Организационная информация')
  cy.get(':nth-child(1) > .org-form__item > .ivu-form-item-label').should(
    'text',
    'Техническое название'
  )
  cy.get(
    ':nth-child(1) > .org-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
  )
    .should('have.attr', 'placeholder', 'Введите название мероприятия')
    .should('have.value', 'Тестовое мероприятие ТЕСТ')
  cy.get(':nth-child(2) > .org-form__item > .ivu-form-item-label').should(
    'text',
    'Домен для лк мероприятия'
  )
  cy.get(
    ':nth-child(2) > .org-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
  )
    .should('have.attr', 'placeholder', 'Укажите адрес личного кабинета')
    .should('have.value', 'http://test.ru')
  cy.get(':nth-child(3) > .org-form__item > .ivu-form-item-label').should(
    'text',
    'Юр.лицо - владелец данных'
  )
  cy.get('.ivu-select-selected-value').should('text', 'test juridical')
  cy.get(':nth-child(4) > .org-form__item > .ivu-form-item-label').should(
    'text',
    'E-mail для отбивки о регистрации участника'
  )
  cy.get(
    ':nth-child(4) > .org-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
  ).should('have.not.value')
  cy.get(
    ':nth-child(4) > .org-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
  )
    .should('have.attr', 'placeholder', 'Введите e-mail')
    .and('have.not.value')
  cy.get(':nth-child(5) > .org-form__item > .ivu-form-item-label').should(
    'text',
    'Даты проведения мероприятия'
  )
  cy.get(
    ':nth-child(5) > .org-form__item > .ivu-form-item-content > .ivu-date-picker > .ivu-date-picker-rel > .ivu-input-wrapper > .ivu-input'
  ).should('have.attr', 'placeholder', 'Введите даты проведения')
  cy.get(
    ':nth-child(5) > .org-form__item > .ivu-form-item-content > .ivu-date-picker > .ivu-date-picker-rel > .ivu-input-wrapper > .ivu-input'
  ).should('contain.value', '1')
  cy.get(':nth-child(6) > .org-form__item > .ivu-form-item-label').should(
    'text',
    'Даты регистрации'
  )
  cy.get(
    ':nth-child(6) > .org-form__item > .ivu-form-item-content > .ivu-date-picker > .ivu-date-picker-rel > .ivu-input-wrapper > .ivu-input'
  ).should('have.attr', 'placeholder', 'Введите даты регистрации')
  cy.get(
    ':nth-child(6) > .org-form__item > .ivu-form-item-content > .ivu-date-picker > .ivu-date-picker-rel > .ivu-input-wrapper > .ivu-input-suffix > .ivu-icon'
  )
  cy.get(
    ':nth-child(6) > .org-form__item > .ivu-form-item-content > .ivu-date-picker > .ivu-date-picker-rel > .ivu-input-wrapper > .ivu-input'
  ).should('have.value', '2019-11-11 12:00:00 - 2019-11-12 18:30:30')
  cy.get(':nth-child(7) > .org-form__item > .ivu-form-item-label').should('text', 'En only')
  cy.get(':nth-child(7) > .org-form__item > .ivu-form-item-content > .ivu-switch')
  cy.get(':nth-child(8) > .org-form__item > .ivu-form-item-label').should('text', 'Цвет фона')
  cy.get('[style="background-color: rgb(45, 140, 240);"]') // проверка фона
  cy.get('.ivu-col-offset-15 > .org-form__item > .ivu-form-item-label').should(
    'text',
    '  Активность'
  )
  cy.get('.ivu-col-offset-15 > .org-form__item > .ivu-form-item-content > .ivu-switch')
  cy.get(':nth-child(1) > .org-form-actions__btn > span').should('text', 'Применить')
  cy.get(':nth-child(2) > .org-form-actions__btn > span').should('text', 'Сохранить')
  cy.get(':nth-child(1) > .ivu-card > .ivu-card-body > .additional-info-list-item__title').should(
    'text',
    'Контентная информация'
  )
  cy.get(
    ':nth-child(1) > .ivu-card > .ivu-card-body > .additional-info-list-item__btn > .ivu-btn > span'
  ).should('text', 'Редактировать')
  cy.get(':nth-child(2) > .ivu-card > .ivu-card-body > .additional-info-list-item__title').should(
    'text',
    'Юридическая информация'
  )
  cy.get(
    ':nth-child(2) > .ivu-card > .ivu-card-body > .additional-info-list-item__btn > .ivu-btn > span'
  ).should('text', 'Редактировать')
  cy.get(
    '.additional-info-list-item--right > .ivu-card > .ivu-card-body > .additional-info-list-item__title'
  ).should('text', 'Материалы')
  cy.get(
    '.additional-info-list-item--right > .ivu-card > .ivu-card-body > .additional-info-list-item__btn > .ivu-btn > span'
  ).should('text', 'Редактировать')
  cy.get(':nth-child(4) > .ivu-card > .ivu-card-body > .additional-info-list-item__title').should(
    'text',
    'Магазин'
  )
  cy.get(
    ':nth-child(4) > .ivu-card > .ivu-card-body > .additional-info-list-item__btn > .ivu-btn > span'
  ).should('text', 'Редактировать')
  cy.get(':nth-child(5) > .ivu-card > .ivu-card-body > .additional-info-list-item__title').should(
    'text',
    'Пригласительное письмо'
  )
  cy.get('p').should(
    'text',
    'Для создания пригласительного письма необходимо привязать форму регистрации'
  )
  cy.get(
    ':nth-child(5) > .ivu-card > .ivu-card-body > .additional-info-list-item__btn > .ivu-btn'
  ).should('text', '  Редактировать')

  /* Cypress.Commands.add("movePiece",(number, x, y) => {

        cy.get(`:nth-child(1) > .field-selector-body__card-`)
        .trigger('mousedown', { which: 1 })
        .trigger('mousemove', { clientX: x, clientY: y })
        .trigger('mouseup', {force: true})
    }) */
})

Cypress.Commands.add('upload_file', (fileName, fileType = ' ', selector) => {
  cy.get(selector, { timeout: 5000 }).then((subject) => {
    cy.fixture(fileName, 'utf-8')
      .then(Cypress.Blob.utf_8StringToBlob)
      .then((blob) => {
        const el = subject[0]
        const testFile = new File([blob], fileName, { type: fileType }, { timeout: 5000 })
        const dataTransfer = new DataTransfer()
        dataTransfer.items.add(testFile)
        el.files = dataTransfer.files
      })
  })
})
