import { watchFile } from 'fs'
import { exportAllDeclaration } from 'babel-types'
import { equal } from 'assert'

// https://docs.cypress.io/api/introduction/api.html

// <script src="jquery.js"></script>
// <script src="chai.js"></script>
// <script src="chai-jquery.js"></script>

describe('Events', function () {
  before(function () {
    cy.login('admin@s256.ru', 'devmydev')
  })

  it('Create new event', function () {
    cy.visit('https://panel-cto.s256.dev/home')
    cy.wait(2000)
    cy.url().should('eq', 'https://panel-cto.s256.dev/home')
    cy.get('body').contains('Мероприятия').click()
    cy.wait(3000)
    // cy.main()
    cy.get('.event-actions__btn > span > span').should('text', 'Создать мероприятие') // сначала проверяем обязательность полей: Создать мероприятие-Применить(проверили ошибки под полями)
    // - Сохранить(проверили ошибки под полями)-Назад(проверяю, что редирект на грид)
    cy.get('.event-actions__btn').click()
    cy.get(':nth-child(1) > .org-form-actions__btn > span').should('text', 'Применить').click()
    cy.get(
      ':nth-child(1) > .org-form__item > .ivu-form-item-content > .ivu-form-item-error-tip'
    ).should('text', 'Это поле обязательно!')
    cy.get(
      ':nth-child(2) > .org-form__item > .ivu-form-item-content > .ivu-form-item-error-tip'
    ).should('text', 'Это поле обязательно!')
    cy.get(
      ':nth-child(3) > .org-form__item > .ivu-form-item-content > .ivu-form-item-error-tip'
    ).should('text', 'Это поле обязательно!')
    cy.get(
      ':nth-child(5) > .org-form__item > .ivu-form-item-content > .ivu-form-item-error-tip'
    ).should('text', 'Это поле обязательно!')
    cy.get(
      ':nth-child(6) > .org-form__item > .ivu-form-item-content > .ivu-form-item-error-tip'
    ).should('text', 'Это поле обязательно!')

    cy.get(':nth-child(2) > .org-form-actions__btn > span').should('text', 'Сохранить').click()
    cy.get(
      ':nth-child(1) > .org-form__item > .ivu-form-item-content > .ivu-form-item-error-tip'
    ).should('text', 'Это поле обязательно!')
    cy.get(
      ':nth-child(2) > .org-form__item > .ivu-form-item-content > .ivu-form-item-error-tip'
    ).should('text', 'Это поле обязательно!')
    cy.get(
      ':nth-child(3) > .org-form__item > .ivu-form-item-content > .ivu-form-item-error-tip'
    ).should('text', 'Это поле обязательно!')
    cy.get(
      ':nth-child(5) > .org-form__item > .ivu-form-item-content > .ivu-form-item-error-tip'
    ).should('text', 'Это поле обязательно!')
    cy.get(
      ':nth-child(6) > .org-form__item > .ivu-form-item-content > .ivu-form-item-error-tip'
    ).should('text', 'Это поле обязательно!')
    cy.ClickBack()
    cy.url().should('eq', 'https://panel-cto.s256.dev/events/list')

    cy.get('.ivu-table-row').then(($row10) => {
      const n = $row10.length
      const n2 = 0

      cy.get('.ivu-page-item').then(($row1) => {
        const page = $row1.length
        if (page == 2) {
          // если мероприятий 2 страницы, то этот блок будет работать, если 1 - то будет else (в этих блоках все одно и тоже кроме количество страниц)
          cy.get($row1)
            .next()
            .should('have.attr', 'title', '2')
            .then(($row3) => {
              cy.get($row1).next().should('have.attr', 'title', '2').click({ multiple: true })
              cy.wait(2000)
              cy.get('.ivu-table-row').then(($row2) => {
                const n2 = $row2.length
                cy.get('.table-pagination__info').contains(
                  'Всего ' + parseFloat(n + n2) + ' записей'
                ) // сколько мероприятий изначально
                const n4 = $row10.length
                // let n5 = $row2.length;
                if (n4 == n) {
                  cy.get('.event-actions__btn > :nth-child(1) > span')
                    .should('text', 'Создать мероприятие')
                    .click() // снова Создать меороприятие-заполняю поля-Назад(проверка, что не создалось мероприятие)
                }
                // cy.main()
                cy.CreateEvent()
                cy.ClickBack()
                cy.url().should('eq', 'https://panel-cto.s256.dev/events/list')
                const n6 = $row10.length
                // let n7 = $row2.length;
                if (n6 == n) {
                  cy.get('.event-actions__btn > :nth-child(1) > span')
                    .should('text', 'Создать мероприятие')
                    .click() // снова Создать мероприятие-заполняю поля-Сохранить(проверка, что создалось мероприятие)
                }
                cy.CreateEvent()
                cy.get(':nth-child(2) > .org-form-actions__btn > span')
                  .should('text', 'Сохранить')
                  .click()
                cy.get('.ivu-message-custom-content > span').should(
                  'text',
                  'Мероприятие успешно создано'
                )
                cy.url().should('eq', 'https://panel-cto.s256.dev/events/list')
                cy.wait(3000)
                const n8 = $row10.length
                // alert(n8)
                // let n9 = $row2.length;
                cy.get('.table-pagination__info')
                  .contains('Всего ' + parseFloat(n + n2 + 1) + ' записей')
                  .then(($row8) => {
                    cy.get(
                      '.ivu-table-tbody > :nth-child(1) > :nth-child(1) > .ivu-table-cell > span'
                    )
                    cy.get(
                      '.ivu-table-tbody > :nth-child(1) > :nth-child(2) > .ivu-table-cell > span'
                    ).should('text', 'Тестовое мероприятие ТЕСТ')
                    cy.get(
                      ':nth-child(1) > :nth-child(4) > .ivu-table-cell > .ivu-badge-status > .ivu-badge-status-text'
                    ).should('text', 'Активен')
                    cy.get(
                      ':nth-child(1) > :nth-child(5) > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-dropdown-rel > a > .ivu-icon'
                    ).click()
                    // cy.get('.ivu-table-row-hover > :nth-child(5) > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > :nth-child(1) > div')
                    cy.get('body').contains('Редактировать').click({ force: true }) // откываем на редактирование и проверяем созжанное мероприятие
                    // сy.get(':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > [style="padding: 0px;"] > div')
                    //  .contains('Редактировать').click({force: true}) // откываем на редактирование и проверяем созжанное мероприятие
                    cy.CheckEvent()
                    cy.ClickBack()
                  })
                // создаю еще раз мероприятие только с помощью кнопки Применить
                cy.get('.event-actions__btn > :nth-child(1) > span')
                  .should('text', 'Создать мероприятие')
                  .click()
                cy.CreateEvent()
                cy.get(':nth-child(1) > .org-form-actions__btn > span')
                  .should('text', 'Применить')
                  .click()
                cy.get('.ivu-message-custom-content > span').should(
                  'text',
                  'Мероприятие успешно создано'
                )
                cy.url().should('contains', 'https://panel-cto.s256.dev/events/edit')
                cy.CheckEvent()
                cy.get('body').contains('Мероприятия').click()
                cy.get('.table-pagination__info')
                  .contains('Всего ' + parseFloat(n + n2 + 2) + ' записей')
                  .then(() => {
                    cy.get(
                      '.ivu-table-tbody > :nth-child(1) > :nth-child(1) > .ivu-table-cell > span'
                    )
                    cy.get(
                      '.ivu-table-tbody > :nth-child(1) > :nth-child(2) > .ivu-table-cell > span'
                    ).should('text', 'Тестовое мероприятие ТЕСТ')
                    cy.get(
                      ':nth-child(1) > :nth-child(4) > .ivu-table-cell > .ivu-badge-status > .ivu-badge-status-text'
                    ).should('text', 'Активен')
                    cy.get(
                      ':nth-child(1) > :nth-child(5) > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-dropdown-rel > a > .ivu-icon'
                    ).click()
                    // cy.get('.ivu-table-row-hover > :nth-child(5) > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > :nth-child(1) > div')
                    cy.get('body').contains('Редактировать').click({ force: true })
                    // сy.get(':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > [style="padding: 0px;"] > div')
                    //  .contains('Редактировать').click({force: true}) // откываем на редактирование и проверяем созжанное мероприятие
                    cy.CheckEvent()
                  })
              })
            })
        } else {
          cy.get('.table-pagination__info').contains('Всего ' + n + ' записей') // сколько мероприятий изначально
          const n4 = $row10.length
          // let n5 = $row2.length;
          if (n4 == n) {
            cy.get('.event-actions__btn > :nth-child(1) > span')
              .should('text', 'Создать мероприятие')
              .click() // снова Создать меороприятие-заполняю поля-Назад(проверка, что не создалось мероприятие)
          }
          // cy.main()
          cy.CreateEvent()
          cy.ClickBack()
          cy.url().should('eq', 'https://panel-cto.s256.dev/events/list')
          const n6 = $row10.length
          // let n7 = $row2.length;
          if (n6 == n) {
            cy.get('.event-actions__btn > :nth-child(1) > span')
              .should('text', 'Создать мероприятие')
              .click() // снова Создать мероприятие-заполняю поля-Сохранить(проверка, что создалось мероприятие)
          }
          cy.CreateEvent()
          cy.get(':nth-child(2) > .org-form-actions__btn > span')
            .should('text', 'Сохранить')
            .click()
          cy.get('.ivu-message-custom-content > span').should('text', 'Мероприятие успешно создано')
          cy.url().should('eq', 'https://panel-cto.s256.dev/events/list')
          cy.wait(3000)
          cy.get('.table-pagination__info')
            .contains('Всего ' + parseFloat(n + n2 + 1) + ' записей')
            .then(($row8) => {
              cy.get('.ivu-table-tbody > :nth-child(1) > :nth-child(1) > .ivu-table-cell > span')
              cy.get(
                '.ivu-table-tbody > :nth-child(1) > :nth-child(2) > .ivu-table-cell > span'
              ).should('text', 'Тестовое мероприятие ТЕСТ')
              cy.get(
                ':nth-child(1) > :nth-child(4) > .ivu-table-cell > .ivu-badge-status > .ivu-badge-status-text'
              ).should('text', 'Активен')
              cy.get(
                ':nth-child(1) > :nth-child(5) > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-dropdown-rel > a > .ivu-icon'
              ).click()
              // cy.get('.ivu-table-row-hover > :nth-child(5) > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > :nth-child(1) > div')
              cy.get('body').contains('Редактировать').click({ force: true })
              // сy.get(':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > [style="padding: 0px;"] > div')
              //  .contains('Редактировать').click({force: true}) // откываем на редактирование и проверяем созжанное мероприятие
              cy.CheckEvent()
            })

          // создаю еще раз мероприятие только с помощью кнопки Применить
          cy.get('.event-actions__btn > :nth-child(1) > span')
            .should('text', 'Создать мероприятие')
            .click()
          cy.CreateEvent()
          cy.get(':nth-child(1) > .org-form-actions__btn > span')
            .should('text', 'Применить')
            .click()
          cy.get('.ivu-message-custom-content > span').should('text', 'Мероприятие успешно создано')
          cy.url().should('contains', 'https://panel-cto.s256.dev/events/edit')
          cy.CheckEvent()
          cy.get('body').contains('Мероприятия').click()
          cy.get('.table-pagination__info')
            .contains('Всего ' + parseFloat(n + n2 + 2) + ' записей')
            .then(() => {
              cy.get('.ivu-table-tbody > :nth-child(1) > :nth-child(1) > .ivu-table-cell > span')
              cy.get(
                '.ivu-table-tbody > :nth-child(1) > :nth-child(2) > .ivu-table-cell > span'
              ).should('text', 'Тестовое мероприятие ТЕСТ')
              cy.get(
                ':nth-child(1) > :nth-child(4) > .ivu-table-cell > .ivu-badge-status > .ivu-badge-status-text'
              ).should('text', 'Активен')
              cy.get(
                ':nth-child(1) > :nth-child(5) > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-dropdown-rel > a > .ivu-icon'
              ).click()
              // cy.get('.ivu-table-row-hover > :nth-child(5) > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > :nth-child(1) > div')
              cy.get('body').contains('Редактировать').click({ force: true })
              // сy.get(':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > [style="padding: 0px;"] > div')
              //  .contains('Редактировать').click({force: true}) // откываем на редактирование и проверяем созжанное мероприятие
              cy.CheckEvent()
            })
        }
      })
    })

    /* cy.route('/api/items', 'fixture:items').as('getItems')
    // ... action
    cy.wait('@getUsers') */
  })

  it('Content information', function () {
    cy.visit('https://panel-cto.s256.dev/home')
    cy.wait(2000)
    cy.url().should('eq', 'https://panel-cto.s256.dev/home')
    cy.get('body').contains('Мероприятия').click()
    cy.get(
      ':nth-child(1) > :nth-child(5) > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-dropdown-rel > a > .ivu-icon'
    ).click()
    // cy.get(':nth-child(3) > :nth-child(5) > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-dropdown-rel > a > .ivu-icon').click()
    cy.wait(3000)
    // cy.get(':nth-child(3) > :nth-child(5) > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > :nth-child(1) > div').click({force: true})
    cy.contains('Редактировать').click({ force: true })
    cy.wait(3000)
    cy.url().should('contains', 'https://panel-cto.s256.dev/events/edit')
    cy.get(':nth-child(1) > .ivu-card > .ivu-card-body > .additional-info-list-item__title').should(
      'text',
      'Контентная информация'
    )
    cy.get(
      ':nth-child(1) > .ivu-card > .ivu-card-body > .additional-info-list-item__btn > .ivu-btn > span'
    )
      .should('text', 'Редактировать')
      .click()
    cy.url().should('contains', '/content-info')
    cy.main()
    cy.get('.ivu-divider-inner-text > span').should('text', 'Редактирование мероприятия')
    cy.get('.ivu-tabs-tab-active').should('text', ' RU ')
    cy.get('.ivu-tabs-nav > :nth-child(3)').should('text', ' EN ')
    cy.get('.content-info-form__title').should('text', 'Контентная информация')
    cy.get(':nth-child(1) > .content-info-form-actions__btn > span').click() // проверяю обязательность полей сначала после Применить, потом после Сохранить
    cy.get('.content-info-form__item > .ivu-form-item-content > .ivu-form-item-error-tip').should(
      'text',
      'Это поле обязательно!'
    )
    cy.get(':nth-child(2) > .ivu-form-item-content > .ivu-form-item-error-tip').should(
      'text',
      'Это поле обязательно!'
    )
    cy.get(':nth-child(2) > .content-info-form-actions__btn').click()
    cy.get('.content-info-form__item > .ivu-form-item-content > .ivu-form-item-error-tip').should(
      'text',
      'Это поле обязательно!'
    )
    cy.get(':nth-child(2) > .ivu-form-item-content > .ivu-form-item-error-tip').should(
      'text',
      'Это поле обязательно!'
    )
    // верх раскомментировать, так как мы открываем уже заполненное мер-рие, сл-но там нет обязательности
    cy.get('.ivu-col-span-lg-16 > .content-info-form__item > .ivu-form-item-label').should(
      'text',
      'Название мероприятия'
    )
    cy.get(
      '.ivu-col-span-lg-16 > .content-info-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
    )
      .should('have.attr', 'placeholder', 'Введите название мероприятия')
      .type('Тестовое для ЛК')
    cy.get(':nth-child(2) > .content-info-form__item > .ivu-form-item-label').should(
      'text',
      'Место проведения'
    )
    cy.get(
      ':nth-child(2) > .content-info-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
    )
      .should('have.attr', 'placeholder', 'Введите место проведения')
      .type('г Кострома ГРОЗА для ЛК')
    cy.get(':nth-child(3) > .content-info-form__item > .ivu-form-item-label').should(
      'text',
      'Телефон'
    )
    cy.get(
      ':nth-child(3) > .content-info-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
    )
      .should('have.attr', 'placeholder', 'Введите телефон')
      .type('+7(4942)55-55-55')
    cy.get(':nth-child(4) > .content-info-form__item > .ivu-form-item-label').should(
      'text',
      'Email'
    )
    cy.get(
      ':nth-child(4) > .content-info-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
    )
      .should('have.attr', 'placeholder', 'Введите email')
      .type('test@mail.ru')
    cy.get(':nth-child(5) > .content-info-form__item > .ivu-form-item-label').should(
      'text',
      'Ссылка на логотипе'
    )
    cy.get(
      ':nth-child(5) > .content-info-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
    )
      .should('have.attr', 'placeholder', 'Ссылка на логотипе')
      .type('https://yandex.ru')
    cy.get(':nth-child(6) > .content-info-form__item > .ivu-form-item-label').should(
      'text',
      'Логотип мероприятия'
    )
    cy.get(':nth-child(1) > :nth-child(1) > .ivu-upload > div').click()
    cy.wait(1000)
    // cy.focused()
    // cy.contains('Документы').click()
    cy.get(':nth-child(7) > .content-info-form__item > .ivu-form-item-label').should(
      'text',
      'Текс под телефоном'
    )
    cy.get(
      ':nth-child(7) > .content-info-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
    )
      .should('have.attr', 'placeholder', 'Введите текс под телефоном')
      .type('текст под телефоном для ЛК')
    cy.get('.ivu-form-item-error > .ivu-form-item-label').should('text', 'Форма регистрации')
    cy.get('.ivu-select-placeholder').should('text', 'Выберите форму регистрации')
    cy.get('.ivu-select-selection > div > .ivu-icon').click()
    cy.get('.ivu-select-dropdown-list > :nth-child(4)').contains('тест').click()
    cy.get('.ivu-col-span-lg-6 > .ivu-btn > span').should('text', 'Кастомизировать').click()
    cy.get('.ivu-message-custom-content > span').should('text', 'Информация успешно обновлена!')
    cy.get('.ivu-col-span-10 > .ivu-card > .ivu-card-body > h3').should(
      'text',
      'Панель конструктора'
    )
    cy.get('.ivu-col-span-14 > .ivu-card > .ivu-card-body > h3').should('text', 'Конструктор')
    cy.get(':nth-child(2) > .form-constructor-action__title').should(
      'text',
      'Добавление визуального контейнера'
    )
    cy.get('.form-constructor-action__item > .ivu-input-wrapper > .ivu-input')
      .should('have.attr', 'placeholder', 'Введите название контейнера')
      .type('тест контейнер1')
    cy.get('.form-constructor-action__btn > .ivu-btn > span').should('text', 'Добавить').click()
    cy.get(
      ':nth-child(2) > .main-constructor__wrap > .main-constructor-group > .ivu-divider > .ivu-divider-inner-text > span'
    ).should('text', 'тест контейнер1')
    // перемещаюсь на создание формы!!!! надо будет вернуться
  })

  it('Visual check and filters of events', function () {
    cy.visit('events/list')
    cy.get('body').contains('Мероприятия').click()
    cy.url().should('eq', 'https://panel-cto.s256.dev/events/list')
    cy.main()
    cy.get('.ivu-menu-light > :nth-child(1) > span').click() // кликаю на Мероприятия
    cy.main()
    cy.get('.ivu-divider-inner-text').should('text', 'Мероприятия')
    cy.get('.event-actions__btn > :nth-child(1) > span').should('text', 'Создать мероприятие')
    cy.get('.ivu-radio-wrapper-checked > .ivu-radio > .ivu-radio-input')
    cy.get('.ivu-radio-wrapper-checked > :nth-child(2)').should('text', 'Текущие')
    cy.get(':nth-child(2) > .ivu-radio > .ivu-radio-input')
    cy.get('.search-input > :nth-child(2) > :nth-child(2)').should('text', 'Архив')
    cy.get(':nth-child(3) > .ivu-radio > .ivu-radio-input')
    cy.get('.search-input > :nth-child(3) > :nth-child(2)').should('text', 'Все')
    cy.get(':nth-child(1) > .ivu-table-cell > .ivu-table-cell-sort').should('text', 'ID')
    cy.get(':nth-child(2) > .ivu-table-cell > .ivu-table-cell-sort').should('text', 'Тех. название')
    cy.get(':nth-child(4) > .ivu-table-cell > .ivu-table-cell-sort').should('text', 'Активность')
    cy.get(':nth-child(5) > .ivu-table-cell > span').should('text', '#')

    cy.get(':nth-child(2) > .table-filter__item > .search-input > .ivu-input').should(
      'have.attr',
      'placeholder',
      'ID'
    ) // проверка фильтра

    // сохраняю количество мероприятий - ввожу id=1 - стираю - сраниваю, что количество мероприятий возвращается
    cy.get('.ivu-table-row').then(($row1) => {
      const n1 = $row1.length
      cy.get('.ivu-page-item').then(($row4) => {
        const page = $row4.length
        if (page == 2) {
          cy.get($row4)
            .next()
            .should('have.attr', 'title', '2')
            .then(($row6) => {
              cy.get($row4).next().should('have.attr', 'title', '2').click({ multiple: true })
              cy.wait(2000)
              cy.get('.ivu-table-row').then(($row7) => {
                const n2 = $row7.length
                cy.get('.table-pagination__info').contains(
                  'Всего ' + parseFloat(n1 + n2) + ' записей'
                )
                cy.get(':nth-child(2) > .table-filter__item > .search-input > .ivu-input').type(
                  '1{enter}'
                )
                cy.get('.ivu-table-row').then(($row2) => {
                  const n3 = $row2.length
                  cy.get($row2).should('have.length', 1)
                  // cy.get('.ivu-table-row > :nth-child(2) > .ivu-table-cell > span').should('text','Тестовое мероприятие 2. Расположенное на reg.100metrovka.com')
                  cy.get(':nth-child(2) > .table-filter__item > .search-input > .ivu-input')
                    .clear()
                    .click()
                })
                cy.get('.table-pagination__info').contains(
                  'Всего ' + parseFloat(n1 + n2) + ' записей'
                )
              })
            })
        } else {
          cy.get(':nth-child(2) > .table-filter__item > .search-input > .ivu-input').type(
            '1{enter}'
          )
          cy.get('.ivu-table-row').then(($row2) => {
            const n2 = $row2.length
            cy.get($row2).should('have.length', 1)
            // cy.get('.ivu-table-row > :nth-child(2) > .ivu-table-cell > span').should('text','Тестовое мероприятие 2. Расположенное на reg.100metrovka.com')
            cy.get(':nth-child(2) > .table-filter__item > .search-input > .ivu-input')
              .clear()
              .click()
            cy.get('.ivu-table-row').then(($row3) => {
              const n3 = $row3.length
              if ($row1.length == $row3.length) {
                cy.get('.table-pagination__info').contains('Всего ' + n3 + ' записей')
              } else {
                alert('2')
              }
            })
          })
        }
      })
    })
    cy.reload()
    cy.get(':nth-child(3) > .table-filter__item > .search-input > .ivu-input').should(
      'have.attr',
      'placeholder',
      'Техническое название'
    ) // проверка фильтра
    // сохраняю количество мероприятий - ввожу id=1 - стираю - сраниваю, что количество мероприятий возвращается
    cy.get('.ivu-table-row').then(($row1) => {
      const n1 = $row1.length
      cy.get('.ivu-page-item').then(($row4) => {
        const page = $row4.length
        if (page == 2) {
          cy.get($row4)
            .next()
            .should('have.attr', 'title', '2')
            .then(() => {
              cy.get($row4).next().should('have.attr', 'title', '2').click({ multiple: true })
              cy.wait(2000)
              cy.get('.ivu-table-row').then(($row7) => {
                const n2 = $row7.length
                cy.get('.table-pagination__info').contains(
                  'Всего ' + parseFloat(n1 + n2) + ' записей'
                )
                cy.get(':nth-child(3) > .table-filter__item > .search-input > .ivu-input')
                  .type('тест1{enter}')
                  .then(() => {
                    cy.get('.ivu-table-row').then(($row8) => {
                      cy.get($row8).should('have.length', 1)
                      // cy.get('.ivu-table-row > :nth-child(2) > .ivu-table-cell > span').should('text','Тестовое мероприятие 2. Расположенное на reg.100metrovka.com')
                      cy.get(':nth-child(3) > .table-filter__item > .search-input > .ivu-input')
                        .clear()
                        .click()
                    })
                    cy.get('.table-pagination__info').contains(
                      'Всего ' + parseFloat(n1 + n2) + ' записей'
                    )
                  })
              })
            })
        } else {
          cy.get(':nth-child(3) > .table-filter__item > .search-input > .ivu-input')
            .type('тестовое мероприятие{enter}')
            .then(() => {
              cy.get('.ivu-table-row').then(($row2) => {
                cy.get($row2).should('have.length', 1)
                // cy.get('.ivu-table-tbody > :nth-child(1) > :nth-child(2) > .ivu-table-cell > span').should('text','Тестовое мероприятие 1. Расположенное на reg.nik-borodin.com ')
                // cy.get(':nth-child(2) > :nth-child(2) > .ivu-table-cell > span').should('text','Тестовое мероприятие 2. Расположенное на reg.100metrovka.com')
                cy.get(':nth-child(3) > .table-filter__item > .search-input > .ivu-input')
                  .clear()
                  .click()
                cy.get('.ivu-table-row').then(($row3) => {
                  cy.get($row3).should('have.length', $row1.length)
                  cy.get('.table-pagination__info').contains('Всего ' + n1 + ' записей')
                })
              })
            })
        }
      })
    })
  })

  /* it('Count of events', function () {
    cy.get('.ivu-table-row').then(($row) => {
      const n = $row.length;
      cy.get('.table-pagination__info').contains('Всего '+n+' записей')
      cy.get('.ivu-table-row').should('have.length',n)                       //аналогично верхней команде
      cy.get('.table-pagination__info').invoke('text').should('contain',n)   //аналогично верхней команде
    })  */
  /* cy.get('.table-pagination__info').invoke('text').should((text) => {
     /* countRows  = text.replace(/[^0-9]+/g, '')
    });
    cy.get('.ivu-table-row').should('have.length',countRows)
  }) */
})
