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
