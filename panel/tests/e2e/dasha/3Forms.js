import { exportAllDeclaration, isTSAnyKeyword } from 'babel-types'
import { equal } from 'assert'

describe('Juridical list', function () {
  before(function () {
    cy.login('admin@s256.ru', 'devmydev')
  })

  it('Form visual check', function () {
    cy.viewport(1800, 600)
    cy.visit('https://panel-cto.s256.dev/home')
    cy.wait(2000)
    cy.url().should('eq', 'https://panel-cto.s256.dev/home')
    cy.get(':nth-child(5) > .ivu-menu-submenu-title > span').should('text', 'Формы')
    cy.get('.ivu-menu-submenu-title > .ivu-icon-ios-git-branch').click()
    cy.get('.ivu-menu-submenu > .ivu-menu > :nth-child(1) > .ivu-icon')
    cy.get('.ivu-menu-opened > .ivu-menu > :nth-child(1) > span').should(
      'text',
      'Формы сбора данных'
    )
    cy.get('.ivu-menu-submenu > .ivu-menu > :nth-child(2) > .ivu-icon')
    cy.get('.ivu-menu-opened > .ivu-menu > :nth-child(2) > span').should('text', 'Поля для форм')
    cy.get('.ivu-menu-submenu > .ivu-menu > :nth-child(3) > .ivu-icon')
    cy.get('.ivu-menu-opened > .ivu-menu > :nth-child(3) > span').should('text', 'Таблица тегов')
  })
  // создаем теги (всех типов - 9 штук), добавляем поля с этими тегами (9 шт), затем добавляем эти поля в форму, затем кастомизируем эту форму в мероприятии

  // нет пока проверки на кол-во использований(и кол-во данных) тега
  it('Tag check', function () {
    cy.get('.ivu-menu-submenu > .ivu-menu > :nth-child(3) > span')
      .should('text', 'Таблица тегов')
      .click()
    cy.url().should('eq', 'https://panel-cto.s256.dev/tags/list')
    cy.get('.ivu-divider-inner-text').should('text', 'Таблица тегов')
    cy.get(':nth-child(1) > .table-filter__item > .search-input > .ivu-input').should(
      'have.attr',
      'placeholder',
      'ID'
    )
    cy.get(':nth-child(2) > .table-filter__item > .search-input > .ivu-input').should(
      'have.attr',
      'placeholder',
      'Название тега'
    )
    cy.get(':nth-child(3) > .table-filter__item > .search-input > .ivu-input').should(
      'have.attr',
      'placeholder',
      'Tag'
    )
    cy.get(':nth-child(1) > .ivu-table-cell > .ivu-table-cell-sort').should('text', 'ID')
    cy.get(':nth-child(1) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropup')
    cy.get(':nth-child(1) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropdown')
    cy.get('thead > tr > :nth-child(2) > .ivu-table-cell > span').should('text', 'Название тега')
    cy.get('thead > tr > :nth-child(3) > .ivu-table-cell > span').should('text', 'Tag')
    cy.get(':nth-child(4) > .ivu-table-cell > .ivu-table-cell-sort').should('text', 'Кол-во данных')
    cy.get(':nth-child(4) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropup')
    cy.get(':nth-child(4) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropdown')
    cy.get(':nth-child(5) > .ivu-table-cell > .ivu-table-cell-sort').should(
      'text',
      'Кол-во использований'
    )
    cy.get(':nth-child(5) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropup')
    cy.get(':nth-child(5) > .ivu-table-cell > .ivu-table-sort > .ivu-icon-md-arrow-dropdown')
    cy.get('.ivu-table-column-center > .ivu-table-cell > span')
    // добавляем тег и проверяем, что счетчик увеличился на один
    cy.get('.ivu-table-row').then(($row) => {
      // const n = $row.length;
      const n = 83 // закомментировать потом
      const m = 11
      cy.get('.table-pagination__info').should('text', 'Всего ' + n + ' записей')
      cy.get('.event-actions__btn > :nth-child(1) > span')
        .should('text', 'Создать новый тег')
        .click()
      cy.url().should('eq', 'https://panel-cto.s256.dev/tags/create')
      cy.get('.ivu-divider-inner-text > span').should('text', 'Создание тега')
      cy.get(':nth-child(1) > .tag-create-form__item > .ivu-form-item-label').should(
        'text',
        'Название тега'
      )
      cy.get(':nth-child(2) > .tag-create-form__item > .ivu-form-item-label').should('text', 'Tag')
      cy.get(
        ':nth-child(1) > .tag-create-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).should('have.attr', 'placeholder', 'Введите название тега')
      cy.get(
        ':nth-child(2) > .tag-create-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).should('have.attr', 'placeholder', 'Введите Tag')
      // проверка обязательности полей
      cy.get(':nth-child(1) > .tag-create-form-actions__btn > span')
        .should('text', 'Применить')
        .click()
      cy.get(
        ':nth-child(1) > .tag-create-form__item > .ivu-form-item-content > .ivu-form-item-error-tip'
      ).should('text', 'Это поле обязательно!')
      cy.get(
        ':nth-child(2) > .tag-create-form__item > .ivu-form-item-content > .ivu-form-item-error-tip'
      ).should('text', 'Это поле обязательно!')
      cy.get(':nth-child(2) > .tag-create-form-actions__btn > span')
        .should('text', 'Сохранить')
        .click()
      cy.get(
        ':nth-child(1) > .tag-create-form__item > .ivu-form-item-content > .ivu-form-item-error-tip'
      ).should('text', 'Это поле обязательно!')
      cy.get(
        ':nth-child(2) > .tag-create-form__item > .ivu-form-item-content > .ivu-form-item-error-tip'
      ).should('text', 'Это поле обязательно!')
      cy.ClickBack() // проверка Назад - что ничего не создается
      cy.url().should('eq', 'https://panel-cto.s256.dev/tags/list')
      cy.get('.table-pagination__info').should('text', 'Всего ' + n + ' записей')
      cy.get('.event-actions__btn > :nth-child(1) > span')
        .should('text', 'Создать новый тег')
        .click()
      cy.url().should('eq', 'https://panel-cto.s256.dev/tags/create')
      cy.get(
        ':nth-child(1) > .tag-create-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).type('тег тест строка')
      cy.get(
        ':nth-child(2) > .tag-create-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).type('tag test string')
      cy.ClickBack() // снова проверка Назад - что ничего не создается
      cy.url().should('eq', 'https://panel-cto.s256.dev/tags/list')
      cy.get('.table-pagination__info').should('text', 'Всего ' + n + ' записей')
      cy.get('.event-actions__btn > :nth-child(1) > span')
        .should('text', 'Создать новый тег')
        .click()
      cy.url().should('eq', 'https://panel-cto.s256.dev/tags/create')
      cy.get(
        ':nth-child(1) > .tag-create-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).type('тег тест строка1 ') // +m)
      cy.get(
        ':nth-child(2) > .tag-create-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).type('tag test string1 ') // +m)
      cy.get(':nth-child(1) > .tag-create-form-actions__btn').click() // нажимаем Применить
      cy.get('.ivu-message-custom-content > span').should('text', 'Тег успешно создан')
      cy.wait(2000)
      cy.url().should('include', 'https://panel-cto.s256.dev/tags/edit')
      cy.wait(2000)
      cy.get(':nth-child(1) > .tag-edit-form-actions__btn > span') // нажимаем Применить еще раз, чтобы проверить попап - не создан, а уже обновлен
      // cy.get('.ivu-message-custom-content > span').should('text','Тег успешно обновлен!')
      cy.url().should('include', 'https://panel-cto.s256.dev/tags/edit')
      cy.wait(1000)
      cy.get(':nth-child(2) > .tag-edit-form-actions__btn').click()
      cy.get('.ivu-message-custom-content > span').should('text', 'Тег успешно обновлен!')
      cy.wait(2000)
      cy.url().should('eq', 'https://panel-cto.s256.dev/tags/list')
      cy.get('.table-pagination__info').should('text', 'Всего ' + (n + 1) + ' записей') // здесь проверяем счетчик после нажатия Сохранить (после Применить)
      // проверяем созданный тег
      cy.wait(2000)
      cy.get(':nth-child(2) > .table-filter__item > .search-input > .ivu-input').type(
        'тег тест строка {enter}'
      )
      cy.get(
        ':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-dropdown-rel > a > .ivu-icon'
      ).click()
      cy.get(
        ':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > .ivu-dropdown-item > div'
      )
        .should('contain', 'Редактировать')
        .click({ force: true })
      cy.url().should('include', 'https://panel-cto.s256.dev/tags/edit')
      cy.get(
        ':nth-child(1) > .tag-edit-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'тег тест строка ')
      cy.get(
        ':nth-child(2) > .tag-edit-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'tag test string ')
      cy.ClickBack()

      cy.get('.event-actions__btn > :nth-child(1) > span')
        .should('text', 'Создать новый тег')
        .click()
      cy.url().should('eq', 'https://panel-cto.s256.dev/tags/create')
      cy.get(
        ':nth-child(1) > .tag-create-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).type('тег тест текст1 ') // +m)
      cy.get(
        ':nth-child(2) > .tag-create-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).type('tag test text1 ') // +m)
      cy.wait(2000)
      cy.get(':nth-child(2) > .tag-create-form-actions__btn').click()
      cy.get('.ivu-message-custom-content > span').should('text', 'Тег успешно создан')
      cy.wait(2000)
      cy.url().should('eq', 'https://panel-cto.s256.dev/tags/list')
      cy.get('.table-pagination__info').should('text', 'Всего ' + (n + 2) + ' записей') // здесь проверяем счетчик после нажатия Сохранить
      // проверяем созданный тег
      cy.get(':nth-child(3) > .table-filter__item > .search-input > .ivu-input')
        .should('have.attr', 'placeholder', 'Tag')
        .type('tag test text {enter}')
      cy.get(
        ':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-dropdown-rel > a > .ivu-icon'
      ).click()
      cy.get(
        ':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > .ivu-dropdown-item > div'
      )
        .should('contain', 'Редактировать')
        .click({ force: true })
      cy.url().should('include', 'https://panel-cto.s256.dev/tags/edit')
      cy.get(
        ':nth-child(1) > .tag-edit-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'тег тест текст ')
      cy.get(
        ':nth-child(2) > .tag-edit-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'tag test text ')
      cy.ClickBack()

      cy.get('.event-actions__btn > :nth-child(1) > span')
        .should('text', 'Создать новый тег')
        .click()
      cy.url().should('eq', 'https://panel-cto.s256.dev/tags/create')
      cy.get(
        ':nth-child(1) > .tag-create-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).type('тег тест список1 ' + m)
      cy.get(
        ':nth-child(2) > .tag-create-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).type('tag test list1 ' + m)
      cy.get(':nth-child(1) > .tag-create-form-actions__btn').click()
      cy.get('.ivu-message-custom-content > span').should('text', 'Тег успешно создан')
      cy.wait(2000)
      cy.url().should('include', 'https://panel-cto.s256.dev/tags/edit')
      cy.get('.ivu-menu-submenu > .ivu-menu > :nth-child(3) > span')
        .should('text', 'Таблица тегов')
        .click()
      cy.wait(2000)
      cy.url().should('eq', 'https://panel-cto.s256.dev/tags/list')
      cy.get('.table-pagination__info').should('text', 'Всего ' + (n + 3) + ' записей') // здесь проверяем счетчик после нажатия Применить, и далее через листинг - просмотр
      // проверяем созданный тег
      cy.get(':nth-child(2) > .table-filter__item > .search-input > .ivu-input')
        .should('have.attr', 'placeholder', 'Название тега')
        .type('тег тест список1 {enter}')
      cy.get(
        ':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-dropdown-rel > a > .ivu-icon'
      ).click()
      cy.get(
        ':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > .ivu-dropdown-item > div'
      )
        .should('contain', 'Редактировать')
        .click({ force: true })
      cy.url().should('include', 'https://panel-cto.s256.dev/tags/edit')
      cy.get(
        ':nth-child(1) > .tag-edit-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'тег тест список1 ')
      cy.get(
        ':nth-child(2) > .tag-edit-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'tag test list1 ')
      cy.ClickBack()

      cy.get('.event-actions__btn > :nth-child(1) > span')
        .should('text', 'Создать новый тег')
        .click()
      cy.url().should('eq', 'https://panel-cto.s256.dev/tags/create')
      cy.get(
        ':nth-child(1) > .tag-create-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).type('тег тест список с мультивыбором1 ') // +m)
      cy.get(
        ':nth-child(2) > .tag-create-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).type('tag test list with multi-selection1 ') // +m)
      cy.get(':nth-child(1) > .tag-create-form-actions__btn').click() // нажимаем Применить
      cy.get('.ivu-message-custom-content > span').should('text', 'Тег успешно создан')
      cy.wait(2000)
      cy.url().should('include', 'https://panel-cto.s256.dev/tags/edit')
      // cy.get(':nth-child(1) > .tag-create-form-actions__btn').click() //нажимаем Применить еще раз, чтобы проверить попап - не создан, а уже обновлен
      // cy.get('.ivu-message-custom-content > span').should('text','Тег успешно обновлен!')
      // cy.url().should('eq','https://panel-cto.s256.dev/tags/create')
      cy.wait(1000)
      cy.get(':nth-child(2) > .tag-edit-form-actions__btn').click()
      cy.get('.ivu-message-custom-content > span').should('text', 'Тег успешно обновлен!')
      cy.wait(2000)
      cy.url().should('eq', 'https://panel-cto.s256.dev/tags/list')
      cy.get('.table-pagination__info').should('text', 'Всего ' + (n + 4) + ' записей') // здесь проверяем счетчик после нажатия Сохранить (после Применить)
      // проверяем созданный тег
      cy.get(':nth-child(3) > .table-filter__item > .search-input > .ivu-input')
        .should('have.attr', 'placeholder', 'Tag')
        .type('tag test list with multi-selection {enter}')
      cy.get(
        ':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-dropdown-rel > a > .ivu-icon'
      ).click()
      cy.get(
        ':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > .ivu-dropdown-item > div'
      )
        .should('contain', 'Редактировать')
        .click({ force: true })
      cy.url().should('include', 'https://panel-cto.s256.dev/tags/edit')
      cy.get(
        ':nth-child(1) > .tag-edit-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'тег тест список с мультивыбором ')
      cy.get(
        ':nth-child(2) > .tag-edit-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'tag test list with multi-selection ')
      cy.ClickBack()

      cy.get('.event-actions__btn > :nth-child(1) > span')
        .should('text', 'Создать новый тег')
        .click()
      cy.url().should('eq', 'https://panel-cto.s256.dev/tags/create')
      cy.get(
        ':nth-child(1) > .tag-create-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).type('тег тест переключатели1 ') // +m)
      cy.get(
        ':nth-child(2) > .tag-create-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).type('tag test radio button1 ') // +m)
      cy.wait(2000)
      cy.get(':nth-child(2) > .tag-create-form-actions__btn').click()
      cy.get('.ivu-message-custom-content > span').should('text', 'Тег успешно создан')
      cy.wait(2000)
      cy.url().should('eq', 'https://panel-cto.s256.dev/tags/list')
      cy.get('.table-pagination__info').should('text', 'Всего ' + (n + 5) + ' записей') // здесь проверяем счетчик после нажатия Сохранить
      // проверяем созданный тег
      cy.get(':nth-child(2) > .table-filter__item > .search-input > .ivu-input')
        .should('have.attr', 'placeholder', 'Название тега')
        .type('тег тест переключатели {enter}')
      cy.get(
        ':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-dropdown-rel > a > .ivu-icon'
      ).click()
      cy.get(
        ':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > .ivu-dropdown-item > div'
      )
        .should('contain', 'Редактировать')
        .click({ force: true })
      cy.url().should('include', 'https://panel-cto.s256.dev/tags/edit')
      cy.get(
        ':nth-child(1) > .tag-edit-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'тег тест переключатели ')
      cy.get(
        ':nth-child(2) > .tag-edit-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'tag test radio button ')
      cy.ClickBack()

      cy.get('.event-actions__btn > :nth-child(1) > span')
        .should('text', 'Создать новый тег')
        .click()
      cy.url().should('eq', 'https://panel-cto.s256.dev/tags/create')
      cy.get(
        ':nth-child(1) > .tag-create-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).type('тег тест дата1 ') // +m)
      cy.get(
        ':nth-child(2) > .tag-create-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).type('tag test date1 ') // +m)
      cy.get(':nth-child(1) > .tag-create-form-actions__btn').click()
      cy.get('.ivu-message-custom-content > span').should('text', 'Тег успешно создан')
      cy.wait(2000)
      cy.url().should('include', 'https://panel-cto.s256.dev/tags/edit')
      cy.get('.ivu-menu-submenu > .ivu-menu > :nth-child(3) > span')
        .should('text', 'Таблица тегов')
        .click()
      cy.wait(2000)
      cy.url().should('eq', 'https://panel-cto.s256.dev/tags/list')
      cy.get('.table-pagination__info').should('text', 'Всего ' + (n + 6) + ' записей') // здесь проверяем счетчик после нажатия Применить, и далее через листинг - просмотр
      // проверяем созданный тег
      cy.get(':nth-child(3) > .table-filter__item > .search-input > .ivu-input')
        .should('have.attr', 'placeholder', 'Tag')
        .type('tag test date {enter}')
      cy.get(
        ':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-dropdown-rel > a > .ivu-icon'
      ).click()
      cy.get(
        ':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > .ivu-dropdown-item > div'
      )
        .should('contain', 'Редактировать')
        .click({ force: true })
      cy.url().should('include', 'https://panel-cto.s256.dev/tags/edit')
      cy.get(
        ':nth-child(1) > .tag-edit-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'тег тест дата ')
      cy.get(
        ':nth-child(2) > .tag-edit-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'tag test date ')
      cy.ClickBack()

      cy.get('.event-actions__btn > :nth-child(1) > span')
        .should('text', 'Создать новый тег')
        .click()
      cy.url().should('eq', 'https://panel-cto.s256.dev/tags/create')
      cy.get(
        ':nth-child(1) > .tag-create-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).type('тег тест флажки1 ') // +m)
      cy.get(
        ':nth-child(2) > .tag-create-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).type('tag test checkbox1 ') // +m)
      cy.get(':nth-child(1) > .tag-create-form-actions__btn').click() // нажимаем Применить
      cy.get('.ivu-message-custom-content > span').should('text', 'Тег успешно создан')
      cy.wait(2000)
      cy.url().should('include', 'https://panel-cto.s256.dev/tags/edit')
      // cy.get(':nth-child(1) > .tag-create-form-actions__btn').click() //нажимаем Применить еще раз, чтобы проверить попап - не создан, а уже обновлен
      // cy.get('.ivu-message-custom-content > span').should('text','Тег успешно обновлен!')
      // cy.url().should('eq','https://panel-cto.s256.dev/tags/create')
      cy.wait(1000)
      cy.get(':nth-child(2) > .tag-edit-form-actions__btn').click()
      cy.get('.ivu-message-custom-content > span').should('text', 'Тег успешно обновлен!')
      cy.wait(2000)
      cy.url().should('eq', 'https://panel-cto.s256.dev/tags/list')
      cy.get('.table-pagination__info').should('text', 'Всего ' + (n + 7) + ' записей') // здесь проверяем счетчик после нажатия Сохранить (после Применить)
      // проверяем созданный тег
      cy.get(':nth-child(2) > .table-filter__item > .search-input > .ivu-input')
        .should('have.attr', 'placeholder', 'Название тега')
        .type('тег тест флажки {enter}')
      cy.get(
        ':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-dropdown-rel > a > .ivu-icon'
      ).click()
      cy.get(
        ':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > .ivu-dropdown-item > div'
      )
        .should('contain', 'Редактировать')
        .click({ force: true })
      cy.url().should('include', 'https://panel-cto.s256.dev/tags/edit')
      cy.get(
        ':nth-child(1) > .tag-edit-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'тег тест флажки ')
      cy.get(
        ':nth-child(2) > .tag-edit-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'tag test checkbox ')
      cy.ClickBack()

      cy.get('.event-actions__btn > :nth-child(1) > span')
        .should('text', 'Создать новый тег')
        .click()
      cy.url().should('eq', 'https://panel-cto.s256.dev/tags/create')
      cy.get(
        ':nth-child(1) > .tag-create-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).type('тег тест телефон1 ') // +m)
      cy.get(
        ':nth-child(2) > .tag-create-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).type('tag test phone1 ') // +m)
      cy.wait(2000)
      cy.get(':nth-child(2) > .tag-create-form-actions__btn').click()
      cy.get('.ivu-message-custom-content > span').should('text', 'Тег успешно создан')
      cy.wait(2000)
      cy.url().should('eq', 'https://panel-cto.s256.dev/tags/list')
      cy.get('.table-pagination__info').should('text', 'Всего ' + (n + 8) + ' записей') // здесь проверяем счетчик после нажатия Сохранить
      // проверяем созданный тег
      cy.get(':nth-child(3) > .table-filter__item > .search-input > .ivu-input')
        .should('have.attr', 'placeholder', 'Tag')
        .type('tag test phone {enter}')
      cy.get(
        ':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-dropdown-rel > a > .ivu-icon'
      ).click()
      cy.get(
        ':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > .ivu-dropdown-item > div'
      )
        .should('contain', 'Редактировать')
        .click({ force: true })
      cy.url().should('include', 'https://panel-cto.s256.dev/tags/edit')
      cy.get(
        ':nth-child(1) > .tag-edit-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'тег тест телефон ')
      cy.get(
        ':nth-child(2) > .tag-edit-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'tag test phone ')
      cy.ClickBack()

      cy.get('.event-actions__btn > :nth-child(1) > span')
        .should('text', 'Создать новый тег')
        .click()
      cy.url().should('eq', 'https://panel-cto.s256.dev/tags/create')
      cy.get(
        ':nth-child(1) > .tag-create-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).type('тег тест файл1 ') // +m)
      cy.get(
        ':nth-child(2) > .tag-create-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).type('tag test file1 ') // +m)
      cy.get(':nth-child(1) > .tag-create-form-actions__btn').click()
      cy.get('.ivu-message-custom-content > span').should('text', 'Тег успешно создан')
      cy.wait(2000)
      cy.url().should('include', 'https://panel-cto.s256.dev/tags/edit')
      cy.get('.ivu-menu-submenu > .ivu-menu > :nth-child(3) > span')
        .should('text', 'Таблица тегов')
        .click()
      cy.wait(2000)
      cy.url().should('eq', 'https://panel-cto.s256.dev/tags/list')
      cy.get('.table-pagination__info').should('text', 'Всего ' + (n + 9) + ' записей') // здесь проверяем счетчик после нажатия Применить, и далее через листинг - просмотр
      // проверяем созданный тег
      cy.get(':nth-child(2) > .table-filter__item > .search-input > .ivu-input')
        .should('have.attr', 'placeholder', 'Название тега')
        .type('тег тест файл {enter}')
      cy.get(
        ':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-dropdown-rel > a > .ivu-icon'
      ).click()
      cy.get(
        ':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > .ivu-dropdown-item > div'
      )
        .should('contain', 'Редактировать')
        .click({ force: true })
      cy.url().should('include', 'https://panel-cto.s256.dev/tags/edit')
      cy.get(
        ':nth-child(1) > .tag-edit-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'тег тест файл ')
      cy.get(
        ':nth-child(2) > .tag-edit-form__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'tag test file ')
      cy.ClickBack()
    })
  })

  // пока нет опций у полей типа список
  it('Field check', function () {
    cy.get('.ivu-menu-submenu > .ivu-menu > :nth-child(2) > span')
      .should('text', 'Поля для форм')
      .click() // создаем поле, затем добавляю его в форму (затем в мероприятии нужно выбрать эту форму)
    cy.url().should('eq', 'https://panel-cto.s256.dev/form-fields/list')
    // сначала визуально проверяем страницу
    // cy.main();
    cy.get('.ivu-divider-inner-text').should('text', 'Поля для форм')
    cy.get(':nth-child(1) > .table-filter__item > .search-input > .ivu-input').should(
      'have.attr',
      'placeholder',
      'Введите id поля'
    )
    cy.get(':nth-child(2) > .table-filter__item > .search-input > .ivu-input').should(
      'have.attr',
      'placeholder',
      'Введите название поля'
    )
    cy.get('.ivu-select-input').should('have.attr', 'placeholder', 'Выберите тип поля')
    cy.get('.ivu-select-selection > div > .ivu-icon')
    cy.wait(2000)
    cy.get('.ivu-table-cell-sort').should('text', 'ID')
    cy.get('.ivu-icon-md-arrow-dropup')
    cy.get('.ivu-icon-md-arrow-dropdown')
    cy.get('thead > tr > :nth-child(2) > .ivu-table-cell > span').should('text', 'Название поля')
    cy.get('thead > tr > :nth-child(3) > .ivu-table-cell > span').should('text', 'Тип поля')
    cy.get('thead > tr > :nth-child(4) > .ivu-table-cell > span').should('text', 'Активность')
    cy.get(':nth-child(5) > .ivu-table-cell > span')

    // добавляем поле и проверяем, что счетчик увеличился на один
    cy.get('.ivu-table-row').then(($row) => {
      // const n = $row.length;
      const n = 262 // закомментировать потом
      cy.get('.table-pagination__info').should('text', 'Всего ' + n + ' записей')
      cy.get('.form-actions__btn > :nth-child(1) > span').should('text', 'Создать поле').click()
      cy.url().should('eq', 'https://panel-cto.s256.dev/form-fields/create')
      cy.get('.ivu-divider-inner-text > span').should('text', 'Создание поля')
      cy.get('.form-fields-create__title').should('text', 'Данные поля')
      cy.get(':nth-child(1) > .form-fields-create__item > .ivu-form-item-label').should(
        'text',
        'Название'
      )
      cy.get(
        ':nth-child(1) > .form-fields-create__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).should('have.attr', 'placeholder', 'Введите название поля')
      cy.get(':nth-child(2) > .form-fields-create__item > .ivu-form-item-label').should(
        'text',
        'Тип поля'
      )
      cy.get('.ivu-select-placeholder').should('text', 'Выберите тип поля')
      cy.get(':nth-child(3) > .form-fields-create__item > .ivu-form-item-label').should(
        'text',
        'Подсказка'
      )
      cy.get(
        ':nth-child(3) > .form-fields-create__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).should('have.attr', 'placeholder', 'Введите подсказку')
      cy.get(':nth-child(4) > .form-fields-create__item > .ivu-form-item-label').should(
        'text',
        'Заполнитель'
      )
      cy.get(
        ':nth-child(4) > .form-fields-create__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).should('have.attr', 'placeholder', 'Заполнитель по умолчанию')
      cy.get(':nth-child(5) > .form-fields-create__item > .ivu-form-item-label').should(
        'text',
        'Tag'
      )
      cy.get('.ivu-select-input').should('have.attr', 'placeholder', 'Выберите тег')
      cy.get(':nth-child(6) > .form-fields-create__item > .ivu-form-item-label').should(
        'text',
        'Активность'
      )
      cy.get('.ivu-checkbox-input')
      // проверка обязательности полей
      cy.get(':nth-child(1) > .form-fields-create-actions__btn > span')
        .should('text', 'Применить')
        .click()
      cy.get(
        ':nth-child(1) > .form-fields-create__item > .ivu-form-item-content > .ivu-form-item-error-tip'
      ).should('text', 'Это поле обязательно!')
      cy.get(
        ':nth-child(2) > .form-fields-create__item > .ivu-form-item-content > .ivu-form-item-error-tip'
      ).should('text', 'Это поле обязательно!')
      cy.get(
        ':nth-child(5) > .form-fields-create__item > .ivu-form-item-content > .ivu-form-item-error-tip'
      ).should('text', 'Это поле обязательно!')
      cy.get(':nth-child(2) > .form-fields-create-actions__btn > span')
        .should('text', 'Сохранить')
        .click()
      cy.get(
        ':nth-child(1) > .form-fields-create__item > .ivu-form-item-content > .ivu-form-item-error-tip'
      ).should('text', 'Это поле обязательно!')
      cy.get(
        ':nth-child(2) > .form-fields-create__item > .ivu-form-item-content > .ivu-form-item-error-tip'
      ).should('text', 'Это поле обязательно!')
      cy.get(
        ':nth-child(5) > .form-fields-create__item > .ivu-form-item-content > .ivu-form-item-error-tip'
      ).should('text', 'Это поле обязательно!')
      cy.ClickBack() // проверка Назад - что ничего не создается
      cy.url().should('eq', 'https://panel-cto.s256.dev/form-fields/list')
      cy.get('.table-pagination__info').should('text', 'Всего ' + n + ' записей')
      cy.get('.form-actions__btn > :nth-child(1) > span').should('text', 'Создать поле').click()
      // снова проверка Назад - теперь уже с заполнением обязательных полей
      cy.get(
        ':nth-child(1) > .form-fields-create__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).type('Поле тест')
      cy.get('.ivu-select-placeholder').click()
      cy.get('.ivu-select-dropdown-list > :nth-child(1)').should('text', 'Строка')
      cy.get('.ivu-select-dropdown-list > :nth-child(2)').should('text', 'Текст')
      cy.get('.ivu-select-dropdown-list > :nth-child(3)').should('text', 'Список')
      cy.get('.ivu-select-dropdown-list > :nth-child(4)').should('text', 'Список с мультивыбором')
      cy.get('.ivu-select-dropdown-list > :nth-child(5)').should('text', 'Переключатели')
      cy.get('.ivu-select-dropdown-list > :nth-child(6)').should('text', 'Дата')
      cy.get('.ivu-select-dropdown-list > :nth-child(7)').should('text', 'Флажки')
      cy.get('.ivu-select-dropdown-list > :nth-child(8)').should('text', 'Телефон')
      cy.get('.ivu-select-dropdown-list > :nth-child(9)').should('text', 'Файл')
      cy.get('.ivu-select-dropdown-list > :nth-child(1)').should('text', 'Строка').click()
      cy.get('.ivu-select-input').click().type('tag test string1 ')
      cy.wait(2000)
      cy.get(
        ':nth-child(5) > .form-fields-create__item > .ivu-form-item-content > .ivu-select > .ivu-select-dropdown > .ivu-select-dropdown-list'
      )
        .contains('tag test string')
        .first()
        .click()
      cy.ClickBack() // снова проверка Назад - что ничего не создается
      cy.url().should('eq', 'https://panel-cto.s256.dev/form-fields/list')
      cy.get('.table-pagination__info').should('text', 'Всего ' + n + ' записей')

      cy.get('.form-actions__btn > :nth-child(1) > span').should('text', 'Создать поле').click() // Создаем поле типа строка
      cy.url().should('eq', 'https://panel-cto.s256.dev/form-fields/create')
      cy.get(
        ':nth-child(1) > .form-fields-create__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).type('Поле тест строка')
      cy.get('.ivu-select-placeholder').click()
      cy.get('.ivu-select-dropdown-list > :nth-child(1)').should('text', 'Строка').click()
      cy.get(':nth-child(3) > .ivu-card-body > .form-fields-create__title').should('not.be.visible')
      cy.get('.ivu-checkbox-input').click('center')
      cy.wait(1000)
      cy.get('[type="checkbox"]').check()
      cy.wait(2000)
      cy.get('.ivu-select-input').click().type('tag test string1 ')
      cy.wait(2000)
      cy.get(
        ':nth-child(5) > .form-fields-create__item > .ivu-form-item-content > .ivu-select > .ivu-select-dropdown > .ivu-select-dropdown-list'
      )
        .contains('tag test string1 ')
        .click({ force: true })
      cy.get(':nth-child(1) > .form-fields-create-actions__btn > span').click() // нажимаем Применить
      cy.get('.ivu-message-custom-content > span').should('text', 'Поле успешно создано')
      cy.wait(2000)
      cy.url().should('include', 'https://panel-cto.s256.dev/form-fields/edit')
      // cy.get(':nth-child(1) > .tag-create-form-actions__btn').click() //нажимаем Применить еще раз, чтобы проверить попап - не создан, а уже обновлен
      // cy.get('.ivu-message-custom-content > span').should('text','Тег успешно обновлен!')
      // cy.url().should('eq','https://panel-cto.s256.dev/tags/create')
      cy.wait(1000)
      cy.get(':nth-child(2) > .form-fields-create-actions__btn > span').click()
      cy.wait(1000)
      // нет пока проверки на кол-во использований(и кол-во данных) тега - нужно будет здесь вставить!!!!!!!
      cy.get('.ivu-message-custom-content > span').should('text', 'Поле успешно обновлено')
      cy.wait(2000)
      cy.url().should('eq', 'https://panel-cto.s256.dev/form-fields/list')
      cy.get('.table-pagination__info').should('text', 'Всего ' + (n + 1) + ' записей') // здесь проверяем счетчик после нажатия Сохранить (после Применить)
      // проверяем созданное поле
      cy.get(':nth-child(2) > .table-filter__item > .search-input > .ivu-input').type(
        'Поле тест строка{enter}'
      )
      cy.get(
        ':nth-child(1) > :nth-child(5) > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-dropdown-rel > a > .ivu-icon'
      ).click()
      cy.get(
        ':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > .ivu-dropdown-item > div'
      )
        .first()
        .should('contain', 'Редактировать')
        .click({ force: true })
      cy.url().should('include', 'https://panel-cto.s256.dev/form-fields/edit')
      cy.wait(1000)
      cy.get(
        ':nth-child(1) > .form-fields-create__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'Поле тест строка')
      cy.get('.ivu-select-selected-value').contains('Строка')
      cy.wait(2000)
      cy.get('.ivu-select-input').should('have.value', 'tag test string1 ')
      cy.wait(2000)
      cy.get('[type="checkbox"]').should('be.checked')
      cy.get(':nth-child(3) > .ivu-card-body > .form-fields-create__title').should('not.be.visible')
      cy.ClickBack()
      cy.url().should('eq', 'https://panel-cto.s256.dev/form-fields/list')

      cy.get('.form-actions__btn > :nth-child(1) > span').should('text', 'Создать поле').click() // Создаем поле типа текст
      cy.url().should('eq', 'https://panel-cto.s256.dev/form-fields/create')
      cy.get(
        ':nth-child(1) > .form-fields-create__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).type('Поле тест текст')
      cy.get('.ivu-select-placeholder').click()
      cy.get('.ivu-select-dropdown-list > :nth-child(2)').should('text', 'Текст').click()
      cy.get(':nth-child(3) > .ivu-card-body > .form-fields-create__title').should('not.be.visible')
      cy.get(
        ':nth-child(3) > .form-fields-create__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).type('Подсказка поля текст')
      cy.get('.ivu-select-input').click().type('tag test text1 ')
      cy.wait(2000)
      cy.get(
        ':nth-child(5) > .form-fields-create__item > .ivu-form-item-content > .ivu-select > .ivu-select-dropdown > .ivu-select-dropdown-list'
      )
        .contains('tag test text1 ')
        .click({ force: true })
      cy.wait(2000)
      cy.get('.ivu-checkbox-input').click('center')
      cy.wait(1000)
      cy.get('[type="checkbox"]').check()
      cy.wait(2000)
      cy.get(':nth-child(2) > .form-fields-create-actions__btn > span')
        .should('text', 'Сохранить')
        .click() // нажимаем Сохранить
      cy.get('.ivu-message-custom-content > span').should('text', 'Поле успешно создано')
      cy.wait(2000)
      // cy.url().should('eq','https://panel-cto.s256.dev/form-fields/list') //раскомментировать как починят баг!!!!!!
      cy.get('.ivu-menu-submenu > .ivu-menu > :nth-child(2) > span')
        .should('text', 'Поля для форм')
        .click()
      cy.get('.table-pagination__info').should('text', 'Всего ' + (n + 2) + ' записей') // здесь проверяем счетчик после нажатия Сохранить
      // проверяем созданное поле
      cy.get('.ivu-select-input').click()
      cy.wait(2000)
      cy.get('.ivu-select-dropdown-list > :nth-child(2)').contains('Текст').click()
      cy.wait(2000)
      cy.get(':nth-child(2) > .table-filter__item > .search-input > .ivu-input').type(
        'Поле тест текст{enter}'
      )
      cy.get(
        ':nth-child(1) > :nth-child(5) > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-dropdown-rel > a > .ivu-icon'
      ).click()
      cy.get(
        ':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > .ivu-dropdown-item > div'
      )
        .first()
        .should('contain', 'Редактировать')
        .click({ force: true })
      cy.url().should('include', 'https://panel-cto.s256.dev/form-fields/edit')
      cy.get(
        ':nth-child(1) > .form-fields-create__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'Поле тест текст')
      cy.get('.ivu-select-selected-value').contains('Текст')
      cy.get(
        ':nth-child(3) > .form-fields-create__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'Подсказка поля текст')
      cy.wait(2000)
      cy.get('.ivu-select-input').should('have.value', 'tag test text1 ')
      cy.wait(2000)
      cy.get('[type="checkbox"]').should('be.checked')
      cy.get(':nth-child(3) > .ivu-card-body > .form-fields-create__title').should('not.be.visible')
      cy.ClickBack()
      cy.url().should('eq', 'https://panel-cto.s256.dev/form-fields/list')

      cy.get('.form-actions__btn > :nth-child(1) > span').should('text', 'Создать поле').click() // Создаем поле типа список
      cy.url().should('eq', 'https://panel-cto.s256.dev/form-fields/create')
      cy.get(
        ':nth-child(1) > .form-fields-create__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).type('Поле тест список')
      cy.get('.ivu-select-placeholder').click()
      cy.get(':nth-child(2) > .ivu-card-body > .form-fields-create__title').should('not.be.visible')
      cy.get('.ivu-select-dropdown-list > :nth-child(3)').should('text', 'Список').click()
      cy.wait(3000)
      cy.get(':nth-child(2) > .ivu-card-body > .form-fields-create__title').should('be.visible') // добавляем опцию, затем удаляем ее
      cy.get('.ivu-col-span-16 > .ivu-input-wrapper > .ivu-input')
        .should('have.attr', 'placeholder', 'Введите значение')
        .type('опция1 список')
      cy.get('.handle').should('not.be.visible')
      cy.get('.ivu-col-span-8 > .ivu-btn > span').should('text', 'Добавить значение').click()
      cy.wait(2000)
      cy.get('.handle').should('be.visible')
      cy.get('.ivu-col-span-13 > .ivu-input-wrapper > .ivu-input').should(
        'have.value',
        'опция1 список'
      )
      cy.get('.ivu-col-span-9 > .ivu-checkbox-wrapper > .ivu-checkbox > .ivu-checkbox-input')
      cy.get('.ivu-col-span-9 > .ivu-checkbox-wrapper').should('text', '  По-умолчанию')
      cy.get('.ivu-col-span-9 > .ivu-checkbox-wrapper > .ivu-checkbox > .ivu-checkbox-input')
      cy.get('.c-pointer').click()
      cy.get('.ivu-col-span-13 > .ivu-input-wrapper > .ivu-input').should('not.be.visible')

      cy.get(
        ':nth-child(4) > .form-fields-create__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).type('Заполнитель поля список')
      cy.get('.ivu-select-input').click().type('tag test list1 10')
      cy.wait(2000)
      cy.get(
        ':nth-child(5) > .form-fields-create__item > .ivu-form-item-content > .ivu-select > .ivu-select-dropdown > .ivu-select-dropdown-list'
      )
        .contains('tag test list1 10')
        .click({ force: true })
      cy.get('[type="checkbox"]').check()
      cy.wait(2000)
      cy.get(':nth-child(1) > .form-fields-create-actions__btn > span').click() // нажимаем Применить
      cy.get('.ivu-message-custom-content > span').should('text', 'Поле успешно создано')
      cy.wait(2000)
      cy.url().should('include', 'https://panel-cto.s256.dev/form-fields/edit')
      cy.get('.ivu-menu-submenu > .ivu-menu > :nth-child(2) > span')
        .should('text', 'Поля для форм')
        .click()
      cy.get('.table-pagination__info').should('text', 'Всего ' + (n + 3) + ' записей') // здесь проверяем счетчик после нажатия Применить
      // проверяем созданное поле
      cy.get('.ivu-select-input').click()
      cy.wait(2000)
      cy.get('.ivu-select-dropdown-list > :nth-child(2)').contains('Текст').click()
      cy.wait(2000)
      cy.get(':nth-child(2) > .table-filter__item > .search-input > .ivu-input').type(
        'Поле тест список{enter}'
      )
      cy.get(
        ':nth-child(1) > :nth-child(5) > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-dropdown-rel > a > .ivu-icon'
      ).click()
      cy.get(
        ':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > .ivu-dropdown-item > div'
      )
        .first()
        .should('contain', 'Редактировать')
        .click({ force: true })
      cy.url().should('include', 'https://panel-cto.s256.dev/form-fields/edit')
      cy.get(
        ':nth-child(1) > .form-fields-create__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'Поле тест список')
      cy.get('.ivu-select-selected-value').contains('Список')
      cy.wait(2000)
      cy.get(
        ':nth-child(4) > .form-fields-create__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'Заполнитель поля список')
      cy.wait(2000)
      cy.get('.ivu-select-input').should('have.value', 'tag test list1 10')
      cy.get('.ivu-checkbox-input').should('be.checked')
      cy.get(':nth-child(2) > .ivu-card-body > .form-fields-create__title').should('be.visible')
      cy.get('.ivu-col-span-13 > .ivu-input-wrapper > .ivu-input').should('not.be.visible')
      cy.ClickBack()
      cy.url().should('eq', 'https://panel-cto.s256.dev/form-fields/list')

      cy.get('.form-actions__btn > :nth-child(1) > span').should('text', 'Создать поле').click() // Создаем поле типа список с мультивыбором
      cy.url().should('eq', 'https://panel-cto.s256.dev/form-fields/create')
      cy.get(
        ':nth-child(1) > .form-fields-create__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).type('Поле тест список с мультивыбором')
      cy.get('.ivu-select-placeholder').click()
      cy.get(':nth-child(2) > .ivu-card-body > .form-fields-create__title').should('not.be.visible')
      cy.get('.ivu-select-dropdown-list > :nth-child(4)')
        .should('text', 'Список с мультивыбором')
        .click()
      cy.wait(3000)
      cy.get(':nth-child(2) > .ivu-card-body > .form-fields-create__title').should('be.visible')
      cy.get(
        ':nth-child(3) > .form-fields-create__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).type('Подсказка поля список с мультивыбором')
      cy.get(
        ':nth-child(4) > .form-fields-create__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).type('Заполнитель поля список с мультивыбором')
      cy.get('.ivu-select-input').click().type('tag test list with multi-selection1 ')
      cy.wait(2000)
      cy.get(
        ':nth-child(5) > .form-fields-create__item > .ivu-form-item-content > .ivu-select > .ivu-select-dropdown > .ivu-select-dropdown-list'
      )
        .contains('tag test list with multi-selection1 ')
        .click({ force: true })
      cy.wait(2000)
      cy.get('.ivu-checkbox-input').click('center')
      cy.wait(1000)
      cy.get('[type="checkbox"]').check()
      cy.wait(2000)
      cy.get(':nth-child(2) > .ivu-card-body > .form-fields-create__title').should('be.visible') // добавляем 3 опции, затем удаляем 1 из них
      cy.get('.ivu-col-span-16 > .ivu-input-wrapper > .ivu-input')
        .should('have.attr', 'placeholder', 'Введите значение')
        .type('опция1 список')
      cy.get('.handle').should('not.be.visible')
      cy.get('.ivu-col-span-8 > .ivu-btn > span').should('text', 'Добавить значение').click()
      cy.wait(2000)
      cy.get('.handle').should('be.visible')
      cy.get('.ivu-col-span-13 > .ivu-input-wrapper > .ivu-input').should(
        'have.value',
        'опция1 список'
      )
      cy.get('.ivu-col-span-9 > .ivu-checkbox-wrapper > .ivu-checkbox > .ivu-checkbox-input')
      cy.get('.ivu-col-span-9 > .ivu-checkbox-wrapper').should('text', '  По-умолчанию')
      cy.get('.c-pointer')

      cy.get('.ivu-col-span-16 > .ivu-input-wrapper > .ivu-input')
        .should('have.attr', 'placeholder', 'Введите значение')
        .type('опция2 список')
      cy.get(
        ':nth-child(2) > .ivu-col-span-24 > .ivu-row-flex > .field-values-row__handle > .handle'
      ).should('not.be.visible')
      cy.get('.ivu-col-span-8 > .ivu-btn > span').should('text', 'Добавить значение').click()
      cy.wait(2000)
      cy.get(
        ':nth-child(2) > .ivu-col-span-24 > .ivu-row-flex > .field-values-row__handle > .handle'
      ).should('be.visible')
      cy.get(
        ':nth-child(2) > .ivu-col-span-24 > .ivu-row-flex > .ivu-col-span-13 > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'опция2 список')
      cy.get(
        ':nth-child(2) > .ivu-col-span-24 > .ivu-row-flex > .ivu-col-span-9 > .ivu-checkbox-wrapper > .ivu-checkbox > .ivu-checkbox-input'
      )
      cy.get(
        ':nth-child(2) > .ivu-col-span-24 > .ivu-row-flex > .ivu-col-span-9 > .ivu-checkbox-wrapper'
      ).should('text', '  По-умолчанию')
      cy.get(':nth-child(2) > .ivu-col-span-24 > .ivu-row-flex > :nth-child(4) > .c-pointer')

      cy.get('.ivu-col-span-16 > .ivu-input-wrapper > .ivu-input')
        .should('have.attr', 'placeholder', 'Введите значение')
        .type('опция3 список')
      cy.get(
        ':nth-child(3) > .ivu-col-span-24 > .ivu-row-flex > .field-values-row__handle > .handle'
      ).should('not.be.visible')
      cy.get('.ivu-col-span-8 > .ivu-btn > span').should('text', 'Добавить значение').click()
      cy.wait(2000)
      cy.get(
        ':nth-child(3) > .ivu-col-span-24 > .ivu-row-flex > .field-values-row__handle > .handle'
      ).should('be.visible')
      cy.get(
        ':nth-child(3) > .ivu-col-span-24 > .ivu-row-flex > .ivu-col-span-13 > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'опция3 список')
      cy.get(
        ':nth-child(3) > .ivu-col-span-24 > .ivu-row-flex > .ivu-col-span-9 > .ivu-checkbox-wrapper > .ivu-checkbox > .ivu-checkbox-input'
      )
      cy.get(
        ':nth-child(2) > .ivu-col-span-24 > .ivu-row-flex > .ivu-col-span-9 > .ivu-checkbox-wrapper'
      ).should('text', '  По-умолчанию')
      cy.get(':nth-child(3) > .ivu-col-span-24 > .ivu-row-flex > :nth-child(4) > .c-pointer')

      cy.get(
        ':nth-child(2) > .ivu-col-span-24 > .ivu-row-flex > :nth-child(4) > .c-pointer'
      ).click()
      cy.get(
        ':nth-child(1) > .ivu-col-span-24 > .ivu-row-flex > .ivu-col-span-13 > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'опция1 список')
      cy.get(
        ':nth-child(2) > .ivu-col-span-24 > .ivu-row-flex > .ivu-col-span-13 > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'опция3 список')
      cy.get(
        ':nth-child(3) > .ivu-col-span-24 > .ivu-row-flex > .ivu-col-span-13 > .ivu-input-wrapper > .ivu-input'
      ).should('not.be.visible')

      cy.get(':nth-child(2) > .form-fields-create-actions__btn > span')
        .should('text', 'Сохранить')
        .click() // нажимаем Сохранить
      cy.get('.ivu-message-custom-content > span').should('text', 'Поле успешно создано')
      cy.wait(2000)
      // cy.url().should('eq','https://panel-cto.s256.dev/form-fields/list') //раскомментировать как починят баг!!!!!!
      cy.get('.ivu-menu-submenu > .ivu-menu > :nth-child(2) > span')
        .should('text', 'Поля для форм')
        .click()
      cy.get('.table-pagination__info').should('text', 'Всего ' + (n + 4) + ' записей') // здесь проверяем счетчик после нажатия Сохранить
      // проверяем созданное поле
      cy.get('.ivu-select-input').click()
      cy.wait(2000)
      cy.get('.ivu-select-dropdown-list > :nth-child(4)').contains('Список с мультивыбором').click()
      cy.wait(2000)
      cy.get(':nth-child(2) > .table-filter__item > .search-input > .ivu-input').type(
        'Поле тест список с мультивыбором{enter}'
      )
      cy.get(
        ':nth-child(1) > :nth-child(5) > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-dropdown-rel > a > .ivu-icon'
      ).click()
      cy.get(
        ':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > .ivu-dropdown-item > div'
      )
        .first()
        .should('contain', 'Редактировать')
        .click({ force: true })
      cy.url().should('include', 'https://panel-cto.s256.dev/form-fields/edit')
      cy.get(
        ':nth-child(1) > .form-fields-create__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'Поле тест список с мультивыбором')
      cy.get('.ivu-select-selected-value').contains('Список с мультивыбором')
      cy.get(
        ':nth-child(3) > .form-fields-create__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'Подсказка поля список с мультивыбором')
      cy.get(
        ':nth-child(4) > .form-fields-create__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'Заполнитель поля список с мультивыбором')
      cy.wait(2000)
      cy.get('.ivu-select-input').should('have.value', 'tag test list with multi-selection1 ')
      cy.wait(2000)
      cy.get('[type="checkbox"]').should('be.checked')
      cy.get(':nth-child(2) > .ivu-card-body > .form-fields-create__title').should('be.visible')
      cy.get(
        ':nth-child(1) > .ivu-col-span-24 > .ivu-row-flex > .ivu-col-span-13 > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'опция1 список')
      cy.get(
        ':nth-child(2) > .ivu-col-span-24 > .ivu-row-flex > .ivu-col-span-13 > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'опция3 список')
      cy.get(
        ':nth-child(3) > .ivu-col-span-24 > .ivu-row-flex > .ivu-col-span-13 > .ivu-input-wrapper > .ivu-input'
      ).should('not.be.visible')
      cy.ClickBack()
      cy.url().should('eq', 'https://panel-cto.s256.dev/form-fields/list')

      cy.get('.form-actions__btn > :nth-child(1) > span').should('text', 'Создать поле').click() // Создаем поле типа переключатели
      cy.url().should('eq', 'https://panel-cto.s256.dev/form-fields/create')
      cy.get(
        ':nth-child(1) > .form-fields-create__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).type('Поле тест переключатели')
      cy.get('.ivu-select-placeholder').click()
      cy.get('.ivu-select-dropdown-list > :nth-child(5)').should('text', 'Переключатели').click()
      cy.wait(1000)
      cy.get(':nth-child(2) > .ivu-card-body > .form-fields-create__title').should('be.visible')
      cy.get('.ivu-checkbox-input').click('center')
      cy.wait(1000)
      cy.get('[type="checkbox"]').check()
      cy.wait(2000)
      cy.get('.ivu-select-input').click().type('tag test radio button1 ')
      cy.wait(2000)
      cy.get(
        ':nth-child(5) > .form-fields-create__item > .ivu-form-item-content > .ivu-select > .ivu-select-dropdown > .ivu-select-dropdown-list'
      )
        .contains('tag test radio button1 ')
        .click({ force: true })
      cy.wait(2000)
      cy.get(':nth-child(1) > .form-fields-create-actions__btn > span').click() // нажимаем Применить
      cy.get('.ivu-message-custom-content > span').should('text', 'Поле успешно создано')
      cy.wait(2000)
      cy.url().should('include', 'https://panel-cto.s256.dev/form-fields/edit')
      // cy.get(':nth-child(1) > .tag-create-form-actions__btn').click() //нажимаем Применить еще раз, чтобы проверить попап - не создан, а уже обновлен
      // cy.get('.ivu-message-custom-content > span').should('text','Тег успешно обновлен!')
      // cy.url().should('eq','https://panel-cto.s256.dev/tags/create')
      cy.wait(1000)
      cy.get(':nth-child(2) > .form-fields-create-actions__btn > span').click()
      cy.wait(1000)
      // нет пока проверки на кол-во использований(и кол-во данных) тега - нужно будет здесь вставить!!!!!!!
      cy.get('.ivu-message-custom-content > span').should('text', 'Поле успешно обновлено')
      cy.wait(2000)
      cy.url().should('eq', 'https://panel-cto.s256.dev/form-fields/list')
      cy.get('.table-pagination__info').should('text', 'Всего ' + (n + 5) + ' записей') // здесь проверяем счетчик после нажатия Сохранить (после Применить)
      // проверяем созданное поле
      cy.get(':nth-child(2) > .table-filter__item > .search-input > .ivu-input').type(
        'Поле тест переключатели{enter}'
      )
      cy.get(
        ':nth-child(1) > :nth-child(5) > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-dropdown-rel > a > .ivu-icon'
      ).click()
      cy.get(
        ':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > .ivu-dropdown-item > div'
      )
        .first()
        .should('contain', 'Редактировать')
        .click({ force: true })
      cy.url().should('include', 'https://panel-cto.s256.dev/form-fields/edit')
      cy.wait(1000)
      cy.get(
        ':nth-child(1) > .form-fields-create__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'Поле тест переключатели')
      cy.get('.ivu-select-selected-value').contains('Переключатели')
      cy.wait(2000)
      cy.get('.ivu-select-input').should('have.value', 'tag test radio button1 ')
      cy.wait(2000)
      cy.get('[type="checkbox"]').should('be.checked')
      cy.get(':nth-child(2) > .ivu-card-body > .form-fields-create__title').should('be.visible')
      cy.ClickBack()
      cy.url().should('eq', 'https://panel-cto.s256.dev/form-fields/list')

      cy.get('.form-actions__btn > :nth-child(1) > span').should('text', 'Создать поле').click() // Создаем поле типа дата
      cy.url().should('eq', 'https://panel-cto.s256.dev/form-fields/create')
      cy.get(
        ':nth-child(1) > .form-fields-create__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).type('Поле тест дата')
      cy.get('.ivu-select-placeholder').click()
      cy.get('.ivu-select-dropdown-list > :nth-child(6)')
        .should('text', 'Дата')
        .click({ force: true })
      cy.get(':nth-child(3) > .ivu-card-body > .form-fields-create__title').should('not.be.visible')
      cy.get(
        ':nth-child(3) > .form-fields-create__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).type('Подсказка поля дата')
      cy.get('.ivu-select-input').click().type('tag test date1 ')
      cy.wait(2000)
      cy.get(
        ':nth-child(5) > .form-fields-create__item > .ivu-form-item-content > .ivu-select > .ivu-select-dropdown > .ivu-select-dropdown-list'
      )
        .contains('tag test date1 ')
        .click({ force: true })
      cy.wait(2000)
      cy.get('.ivu-checkbox-input').click('center')
      cy.wait(1000)
      cy.get('[type="checkbox"]').check()
      cy.wait(2000)
      cy.get(':nth-child(2) > .form-fields-create-actions__btn > span')
        .should('text', 'Сохранить')
        .click() // нажимаем Сохранить
      cy.get('.ivu-message-custom-content > span').should('text', 'Поле успешно создано')
      cy.wait(2000)
      // cy.url().should('eq','https://panel-cto.s256.dev/form-fields/list') //раскомментировать как починят баг!!!!!!
      cy.get('.ivu-menu-submenu > .ivu-menu > :nth-child(2) > span')
        .should('text', 'Поля для форм')
        .click()
      cy.get('.table-pagination__info').should('text', 'Всего ' + (n + 6) + ' записей') // здесь проверяем счетчик после нажатия Сохранить
      // проверяем созданное поле
      cy.get('.ivu-select-input').click()
      cy.wait(2000)
      cy.get('.ivu-select-dropdown-list > :nth-child(6)').contains('Дата').click()
      cy.wait(2000)
      cy.get(':nth-child(2) > .table-filter__item > .search-input > .ivu-input').type(
        'Поле тест дата{enter}'
      )
      cy.wait(2000)
      cy.get(
        ':nth-child(1) > :nth-child(5) > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-dropdown-rel > a > .ivu-icon'
      ).click({ force: true })
      cy.get(
        ':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > .ivu-dropdown-item > div'
      )
        .first()
        .should('contain', 'Редактировать')
        .click({ force: true })
      cy.url().should('include', 'https://panel-cto.s256.dev/form-fields/edit')
      cy.get(
        ':nth-child(1) > .form-fields-create__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'Поле тест дата')
      cy.get('.ivu-select-selected-value').contains('Дата')
      cy.get(
        ':nth-child(3) > .form-fields-create__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'Подсказка поля дата')
      cy.wait(2000)
      cy.get('.ivu-select-input').should('have.value', 'tag test date1 ')
      cy.wait(2000)
      cy.get('[type="checkbox"]').should('be.checked')
      cy.get(':nth-child(3) > .ivu-card-body > .form-fields-create__title').should('not.be.visible')
      cy.ClickBack()
      cy.url().should('eq', 'https://panel-cto.s256.dev/form-fields/list')

      cy.get('.form-actions__btn > :nth-child(1) > span').should('text', 'Создать поле').click() // Создаем поле типа флажки
      cy.url().should('eq', 'https://panel-cto.s256.dev/form-fields/create')
      cy.get(
        ':nth-child(1) > .form-fields-create__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).type('Поле тест флажки')
      cy.get('.ivu-select-placeholder').click()
      cy.get(':nth-child(2) > .ivu-card-body > .form-fields-create__title').should('not.be.visible')
      cy.get('.ivu-select-dropdown-list > :nth-child(7)')
        .should('text', 'Флажки')
        .click({ force: true })
      cy.wait(3000)
      cy.get(':nth-child(2) > .ivu-card-body > .form-fields-create__title').should('be.visible') // добавить опции!!!!!!!!!!!!
      cy.get(
        ':nth-child(4) > .form-fields-create__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).type('Заполнитель поля флажки')
      cy.get('.ivu-select-input').click().type('tag test checkbox1 ')
      cy.get(
        ':nth-child(5) > .form-fields-create__item > .ivu-form-item-content > .ivu-select > .ivu-select-dropdown > .ivu-select-dropdown-list'
      )
        .contains('tag test checkbox1 ')
        .click({ force: true })
      cy.get('[type="checkbox"]').check()
      cy.wait(2000)
      cy.get(':nth-child(1) > .form-fields-create-actions__btn > span').click() // нажимаем Применить
      cy.get('.ivu-message-custom-content > span').should('text', 'Поле успешно создано')
      cy.wait(2000)
      cy.url().should('include', 'https://panel-cto.s256.dev/form-fields/edit')
      cy.get('.ivu-menu-submenu > .ivu-menu > :nth-child(2) > span')
        .should('text', 'Поля для форм')
        .click()
      cy.get('.table-pagination__info').should('text', 'Всего ' + (n + 7) + ' записей') // здесь проверяем счетчик после нажатия Применить
      // проверяем созданное поле
      cy.get('.ivu-select-input').click()
      cy.wait(2000)
      cy.get('.ivu-select-dropdown-list > :nth-child(2)').contains('Текст').click()
      cy.wait(2000)
      cy.get(':nth-child(2) > .table-filter__item > .search-input > .ivu-input').type(
        'Поле тест флажки{enter}'
      )
      cy.get(
        ':nth-child(1) > :nth-child(5) > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-dropdown-rel > a > .ivu-icon'
      ).click()
      cy.get(
        ':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > .ivu-dropdown-item > div'
      )
        .first()
        .should('contain', 'Редактировать')
        .click({ force: true })
      cy.url().should('include', 'https://panel-cto.s256.dev/form-fields/edit')
      cy.get(
        ':nth-child(1) > .form-fields-create__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'Поле тест флажки')
      cy.get('.ivu-select-selected-value').contains('Флажки')
      cy.get(
        ':nth-child(4) > .form-fields-create__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'Заполнитель поля флажки')
      cy.wait(2000)
      cy.get('.ivu-select-input').should('have.value', 'tag test checkbox1 ')
      cy.wait(2000)
      cy.get('.ivu-checkbox-input').should('be.checked')
      cy.get(':nth-child(2) > .ivu-card-body > .form-fields-create__title').should('be.visible')
      cy.ClickBack()
      cy.url().should('eq', 'https://panel-cto.s256.dev/form-fields/list')

      cy.get('.form-actions__btn > :nth-child(1) > span').should('text', 'Создать поле').click() // Создаем поле типа телефон
      cy.url().should('eq', 'https://panel-cto.s256.dev/form-fields/create')
      cy.get(
        ':nth-child(1) > .form-fields-create__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).type('Поле тест телефон')
      cy.get('.ivu-select-placeholder').click()
      cy.get(':nth-child(2) > .ivu-card-body > .form-fields-create__title').should('not.be.visible')
      cy.get('.ivu-select-dropdown-list > :nth-child(8)')
        .should('text', 'Телефон')
        .click({ force: true })
      cy.wait(3000)
      cy.get(
        ':nth-child(4) > .form-fields-create__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).type('Заполнитель поля телефон')
      cy.get('.ivu-select-input').click().type('tag test phone1 ')
      cy.get(
        ':nth-child(5) > .form-fields-create__item > .ivu-form-item-content > .ivu-select > .ivu-select-dropdown > .ivu-select-dropdown-list'
      )
        .contains('tag test phone1 ')
        .click({ force: true })
      cy.get('[type="checkbox"]').check()
      cy.wait(2000)
      cy.get(':nth-child(1) > .form-fields-create-actions__btn > span').click() // нажимаем Применить
      cy.get('.ivu-message-custom-content > span').should('text', 'Поле успешно создано')
      cy.wait(2000)
      cy.url().should('include', 'https://panel-cto.s256.dev/form-fields/edit')
      cy.get('.ivu-menu-submenu > .ivu-menu > :nth-child(2) > span')
        .should('text', 'Поля для форм')
        .click()
      cy.get('.table-pagination__info').should('text', 'Всего ' + (n + 8) + ' записей') // здесь проверяем счетчик после нажатия Применить
      // проверяем созданное поле
      cy.get('.ivu-select-input').click()
      cy.wait(2000)
      cy.get('.ivu-select-dropdown-list > :nth-child(2)').contains('Текст').click()
      cy.wait(2000)
      cy.get(':nth-child(2) > .table-filter__item > .search-input > .ivu-input').type(
        'Поле тест телефон{enter}'
      )
      cy.get(
        ':nth-child(1) > :nth-child(5) > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-dropdown-rel > a > .ivu-icon'
      ).click({ force: true })
      cy.get(
        ':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > .ivu-dropdown-item > div'
      )
        .first()
        .should('contain', 'Редактировать')
        .click({ force: true })
      cy.url().should('include', 'https://panel-cto.s256.dev/form-fields/edit')
      cy.get(
        ':nth-child(1) > .form-fields-create__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'Поле тест телефон')
      cy.get('.ivu-select-selected-value').contains('Телефон')
      cy.get(
        ':nth-child(4) > .form-fields-create__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'Заполнитель поля телефон')
      cy.wait(2000)
      cy.get('.ivu-select-input').should('have.value', 'tag test phone1 ')
      cy.wait(2000)
      cy.get('.ivu-checkbox-input').should('be.checked')
      cy.get(':nth-child(2) > .ivu-card-body > .form-fields-create__title').should('be.visible')
      cy.ClickBack()
      cy.url().should('eq', 'https://panel-cto.s256.dev/form-fields/list')

      cy.get('.form-actions__btn > :nth-child(1) > span').should('text', 'Создать поле').click() // Создаем поле типа файл
      cy.url().should('eq', 'https://panel-cto.s256.dev/form-fields/create')
      cy.get(
        ':nth-child(1) > .form-fields-create__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).type('Поле тест файл')
      cy.get('.ivu-select-placeholder').click()
      cy.get(':nth-child(2) > .ivu-card-body > .form-fields-create__title').should('not.be.visible')
      cy.get('.ivu-select-dropdown-list > :nth-child(9)')
        .should('text', 'Файл')
        .click({ force: true })
      cy.wait(3000)
      cy.get(
        ':nth-child(3) > .form-fields-create__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).type('Подсказка поля файл')
      cy.get(
        ':nth-child(4) > .form-fields-create__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).type('Заполнитель поля файл')
      cy.get('.ivu-select-input').click().type('tag test file1 ')
      cy.wait(2000)
      cy.get(
        ':nth-child(5) > .form-fields-create__item > .ivu-form-item-content > .ivu-select > .ivu-select-dropdown > .ivu-select-dropdown-list'
      )
        .contains('tag test file1 ')
        .click({ force: true })
      cy.wait(2000)
      cy.get('.ivu-checkbox-input').click('center')
      cy.wait(1000)
      cy.get('[type="checkbox"]').check()
      cy.wait(2000)
      cy.get(':nth-child(2) > .form-fields-create-actions__btn > span')
        .should('text', 'Сохранить')
        .click() // нажимаем Сохранить
      cy.get('.ivu-message-custom-content > span').should('text', 'Поле успешно создано')
      cy.wait(2000)
      // cy.url().should('eq','https://panel-cto.s256.dev/form-fields/list') //раскомментировать как починят баг!!!!!!
      cy.get('.ivu-menu-submenu > .ivu-menu > :nth-child(2) > span')
        .should('text', 'Поля для форм')
        .click()
      cy.get('.table-pagination__info').should('text', 'Всего ' + (n + 9) + ' записей') // здесь проверяем счетчик после нажатия Сохранить
      // проверяем созданное поле
      cy.get('.ivu-select-input').click()
      cy.wait(2000)
      cy.get('.ivu-select-dropdown-list > :nth-child(9)').contains('Файл').click()
      cy.wait(2000)
      cy.get(':nth-child(2) > .table-filter__item > .search-input > .ivu-input').type(
        'Поле тест файл{enter}'
      )
      cy.get(
        ':nth-child(1) > :nth-child(5) > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-dropdown-rel > a > .ivu-icon'
      ).click()
      cy.get(
        ':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > .ivu-dropdown-item > div'
      )
        .first()
        .should('contain', 'Редактировать')
        .click({ force: true })
      cy.url().should('include', 'https://panel-cto.s256.dev/form-fields/edit')
      cy.get(
        ':nth-child(1) > .form-fields-create__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'Поле тест файл')
      cy.get('.ivu-select-selected-value').contains('Файл')
      cy.get(
        ':nth-child(3) > .form-fields-create__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'Подсказка поля файл')
      cy.get(
        ':nth-child(4) > .form-fields-create__item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
      ).should('have.value', 'Заполнитель поля файл')
      cy.wait(2000)
      cy.get('.ivu-select-input').should('have.value', 'tag test file1 ')
      cy.wait(2000)
      cy.get('[type="checkbox"]').should('be.checked')
      cy.ClickBack()
      cy.url().should('eq', 'https://panel-cto.s256.dev/form-fields/list')

      // чередуем разное создание полей: 1)только обязательные поля, 2)только обяз-ные+подсказка (не забыть потом проверить редактирование этой подсказки в кастомизации формы),
      // 3)только обяз-ные +заполнитель, 4)обяз-ные+и подсказку и заполнитель
    })
  })

  // создаем формы регистрации и материалов: добавляем поля через конструктор после создания формы - регистрации, а форму материалов создаем сразу с конструктором полей
  it('Form check', function () {
    cy.get('.ivu-menu-opened > .ivu-menu > :nth-child(1) > span')
      .should('text', 'Формы сбора данных')
      .click()
    cy.url().should('include', 'https://panel-cto.s256.dev/forms/list')
    cy.get('.ivu-divider-inner-text').should('text', 'Формы сбора данных')
    cy.get('.ivu-radio-wrapper-checked > .ivu-radio > .ivu-radio-input')
    cy.get('.ivu-radio-wrapper-checked > :nth-child(2)').should('text', 'Все')
    cy.get(':nth-child(2) > .ivu-radio > .ivu-radio-input')
    cy.get('.search-input > :nth-child(2) > :nth-child(2)').should('text', 'Формы регистрации')
    cy.get(':nth-child(3) > .ivu-radio > .ivu-radio-input')
    cy.get('.search-input > :nth-child(3) > :nth-child(2)').should('text', 'Формы материалов')
    cy.get('.ivu-input').should('have.attr', 'placeholder', 'Введите название формы')
    cy.get('.ivu-table-cell-sort').should('text', 'ID')
    cy.get('.ivu-icon-md-arrow-dropup')
    cy.get('.ivu-icon-md-arrow-dropdown')
    cy.get('thead > tr > :nth-child(2) > .ivu-table-cell > span').should('text', 'Название формы')
    cy.get('thead > tr > :nth-child(3) > .ivu-table-cell > span').should('text', 'Активность')
    cy.get(':nth-child(4) > .ivu-table-cell > span')
    cy.get('.form-actions__btn > :nth-child(1) > .ivu-icon')
    cy.wait(2000)
    cy.get('.ivu-table-row').then(($row) => {
      // const n = $row.length;
      const n = 26 // закомментировать потом
      cy.get('.table-pagination__info').should('text', 'Всего ' + n + ' записей')
      cy.get('.form-actions__btn > :nth-child(1) > span').should('text', 'Создать форму').click()
      cy.url().should('include', 'https://panel-cto.s256.dev/forms/create')
      cy.get('.ivu-divider-inner-text > span').should('text', 'Создание формы')
      cy.ClickBack()
      cy.url().should('include', 'https://panel-cto.s256.dev/forms/list')
      cy.get('.table-pagination__info').should('text', 'Всего ' + n + ' записей')
      cy.get('.form-actions__btn > :nth-child(1) > span').should('text', 'Создать форму').click()
      cy.url().should('include', 'https://panel-cto.s256.dev/forms/create')
      cy.get('.ivu-divider-inner-text > span').should('text', 'Создание формы')
      cy.get('.form-data__title').should('text', 'Организационная информация')
      cy.get(':nth-child(1) > .form-data__item > .ivu-form-item-label').should('text', 'Название')
      cy.get('.ivu-form-item-content > .ivu-input-wrapper > .ivu-input')
        .should('have.attr', 'placeholder', 'Имя в системе')
        .type('Форма регистрации тест')
      cy.get(':nth-child(2) > .form-data__item > .ivu-form-item-label').should('text', 'Тип формы')
      cy.get('.ivu-select-placeholder').should('text', 'Выберите тип')
      cy.get('.ivu-select-selection > div > .ivu-icon').click()
      cy.get('.ivu-select-dropdown-list > :nth-child(1)')
        .should('text', 'Форма регистрации')
        .click({ force: true })
      cy.get('.ivu-checkbox-input').should('be.checked')
      cy.get('.ivu-col-span-lg-3 > .form-data__item > .ivu-form-item-label').should(
        'text',
        'Активность'
      )
      cy.get(':nth-child(1) > .form-data-actions__btn > span').should('text', 'Применить')
      cy.get(':nth-child(2) > .form-data-actions__btn > span').should('text', 'Сохранить')
      cy.get('.ivu-col-span-10 > .ivu-card > .ivu-card-body > h3').should(
        'text',
        'Панель конструктора'
      )
      cy.get('.ivu-col-span-14 > .ivu-card > .ivu-card-body > h3').should('text', 'Конструктор')
      cy.ClickBack()
      cy.url().should('include', 'https://panel-cto.s256.dev/forms/list')
      cy.get('.table-pagination__info').should('text', 'Всего ' + n + ' записей')
      cy.get('.form-actions__btn > :nth-child(1)').click()
      cy.url().should('include', 'https://panel-cto.s256.dev/forms/create')
      cy.get('.ivu-form-item-content > .ivu-input-wrapper > .ivu-input').type(
        'Форма регистрации тест'
      )
      cy.get('.ivu-select-selection > div > .ivu-icon').click()
      cy.get('.ivu-select-dropdown-list > :nth-child(1)')
        .should('text', 'Форма регистрации')
        .click({ force: true })
      cy.get('.ivu-checkbox-input').should('be.checked')
      cy.get('.ivu-col-span-10 > .ivu-card > .ivu-card-body > h3').should(
        'text',
        'Панель конструктора'
      )
      cy.get('.ivu-col-span-14 > .ivu-card > .ivu-card-body > h3').should('text', 'Конструктор')
      cy.get(':nth-child(1) > .form-data-actions__btn').click()
      cy.get('.ivu-message-custom-content > span').should('text', 'Форма успешно создана!')
      cy.wait(2000)
      cy.url().should('include', 'https://panel-cto.s256.dev/forms/edit')
      cy.get('[style="margin-top: 20px;"] > .ivu-btn > span').should('have.text', 'Удалить форму') // появляется кнопка удаления формы
      cy.ClickBack()
      cy.get('.ivu-table-tbody > :nth-child(1) > :nth-child(2) > .ivu-table-cell > span').should(
        'text',
        'Форма регистрации тест'
      )
      cy.get(
        ':nth-child(1) > :nth-child(3) > .ivu-table-cell > .ivu-badge-status > .ivu-badge-status-text'
      ).should('text', 'Активен')
      cy.get(
        ':nth-child(1) > :nth-child(4) > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-dropdown-rel > a > .ivu-icon'
      ).click()
      cy.get(
        ':nth-child(1) > :nth-child(4) > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > .ivu-dropdown-item > div'
      )
        .contains('Редактировать')
        .click({ force: true })
      cy.get('.ivu-form-item-content > .ivu-input-wrapper > .ivu-input').should(
        'have.value',
        'Форма регистрации тест'
      )
      cy.get('.ivu-select-selected-value').should('text', 'Форма регистрации')
      cy.get('.ivu-col-span-10 > .ivu-card > .ivu-card-body > h3').should(
        'text',
        'Панель конструктора'
      )
      cy.get('.ivu-col-span-14 > .ivu-card > .ivu-card-body > h3').should('text', 'Конструктор')
      cy.get(':nth-child(2) > .form-constructor-action__title').should(
        'text',
        'Добавление визуального контейнера'
      )
      cy.get(':nth-child(3) > .form-constructor-action__title').should('text', 'Поля')
      cy.get('.form-constructor-action__item > .ivu-input-wrapper > .ivu-input')
        .should('have.attr', 'placeholder', 'Введите название контейнера')
        .type('Контейнер1 тест формы регистрации')
      cy.get('.form-constructor-action__btn > .ivu-btn > span').should('text', 'Добавить').click()
      cy.get(':nth-child(3) > .form-constructor-action__title').should('text', 'Поля')
      cy.get('.field-selector__search > .ivu-input-wrapper > .ivu-input').should(
        'have.attr',
        'placeholder',
        'Введите название поля для поиска'
      )

      // добавляем поля через поиск и обычным перетаскиванием
      /* describe('Trying to implement drag-n-drop', () => {

                before(() => {
                    //Cypress.config('baseUrl', null);

                    cy.viewport(1000, 600);
                    cy.wait(2000)
                   /* cy.visit('https://angular-oxkc7l-zirwfs.stackblitz.io')
                    .url().should('contain', 'angular')
                    .get('h2').should('contain', 'To do'); */
      // });
      /* cy.get(':nth-child(1) > :nth-child(4) > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-dropdown-rel > a > .ivu-icon').click()
            cy.get(':nth-child(1) > :nth-child(4) > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > .ivu-dropdown-item > div')
                .contains('Редактировать').click({force:true}) */
      /* it('works (simply)', () => {
                    const draggable = Cypress.$('.smooth-dnd-container vertical > :nth-child(1)')[0]  // Pick up this
                    const droppable = Cypress.$('.ivu-col-span-14 > .ivu-card > .ivu-card-body > h3')[0]  // Drop over this

                    const coords = droppable.getBoundingClientRect()
                    draggable.dispatchEvent(new MouseEvent('mousedown'));
                    draggable.dispatchEvent(new MouseEvent('mousemove', {clientX: 10, clientY: 0}));
                    cy.wait(3000)
                    draggable.dispatchEvent(new MouseEvent('mousemove', {
                      clientX: coords.x+10,
                      clientY: coords.y+10  // A few extra pixels to get the ordering right
                    }));
                    draggable.dispatchEvent(new MouseEvent('mouseover'));
                    draggable.dispatchEvent(new MouseEvent('mouseup'));

                    /*cy.get('#cdk-drop-list-1').should('contain', 'Get to work');
                    cy.get('#cdk-drop-list-1 > .cdk-drag').eq(3).should('contain', 'Get to work');

                  });

        }) */

      // describe('Dragtest', () => {

      // });

      /* it('should dragndrop', () => {
        //cy.visit('/yourpage');
        cy.get('.form-constructor-action__item > .ivu-input-wrapper > .ivu-input').type('1')
        cy.get('.form-constructor-action__btn > .ivu-btn').click()
        cy.wait(3000)

        cy.get(':nth-child(1) > .field-selector-body__card')
        cy.wait(3000)
        //cy.get(':nth-child(1) > .field-selector-body__card').drag('.main-constructor-place > .smooth-dnd-container','bottomRight');
        //cy.get(':nth-child(1) > .field-selector-body__card').drag('.ivu-col-span-14 > .ivu-card > .ivu-card-body','center');
        cy.get(':nth-child(1) > .smooth-dnd-draggable-wrapper').drag('.smooth-dnd-container','top','{ waitForAnimations: true }');
        cy.wait('.smooth-dnd-draggable-wrapper')
        //cy.get(':nth-child(1) > .field-selector-body__card').drag('.main-constructor-place > .smooth-dnd-container','center');
    }) */

      /*
cy.get('.form-constructor-action__item > .ivu-input-wrapper > .ivu-input').should('have.attr','placeholder','Введите название контейнера').type('Контейнер1 тест формы регистрации')
            cy.get('.form-constructor-action__btn > .ivu-btn > span').should('text','Добавить').click()

    cy.get(":nth-child(1) > .field-selector-body__card")
      .trigger("mousedown",{ which: 1 })
      //cy.wait(2000)
    //cy.get('.smooth-dnd-draggable-wrapper').as('field')
    //cy.get('.ivu-col-span-14 > .ivu-card > .ivu-card-body')
    //cy.get('.main-constructor-group > .ivu-divider > .ivu-divider-inner-text')
    //cy.get('.main-constructor-group > .ivu-row-flex')
    //cy.get('main-constructor-group__fields')
    cy.get(".main-constructor-place")
      .trigger("mousemove")
      .trigger("mouseover","top")
      .trigger("mouseover","center")
      .trigger("mouseover","bottom")
      .trigger("mouseover","center")
      //.wait('@field')
      .trigger("mouseup","center").click({ waitForAnimations: false })
      }); */

      // проверяем, что добавленный контейнер отображается в констукторе
      cy.get('.ivu-col-span-14 > .ivu-card > .ivu-card-body > h3').should(
        'have.text',
        'Конструктор'
      )
      cy.get('.ivu-row-flex > :nth-child(1) > .ivu-icon')
      cy.get('.main-constructor-group > .ivu-divider > .ivu-divider-inner-text > span').should(
        'have.text',
        'Контейнер1 тест формы регистрации'
      )
      cy.get('.ivu-icon-ios-create-outline').click()
      cy.get('.ivu-divider-inner-text > .ivu-input-wrapper > .ivu-input').type('1{enter}')
      cy.get('.main-constructor-group > .ivu-divider > .ivu-divider-inner-text > span').should(
        'have.text',
        'Контейнер1 тест формы регистрации1'
      )
      // удаляем контейнер из конструктора
      cy.get('.ivu-icon-ios-close').click()
      cy.get('.main-constructor-group > .ivu-divider > .ivu-divider-inner-text > span').should(
        'not.be.visible'
      )

      // удаляем форму
      cy.get('[style="margin-top: 20px;"] > .ivu-btn > span')
        .should('have.text', 'Удалить форму')
        .click()
      cy.get('.ivu-modal-confirm-head-icon > .ivu-icon')
      cy.get('.ivu-modal-confirm-head-title').should('have.text', 'Удаление формы')
      cy.get('p').should('contain', 'Вы уверены что хотите удалить форму')
      cy.get('.ivu-btn-text > span').should('have.text', 'Отменить')
      cy.get('.ivu-modal-confirm-footer > .ivu-btn-primary > span')
        .should('have.text', 'Удалить')
        .click()
    })
  })
})
