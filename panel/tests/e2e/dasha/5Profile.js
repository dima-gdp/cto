// import { watchFile } from "fs";

// https://docs.cypress.io/api/introduction/api.html

// <script src="jquery.js"></script>
// <script src="chai.js"></script>
// <script src="chai-jquery.js"></script>
/* {chromeWebSecurity: false}
beforeEach(function () {
  Cypress.Cookies.preserveOnce('s256.ru', 'remember_token')
  }) */

/* before(function () {
  cy.login('daria.studio256@gmail.com','qwerty')

}) */
/* beforeEach(
  "Login to web Portal and Navigate to some Page",
  function() {
    cy.server();
    cy.loginToPortal('daria.studio256@gmail.com','qwerty').then((response) => {
      cy.deleteTestCompanies(this.bearerToken);
      //cy.setTokens({ token: this.bearerToken });
    });
    //cy.visit("/stateprofile");
    cy.visit('http://public.cto.s256.ru/user-profile/shop')
  }
); */

describe('User profile', function () {
  it('registration', function () {
    cy.visit('http://public.cto.s256.ru')
    cy.url().should('eq', 'http://public.cto.s256.ru/login')
    cy.viewport(1912, 776)

    cy.get('.el-alert__title').should('text', 'Регистрация на мероприятие закончится ')
    // cy.get('.date-text').should('text','15 окт. 2019 г.')      //затем исправить на свои
    cy.get('.h5').should('text', 'Войти или зарегистрироваться')
    cy.get('.login__logo')
    cy.get(':nth-child(1) > .el-form-item__content > .input > .input__label').should(
      'contain',
      'Введите Email'
    )
    cy.get('.el-button > span').should('text', 'Далее')
    cy.get('.el-button').should('have.attr', 'disabled').and('eq', 'disabled')
    cy.get('.company-info__phone') // затем добавить свои данные (добавить их в тест Events):
    cy.get('.company-info__phone-subtext')
    cy.get('.company-info__phone-text')
    cy.get('.company-info__lang > .el-select > .el-input > .el-input__inner').should(
      'have.value',
      'ru'
    )
    cy.get(
      '.company-info__lang > .el-select > .el-input > .el-input__suffix > .el-input__suffix-inner > .el-select__caret'
    )
    cy.get('.company-info__email') // затем добавить свои данные (добавить их в тест Events)

    cy.get(':nth-child(1) > .el-form-item__content > .input > .input__label').click()
    cy.get('#login').type('daria.test9@gmail.com')
    cy.request(
      'GET',
      'http://apicto.s256.ru/api/v1/user/exist?email=daria.studio256+243253454@gmail.com&lang=ru'
    ) //, {headers: {Authorization: ` `}})
    cy.get('.el-button').click()
    cy.url().should('eq', 'http://public.cto.s256.ru/sign-up')
    cy.get('.link-back__item > svg ')
    cy.get('.link-back__item > span').should('text', 'К авторизации')
    cy.get('.h3').should('text', 'Регистрация на мероприятие')
    // Проверяем обязательность полей (как минимум полей для пароля) - нажимаем "Зарегистрироваться" и проверяем ошибки под полями
    cy.get('#signUpButton > span').should('text', 'Зарегистрироваться').click()
    cy.get('.el-message__content').should('text', 'Пожалуйста, заполните все обязательные поля!')
    cy.get(':nth-child(2) > .el-form-item__content > .el-form-item__error').should(
      'text',
      '\n          Пожалуйста, заполните обязательное поле\n        '
    )
    cy.get(':nth-child(3) > .el-form-item__content > .el-form-item__error').should(
      'text',
      '\n          Пожалуйста, заполните обязательное поле\n        '
    )

    cy.get(':nth-child(1) > legend').should('text', 'Данные профиля')
    // cy.get(':nth-child(1) > .block-typical > :nth-child(1) > .el-form-item__content > .col-lg-12 > .input > .input__label').should('text','Email *')
    cy.get('#email-email1').should('have.attr', 'input', 'daria.test9@gmail.com')
    cy.get(
      ':nth-child(1) > .block-typical > :nth-child(2) > .el-form-item__content > .col-lg-12 > .input > .input__label'
    ).should('have.attr', 'for', 'password-password1')
    cy.get('#password-password1').type('qwerty')
    cy.get(
      ':nth-child(1) > .block-typical > :nth-child(3) > .el-form-item__content > .col-lg-12 > .input > .input__label'
    ).should('have.attr', 'for', 'confirmPassword-confirmPassword1')
    cy.get('#confirmPassword-confirmPassword1').type('qwerty', { force: true })
    // заполняем поля для регистрации - в будущем надо создать отдельную форму и поменять эти поля
    cy.get(
      ':nth-child(2) > .block-typical > :nth-child(2) > .el-form-item__content > .col-lg-12 > .input > .input__label'
    ).should('text', 'Специальность')
    cy.get(
      ':nth-child(2) > .el-form-item__content > .col-lg-12 > .input > .el-select > .el-input > .el-input__suffix > .el-input__suffix-inner > .el-select__caret'
    ).click()
    // cy.get('[style="min-width: 343px; position: absolute; top: 671px; left: 523px; transform-origin: center top; z-index: 2003;"] > .el-scrollbar > .el-select-dropdown__wrap > .el-scrollbar__view > :nth-child(2) > span').click()
    cy.get('li > span').contains('Акушерство и гинекология').click()
    cy.get(
      ':nth-child(3) > .block-typical > :nth-child(2) > .el-form-item__content > .col-lg-12 > .input > .input__label'
    ).should('text', 'Фамилия')
    cy.get('#last_name-39').type('Test1')
    cy.get(
      ':nth-child(3) > .block-typical > :nth-child(1) > .el-form-item__content > .col-lg-12 > .input > .input__label'
    ).should('text', 'Имя')
    cy.get('#first_name-40').type('Test2')
    cy.get('#signUpButton').click()
    // cy.get('form').submit()
    cy.get('.el-message__content').should('text', 'Успешная регистрация!')
    cy.get('.info-block__icon')
    cy.get('.info-block__heading').should('text', 'Вы успешно зарегистрировались!')
    cy.get('.info-block__text').should(
      'text',
      'Перейдите по ссылке, отправленной на daria.test9@gmail.com, чтобы подтвердить email.'
    )
    cy.get('.el-button').should('text', 'В личный кабинет')
    cy.get('.el-button > svg')
    cy.get('.el-button').click()
    cy.url().should('eq', 'http://public.cto.s256.ru/user-profile/shop')
    cy.get('.menu-block__user')
    cy.get('.main-header__user').should('text', 'Test1 Test2Выйти')
    // cy.get('.main-header__user > .el-button > span').should('text','Выйти')
    cy.get('.menu-block__event-info')
    cy.get('.menu-block__date').should(
      'text',
      '\n                  1 сент. 2019 г. -\n                  29 дек. 2019 г.\n                '
    )
    cy.get('.menu-block__event-name').should(
      'text',
      'XXXXVIIXXXXVII Конгресс Российского общества урологов '
    )
    cy.get('.router-link-exact-active > .menu-block__links-item').should('text', 'Магазин')
    cy.get('[href="/user-profile/orders"] > .menu-block__links-item').should('text', 'Мои заказы')
    cy.get('[href="/user-profile/account"] > .menu-block__links-item').should('text', 'Профиль')
    cy.get('.company-info__phone').should('text', '8(800)855-85-85')
    cy.get('.company-info__phone-subtext').should('text', '( доб. 119 )')
    cy.get('.company-info__phone-block').should(
      'text',
      '8(800)855-85-85( доб. 119 )телефон горячей линии'
    )
    cy.get('.company-info__lang > .el-select > .el-input > .el-input__inner') // .should('text','RU')
    cy.get('.el-select__caret el-input__icon el-icon-arrow-up')
    cy.get('.main-header__heading').should('text', 'Магазин')
    cy.get('.store-tab > .el-alert > .el-alert__content > .el-alert__title').should(
      'text',
      'Продажа закончится'
    )
    cy.get('.date-text').should('text', '25 янв. 2020 г.') // поставить свою дату на проверку
    cy.get('.store-tab__description > p').should('text', 'testtest ммм') // проверить свое описание магазина
    cy.get(
      ':nth-child(1) > .block-typical > .store-tab__text-wrapper > .store-tab__product-heading'
    ).should('text', '222') // проверить название продукта
    cy.get(
      ':nth-child(1) > .block-typical > .store-tab__text-wrapper > .store-tab__product-description'
    ).should('text', '222 описание') // проверить описание продукта
    cy.get(
      ':nth-child(1) > .block-typical > .store-tab__action-wrapper > .store-tab__price'
    ).should('text', '2 ₽') // проверить цену продукта
    cy.get(
      ':nth-child(1) > .block-typical > .store-tab__action-wrapper > .el-button > span'
    ).should('text', 'Купить')
    cy.get(
      ':nth-child(2) > .block-typical > .store-tab__text-wrapper > .store-tab__product-heading'
    ).should('text', '333')
    cy.get(
      ':nth-child(2) > .block-typical > .store-tab__text-wrapper > .store-tab__product-description'
    ).should('text', '333 описание')
    cy.get(
      ':nth-child(2) > .block-typical > .store-tab__action-wrapper > .store-tab__price'
    ).should('text', '3 ₽')
    cy.get(
      ':nth-child(2) > .block-typical > .store-tab__action-wrapper > .el-button > span'
    ).should('text', 'Купить')
    cy.get(
      ':nth-child(3) > .block-typical > .store-tab__text-wrapper > .store-tab__product-heading'
    ).should('text', '111')
    cy.get(
      ':nth-child(3) > .block-typical > .store-tab__text-wrapper > .store-tab__product-description'
    ).should('text', '111 описание')
    cy.get(
      ':nth-child(3) > .block-typical > .store-tab__action-wrapper > .store-tab__price'
    ).should('text', '1 ₽')
    cy.get(
      ':nth-child(3) > .block-typical > .store-tab__action-wrapper > .el-button > span'
    ).should('text', 'Купить')
    cy.get('.button__block > .el-button > span').should('text', 'Оформить заказ')
  })
})
