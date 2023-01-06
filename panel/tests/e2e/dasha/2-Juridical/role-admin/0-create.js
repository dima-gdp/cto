describe('Juridical list', function () {
  before(function () {
    cy.login(Cypress.env('userName'), Cypress.env('userPassword'))
  })

  it('create juridical identity', function () {
    cy.visit('/juridical/create')
    cy.main()
    cy.get('body').contains('Юр. лица').click()
    cy.juridical() // грид юр лиц
    cy.get('.ivu-card-body__btn-create').click() // создать ЮЛ. Далее  проверяем 2 раза кнокпку Назад (при незаполненных и заполненных данных)

    cy.get('.ivu-divider-inner-text > span').should('text', 'Создание юр. лица')
    cy.ClickBack()
    cy.get('.table-pagination__info').contains('Всего 8 записей') // на реальных тестах поставить ноль
    cy.juridical()
    cy.get('.ivu-card-body__btn-create').click()
    cy.main()
    cy.wait(1000)
    cy.CreateJuridical()
    cy.ClickBack()
    cy.get('.table-pagination__info').contains('Всего 8 записей')
    cy.juridical()
    cy.get('.ivu-card-body__btn-create').click()
    cy.CreateJuridical()
    cy.get('.ivu-btn-primary > span').should('text', 'Сохранить').click() // проверяю кнопку Сохранить, затем удалю это юр лицо и создам новое только через кнопку Применить
    cy.get('.ivu-message-custom-content > span').should('text', 'Юр. лицо успешно создано')
    cy.get('.table-pagination__info').contains('Всего 9 записей') // в реальных тестах поменять на 1
    cy.get('.ivu-table-tbody > :nth-child(1) > :nth-child(2) > .ivu-table-cell > span').should(
      'text',
      'test'
    )
    cy.juridical()
    cy.DeleteJuridical() // удаляю юр лицо
    cy.get('.table-pagination__info').contains('Всего 8 записей')
    // снова создаю юр лицо, только теперь через кнопку Применить (далее будут второе нажатие Применить и Назад)
    cy.get('.ivu-card-body__btn-create > span').click()
    cy.main()
    cy.wait(1000)
    cy.CreateJuridical()
    cy.get('.juridical-payments').should('not.be.visible') // блок с Провайдерами невидим до нажатия Применить
    cy.get('.juridical-detail__btn-block > .ivu-btn-default > span')
      .should('text', 'Применить')
      .click() // "Применить" нажимаю первый раз - создаю юр лицо
    cy.get('.ivu-message-custom-content > span').should('text', 'Юр. лицо успешно создано')
    cy.wait(5000)
    cy.get('.juridical-payments') // появился блок с провайдерами, нет пока ни одного:
    cy.get('.juridical-payments > .ivu-row > .ivu-col > .ivu-card > .ivu-card-head > p > span')
      .first()
      .should('text', 'Добавить провайдера')
    cy.get(':nth-child(2) > .ivu-card > .ivu-card-head > p > span').should('not.be.visible')
    cy.main()
    cy.CheckJuridical()
    cy.get('.juridical-detail__btn-block > .ivu-btn-default > span')
      .should('text', 'Применить')
      .click() // применить - второй раз(ничего не поменялось), затем "Назад"
    cy.get('.ivu-message-custom-content > span').should('text', 'Юр. лицо успешно сохранено')
    cy.CheckJuridical()
    cy.get('.juridical-payments > .ivu-row > .ivu-col > .ivu-card > .ivu-card-head > p > span')
      .first()
      .should('text', 'Добавить провайдера')
    cy.get(':nth-child(2) > .ivu-card > .ivu-card-head > p > span').should('not.be.visible')
    cy.ClickBack()
    cy.juridical()
    cy.get('.table-pagination__info').contains('Всего 9 записей') // в реальных тестах поменять на 1
    cy.DeleteJuridical() // удаляю юр лицо
    cy.get('.table-pagination__info').contains('Всего 8 записей')
    // снова создаю юр лицо, только теперь через кнопку Применить->Сохранить->Добавить провайдера(сначала Назад 2 раза)->Удалить юр лицо
    cy.get('.ivu-card-body__btn-create > span').click()
    cy.main()
    cy.wait(1000)
    cy.CreateJuridical()
    cy.get('.juridical-payments').should('not.be.visible') // блок с Провайдерами невидим до нажатия Применить
    cy.get('.juridical-detail__btn-block > .ivu-btn-default > span')
      .should('text', 'Применить')
      .click() // "Применить" нажимаю первый раз - создаю юр лицо
    cy.get('.ivu-message-custom-content > span').should('text', 'Юр. лицо успешно создано')
    cy.wait(11000)
    cy.get('.juridical-payments') // появился блок с провайдерами, нет пока ни одного:
    cy.get('.juridical-payments > .ivu-row > .ivu-col > .ivu-card > .ivu-card-head > p > span')
      .first()
      .should('text', 'Добавить провайдера')
    cy.get(':nth-child(2) > .ivu-card > .ivu-card-head > p > span').should('not.be.visible')
    cy.main()
    cy.CheckJuridical()
    cy.get('.juridical-detail__btn-block > .ivu-btn-primary > span')
      .should('text', 'Сохранить')
      .click() // нажимаю Сохранить
    cy.juridical()
    cy.get('.table-pagination__info').contains('Всего 9 записей')
    cy.get('.ivu-table-tbody > :nth-child(1) > :nth-child(2) > .ivu-table-cell > span').should(
      'text',
      'test'
    )
    cy.get('.ivu-table-tbody > :nth-child(1) > .ivu-table-column-center').click({ force: true })
    cy.get(
      ':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > [style="padding: 0px;"] > div'
    )
      .contains('Редактирование')
      .click({ force: true }) // откываем на редактирование и проверяем созжанное юр лицо = cy.contains('Редактирование').should('text','\n                      Редактирование\n                    ').click({force: true}
    cy.CheckJuridical()
    cy.get('.juridical-payments > .ivu-row > .ivu-col > .ivu-card > .ivu-card-head > p > span')
      .first()
      .should('text', 'Добавить провайдера')
    cy.get(':nth-child(2) > .ivu-card > .ivu-card-head > p > span').should('not.be.visible')
    cy.get('.ivu-card-body > .ivu-btn').click({ force: true }) // кликаю "добавить провайдера"->шагаю Назад->снова добавляю (уже с заполнением полей) - и снова Назад
    cy.wait(8000)
    cy.url().should('contain', 'https://panel-cto.s256.dev/juridical/provider-create')
    cy.main()
    cy.get('.ivu-divider-inner-text > span').should('text', 'Создать провайдера оплаты')
    cy.get('.ivu-btn ivu-btn-error ivu-btn-long ivu-btn-ghost').should('not.be.visible') // кнопки "Удалить" пока нет, т к это создание(а не редактирование)
    cy.btnBack()
    cy.ClickBack()
    cy.CheckJuridical()
    cy.get('.juridical-payments > .ivu-row > .ivu-col > .ivu-card > .ivu-card-head > p > span')
      .first()
      .should('text', 'Добавить провайдера')
    cy.get(':nth-child(2) > .ivu-card > .ivu-card-head > p > span').should('not.be.visible')
    cy.get('.ivu-card-body > .ivu-btn').click({ force: true }) // кликаю снова "добавить провайдера"->заполняю поля - шагаю Назад->проверяю
    cy.CreateProviderYandex()
    cy.get('.ivu-btn ivu-btn-error ivu-btn-long ivu-btn-ghost').should('not.be.visible')
    cy.ClickBack()
    cy.CheckJuridical()
    cy.get('.juridical-payments > .ivu-row > .ivu-col > .ivu-card > .ivu-card-head > p > span')
      .first()
      .should('text', 'Добавить провайдера')
    cy.get(':nth-child(2) > .ivu-card > .ivu-card-head > p > span').should('not.be.visible')
    cy.get('body').contains('Юр. лица').click()
    cy.DeleteJuridical() // удаляю юр лицо
    cy.get('.table-pagination__info').contains('Всего 8 записей')
    // снова создаю юр лицо - Применить-Добавить провайдера-Сохранить
    cy.get('.ivu-card-body__btn-create > span').click()
    cy.main()
    cy.wait(1000)
    cy.CreateJuridical()
    cy.get('.juridical-payments').should('not.be.visible') // блок с Провайдерами невидим до нажатия Применить
    cy.get('.juridical-detail__btn-block > .ivu-btn-default > span')
      .should('text', 'Применить')
      .click() // "Применить" нажимаю первый раз - создаю юр лицо
    cy.get('.ivu-message-custom-content > span').should('text', 'Юр. лицо успешно создано')
    cy.wait(3000)
    cy.get('.juridical-payments') // появился блок с провайдерами, нет пока ни одного:
    cy.get('.juridical-payments > .ivu-row > .ivu-col > .ivu-card > .ivu-card-head > p > span')
      .first()
      .should('text', 'Добавить провайдера')
    cy.get(':nth-child(2) > .ivu-card > .ivu-card-head > p > span').should('not.be.visible')
    cy.get('.ivu-card-body > .ivu-btn').click({ force: true }) // кликаю "добавить провайдера"
    cy.CreateProviderYandex()
    cy.get('.ivu-btn ivu-btn-error ivu-btn-long ivu-btn-ghost').should('not.be.visible')
    cy.get('.ivu-btn-primary').should('text', '  Сохранить').click() // кликаю Сохранить - перекидывает в редактирование юр лица
    cy.url().should('contain', 'https://panel-cto.s256.dev/juridical/edit')
    cy.ClickBack()
    cy.wait(2000)
    cy.juridical()
    cy.get('.table-pagination__info').contains('Всего 9 записей') // проверяю в гриде юр лицо:
    cy.get('.ivu-table-tbody > :nth-child(1) > :nth-child(1) > .ivu-table-cell > span') // есть id-к
    cy.get('.ivu-table-tbody > :nth-child(1) > :nth-child(2) > .ivu-table-cell > span').should(
      'text',
      'test'
    )
    cy.get(
      ':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > [style="padding: 0px;"] > div'
    )
      .contains('Редактирование')
      .click({ force: true }) // откываем на редактирование и проверяем созданное юр лицо и провайдера, затем удаляем провайдера+проверяем
    cy.CheckJuridicalWithProvider()
    cy.get(':nth-child(1) > .ivu-card > .ivu-card-body > .ivu-btn > span')
      .should('text', 'Редактировать')
      .click({ force: true }) // проверяем провайдера:
    cy.wait(3000)
    cy.url().should('contain', 'https://panel-cto.s256.dev/juridical/provider-edit')
    cy.main()
    cy.CheckProviderYandex()
    cy.get('.ivu-btn-error > span').should('text', 'Удалить').click()
    cy.get('.ivu-modal-confirm-head-title').should('text', 'Удаление')
    cy.get('.ivu-modal-confirm-body > div > :nth-child(1)').should(
      'text',
      'Вы уверены что хотите удалить Провайдера ?'
    )
    cy.get('.ivu-modal-confirm-body > div > :nth-child(2)').should(
      'text',
      'Это действие необратимо!'
    )
    cy.get('.ivu-modal-confirm-footer > .ivu-btn-primary > span').should('text', 'OK')
    cy.get('.ivu-btn-text > span').should('text', 'Отменить').click({ force: true }) // проверяем кнопку отменить в Удалении Провайдера: нажали и снова проверяем Провайдера(что не удалился)
    cy.CheckProviderYandex()
    cy.get('.ivu-btn-error > span').should('text', 'Удалить').click({ force: true })
    cy.get('.ivu-modal-confirm-footer > .ivu-btn-primary > span')
      .should('text', 'OK')
      .click({ force: true }) // удаляем провайдера - проверяем(что удалился)
    cy.get('.ivu-message-custom-content > span').should('text', 'Провайдер успешно удален')
    cy.CheckJuridical()
    cy.ClickBack()
    cy.juridical()
    cy.get('.table-pagination__info').contains('Всего 9 записей') // в реальных тестах поменять на 1
    cy.wait(11000)
    cy.DeleteJuridical() // удаляю юр лицо
    // Аналогичный блок действий
    cy.get('.ivu-card-body__btn-create > span').click() // снова создаю юр лицо - Применить-Добавить провайдера-Применить
    //
    cy.CreateJuridical()
    cy.get('.juridical-payments').should('not.be.visible') // блок с Провайдерами невидим до нажатия Применить
    cy.get('.juridical-detail__btn-block > .ivu-btn-default > span')
      .should('text', 'Применить')
      .click() // "Применить" нажимаю первый раз - создаю юр лицо
    cy.get('.ivu-message-custom-content > span').should('text', 'Юр. лицо успешно создано')
    cy.CheckJuridical()
    cy.get('.juridical-payments') // появился блок с провайдерами, нет пока ни одного:
    cy.get('.juridical-payments > .ivu-row > .ivu-col > .ivu-card > .ivu-card-head > p > span')
      .first()
      .should('text', 'Добавить провайдера')
    cy.get(':nth-child(2) > .ivu-card > .ivu-card-head > p > span').should('not.be.visible')
    cy.wait(4000)
    cy.get('.ivu-card-body > .ivu-btn').click({ force: true }) // кликаю "добавить провайдера"
    cy.CreateProviderYandex()
    cy.get('.ivu-btn ivu-btn-error ivu-btn-long ivu-btn-ghost').should('not.be.visible')
    //
    cy.get('.provider-page__btn-block > .ivu-btn-default > span')
      .should('text', 'Применить')
      .click() // кликаю Применить - перекидывает в юр лицо( пока на грид - БАГ) - удаляем провайдера
    cy.wait(12000)
    cy.url().should('contain', 'https://panel-cto.s256.dev/juridical/provider-edit')
    cy.get(':nth-child(7) > span').click()
    cy.juridical()
    cy.get('.table-pagination__info').contains('Всего 9 записей') // проверяю в гриде юр лицо:
    cy.get('.ivu-table-tbody > :nth-child(1) > :nth-child(1) > .ivu-table-cell > span') // есть id-к
    cy.get('.ivu-table-tbody > :nth-child(1) > :nth-child(2) > .ivu-table-cell > span').should(
      'text',
      'test'
    )
    cy.get(
      ':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > [style="padding: 0px;"] > div'
    )
      .contains('Редактирование')
      .click({ force: true }) // откываем на редактирование и проверяем созданное юр лицо и провайдера, затем удаляем провайдера+проверяем
    cy.CheckJuridicalWithProvider()
    cy.get(':nth-child(1) > .ivu-card > .ivu-card-body > .ivu-btn > span')
      .should('text', 'Редактировать')
      .click({ force: true }) // проверяем провайдера:
    cy.url().should('contain', 'https://panel-cto.s256.dev/juridical/provider-edit')
    cy.main()
    cy.CheckProviderYandex()
    // здесь удаляем Провайдера  - разница с предыдущим блоком только в том, что там удаляем после нажатия Сохранить, а здесь удаляем после нажатия Применить - но кнопка Применить работаем неверно,
    // поэтому пока оставляем как в пред блоке -ИСПРАВИТЬ
    cy.get('.ivu-btn-error > span').should('text', 'Удалить').click()
    cy.get('.ivu-modal-confirm-head-title').should('text', 'Удаление')
    cy.get('.ivu-modal-confirm-body > div > :nth-child(1)').should(
      'text',
      'Вы уверены что хотите удалить Провайдера ?'
    )
    cy.get('.ivu-modal-confirm-body > div > :nth-child(2)').should(
      'text',
      'Это действие необратимо!'
    )
    cy.get('.ivu-modal-confirm-footer > .ivu-btn-primary > span').should('text', 'OK')
    cy.get('.ivu-btn-text > span').should('text', 'Отменить').click({ force: true }) // проверяем кнопку отменить в Удалении Провайдера: нажали и снова проверяем Провайдера(что не удалился)
    cy.CheckProviderYandex()
    cy.get('.ivu-btn-error > span').should('text', 'Удалить').click()
    cy.get('.ivu-modal-confirm-footer > .ivu-btn-primary > span')
      .should('text', 'OK')
      .click({ force: true }) // удаляем провайдера - проверяем(что удалился)
    cy.get('.ivu-message-custom-content > span').should('text', 'Провайдер успешно удален')
    //
    cy.CheckJuridical()
    cy.ClickBack()
    cy.juridical()
    cy.get('.table-pagination__info').contains('Всего 9 записей') // в реальных тестах поменять на 1
    cy.wait(13000)
    cy.DeleteJuridical() // удаляю юр лицо
    // Проверяем следующий путь - Юр лица-Создаем юр лицо-нажимаем Применить-Добавляем провайдера-Нажимаем Применить-Нажимаем Назад и проверяем,
    // что мы оказались на странице юр лица (проверка юр лица и провайдера)-Удаляем юр лицо
    cy.get('.ivu-card-body__btn-create > span').click() // снова создаю юр лицо - Применить-Добавить провайдера-Применить
    cy.CreateJuridical()
    cy.get('.juridical-payments').should('not.be.visible') // блок с Провайдерами невидим до нажатия Применить
    cy.get('.juridical-detail__btn-block > .ivu-btn-default > span')
      .should('text', 'Применить')
      .click() // "Применить" нажимаю первый раз - создаю юр лицо
    // cy.get('.ivu-message-custom-content > span').should('text','Юр. лицо успешно создано')
    cy.CheckJuridical()
    cy.get('.juridical-payments') // появился блок с провайдерами, нет пока ни одного:
    cy.get('.juridical-payments > .ivu-row > .ivu-col > .ivu-card > .ivu-card-head > p > span')
      .first()
      .should('text', 'Добавить провайдера')
    cy.get(':nth-child(2) > .ivu-card > .ivu-card-head > p > span').should('not.be.visible')
    cy.wait(4000)
    cy.get('.ivu-card-body > .ivu-btn').click({ force: true }) // кликаю "добавить провайдера"
    cy.CreateProviderYandex()
    cy.get('.ivu-btn ivu-btn-error ivu-btn-long ivu-btn-ghost').should('not.be.visible')
    //
    cy.get('.provider-page__btn-block > .ivu-btn-default > span')
      .should('text', 'Применить')
      .click() // кликаю Применить - остаемся на этой странице, перехожу в грид юр лиц и все прверяю
    cy.wait(11000)
    cy.url().should('contain', 'https://panel-cto.s256.dev/juridical/provider-edit')
    cy.get(':nth-child(7) > span').click()
    cy.juridical()
    cy.get('.table-pagination__info').contains('Всего 9 записей') // проверяю в гриде юр лицо:
    cy.get('.ivu-table-tbody > :nth-child(1) > :nth-child(1) > .ivu-table-cell > span') // есть id-к
    cy.get('.ivu-table-tbody > :nth-child(1) > :nth-child(2) > .ivu-table-cell > span').should(
      'text',
      'test'
    )
    cy.get(
      ':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > [style="padding: 0px;"] > div'
    )
      .contains('Редактирование')
      .click({ force: true }) // откываем на редактирование и проверяем созданное юр лицо и провайдера, затем нажимаем Назад
    cy.CheckJuridicalWithProvider()
    cy.get(':nth-child(1) > .ivu-card > .ivu-card-body > .ivu-btn > span')
      .should('text', 'Редактировать')
      .click({ force: true }) // проверяем провайдера
    cy.url().should('contain', 'https://panel-cto.s256.dev/juridical/provider-edit')
    cy.main()
    cy.CheckProviderYandex()
    cy.get('.view-header__back > .ivu-btn > span').click() // нажимаем кнопку Назад, проверяем, что редирект на страницу юр лица (проверка юр лица и провайдера)
    cy.CheckJuridicalWithProvider()
    cy.get(':nth-child(1) > .ivu-card > .ivu-card-body > .ivu-btn > span')
      .should('text', 'Редактировать')
      .click({ force: true }) // проверяем провайдера
    cy.wait(5000)
    cy.url().should('contain', 'https://panel-cto.s256.dev/juridical/provider-edit')
    cy.main()
    cy.CheckProviderYandex()
    cy.get(':nth-child(7) > span').click()
    cy.juridical()
    cy.DeleteJuridical() // удаляю юр лицо
    // Проверяем следующий путь - Юр лица-Создаем юр лицо-нажимаем Применить-Добавляем провайдера-Нажимаем Применить-Нажимаем Сохранить и проверяем,
    // что мы оказались на странице юр лица (проверка юр лица и провайдера)-Удаляем юр лицо
    cy.get('.ivu-card-body__btn-create > span').click() // снова создаю юр лицо - Применить-Добавить провайдера-Применить
    cy.CreateJuridical()
    cy.get('.juridical-payments').should('not.be.visible') // блок с Провайдерами невидим до нажатия Применить
    cy.get('.juridical-detail__btn-block > .ivu-btn-default > span')
      .should('text', 'Применить')
      .click() // "Применить" нажимаю первый раз - создаю юр лицо
    // cy.get('.ivu-message-custom-content > span').should('text','Юр. лицо успешно создано')
    cy.CheckJuridical()
    cy.get('.juridical-payments') // появился блок с провайдерами, нет пока ни одного:
    cy.get('.juridical-payments > .ivu-row > .ivu-col > .ivu-card > .ivu-card-head > p > span')
      .first()
      .should('text', 'Добавить провайдера')
    cy.get(':nth-child(2) > .ivu-card > .ivu-card-head > p > span').should('not.be.visible')
    cy.wait(4000)
    cy.get('.ivu-card-body > .ivu-btn').click({ force: true }) // кликаю "добавить провайдера"
    cy.CreateProviderYandex()
    cy.get('.ivu-btn ivu-btn-error ivu-btn-long ivu-btn-ghost').should('not.be.visible')
    //
    cy.get('.provider-page__btn-block > .ivu-btn-default > span')
      .should('text', 'Применить')
      .click() // кликаю Применить - перекидывает в юр лицо( пока на грид - БАГ)- когда починят переделать! - переделала
    cy.wait(4000)
    cy.get(':nth-child(7) > span').click()
    cy.wait(4000)
    cy.juridical()
    cy.get('.table-pagination__info').contains('Всего 9 записей') // проверяю в гриде юр лицо:
    cy.get('.ivu-table-tbody > :nth-child(1) > :nth-child(1) > .ivu-table-cell > span') // есть id-к
    cy.get('.ivu-table-tbody > :nth-child(1) > :nth-child(2) > .ivu-table-cell > span').should(
      'text',
      'test'
    )
    cy.get(
      ':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > [style="padding: 0px;"] > div'
    )
      .contains('Редактирование')
      .click({ force: true }) // откываем на редактирование и проверяем созданное юр лицо и провайдера, затем нажимаем Назад
    cy.CheckJuridicalWithProvider()
    cy.get(':nth-child(1) > .ivu-card > .ivu-card-body > .ivu-btn > span')
      .should('text', 'Редактировать')
      .click({ force: true }) // проверяем провайдера
    cy.wait(5000)
    cy.url().should('contain', 'https://panel-cto.s256.dev/juridical/provider-edit')
    cy.main()
    cy.CheckProviderYandex()
    cy.get('.ivu-btn-primary > span').should('text', 'Сохранить').click() // кликаю Сохранить - перекидывает в юр лицо
    cy.CheckJuridicalWithProvider()
    cy.get(':nth-child(1) > .ivu-card > .ivu-card-body > .ivu-btn > span')
      .should('text', 'Редактировать')
      .click({ force: true }) // проверяем провайдера
    cy.wait(5000)
    cy.url().should('contain', 'https://panel-cto.s256.dev/juridical/provider-edit')
    cy.main()
    cy.CheckProviderYandex()
    cy.get(':nth-child(7) > span').click()
    cy.juridical()
    cy.DeleteJuridical() // удаляю юр лицо
    //
    // Проверяем следующий путь - Юр лица-Создаем юр лицо-нажимаем Применить-Добавляем провайдера-Нажимаем Применить-Нажимаем Применить еще раз и проверяем,
    // что мы остались на странице Провайдера (проверка провайдера +попап)-Удаляем юр лицо
    cy.get('.ivu-card-body__btn-create > span').click() // снова создаю юр лицо - Применить-Добавить провайдера-Применить
    cy.CreateJuridical()
    cy.get('.juridical-payments').should('not.be.visible') // блок с Провайдерами невидим до нажатия Применить
    cy.get('.juridical-detail__btn-block > .ivu-btn-default > span')
      .should('text', 'Применить')
      .click() // "Применить" нажимаю первый раз - создаю юр лицо
    // cy.get('.ivu-message-custom-content > span').should('text','Юр. лицо успешно создано')
    cy.CheckJuridical()
    cy.get('.juridical-payments') // появился блок с провайдерами, нет пока ни одного:
    cy.get('.juridical-payments > .ivu-row > .ivu-col > .ivu-card > .ivu-card-head > p > span')
      .first()
      .should('text', 'Добавить провайдера')
    cy.get(':nth-child(2) > .ivu-card > .ivu-card-head > p > span').should('not.be.visible')
    cy.wait(4000)
    cy.get('.ivu-card-body > .ivu-btn').click({ force: true }) // кликаю "добавить провайдера"
    cy.CreateProviderYandex()
    cy.get('.ivu-btn ivu-btn-error ivu-btn-long ivu-btn-ghost').should('not.be.visible')
    //
    cy.get('.provider-page__btn-block > .ivu-btn-default > span')
      .should('text', 'Применить')
      .click() // кликаю Применить - перекидывает в юр лицо( пока на грид - БАГ)- когда починят переделать! - переделала
    cy.get('.ivu-message-custom-content > span').should('text', 'Провайдер успешно создан')
    cy.wait(12000)
    cy.url().should('contain', 'https://panel-cto.s256.dev/juridical/provider-edit')
    cy.get(':nth-child(7) > span').click()
    cy.main()
    cy.wait(15000)
    cy.get('.table-pagination__info').contains('Всего 9 записей') // проверяю в гриде юр лицо:
    cy.get('.ivu-table-tbody > :nth-child(1) > :nth-child(1) > .ivu-table-cell > span') // есть id-к
    cy.get('.ivu-table-tbody > :nth-child(1) > :nth-child(2) > .ivu-table-cell > span').should(
      'text',
      'test'
    )
    cy.get(
      ':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > [style="padding: 0px;"] > div'
    )
      .contains('Редактирование')
      .click({ force: true }) // откываем на редактирование и проверяем созданное юр лицо и провайдера, затем нажимаем Назад
    cy.CheckJuridicalWithProvider()
    cy.get(':nth-child(1) > .ivu-card > .ivu-card-body > .ivu-btn > span')
      .should('text', 'Редактировать')
      .click({ force: true }) // проверяем провайдера
    cy.wait(14000)
    cy.url().should('contain', 'https://panel-cto.s256.dev/juridical/provider-edit')
    cy.main()
    cy.wait(19000)
    cy.CheckProviderYandex()
    // еще раз нажимаю Применить и проверяю, что ничего не изменилось - только попап
    cy.get('.provider-page__btn-block > .ivu-btn-default > span')
      .should('text', 'Применить')
      .click() // кликаю Применить - перекидывает в юр лицо( пока на грид - БАГ)- когда починят переделать!
    cy.wait(5000)
    // cy.get('.ivu-message-custom-content > span').should('text','Провайдер успешно обновлен')
    cy.url().should('contain', 'https://panel-cto.s256.dev/juridical/provider-edit')
    // cy.get(':nth-child(7) > span').click()
    cy.main()
    cy.wait(15000)
    cy.CheckProviderYandex()
    //
    // проверяем редактирование - открываем юр лицо, вносим изменения - нажимаем Применить проверяем, затем удаляем эти изменения - снова проверяем
    cy.get('.provider-page__btn-block > .ivu-btn-default > span')
      .should('text', 'Применить')
      .click() // кликаю Применить - перекидывает в юр лицо( пока на грид - БАГ)- когда починят переделать!
    cy.wait(5900)
    // cy.get('.ivu-message-custom-content > span').should('text','Провайдер успешно обновлен')
    cy.get(':nth-child(7) > span').click()
    cy.wait(7500)
    cy.get('.ivu-table-tbody > :nth-child(1) > .ivu-table-column-center').click({ force: true })
    // cy.get(':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > [style="padding: 0px; color: rgb(237, 64, 20);"] > div')
    cy.get(
      ':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > [style="padding: 0px;"] > div'
    )
      .contains('Редактирование')
      .click({ force: true })
    cy.get(
      ':nth-child(1) > .ivu-form-item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
    )
      .should('have.attr', 'placeholder', 'используется внутри админ. панели')
      .type('1', { force: true }) // .should('have.value','test1')
    cy.get('.juridical-detail__btn-block > .ivu-btn-default > span')
      .should('text', 'Применить')
      .click()
    cy.wait(5900)
    cy.get(':nth-child(7) > span').click()
    cy.wait(6000)
    cy.get('.ivu-table-tbody > :nth-child(1) > :nth-child(2) > .ivu-table-cell > span').should(
      'text',
      'test1'
    )
    cy.get(
      ':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > [style="padding: 0px;"] > div'
    )
      .contains('Редактирование')
      .click({ force: true })
    cy.wait(6100)
    cy.get(
      ':nth-child(1) > .ivu-form-item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
    )
      .should('have.attr', 'placeholder', 'используется внутри админ. панели')
      .type('{backspace}', { force: true })
      .should('have.value', 'test')
    cy.get('.juridical-detail__btn-block > .ivu-btn-default > span')
      .should('text', 'Применить')
      .click()
    cy.wait(6200)
    cy.get(':nth-child(7) > span').click()
    cy.wait(6300)
    cy.get('.ivu-table-tbody > :nth-child(1) > :nth-child(2) > .ivu-table-cell > span').should(
      'text',
      'test'
    )
    //
    // проверяем редактирование - открываем юр лицо, вносим изменения - нажимаем Сохранить проверяем, затем удаляем эти изменения - снова проверяем
    cy.get('.ivu-table-tbody > :nth-child(1) > .ivu-table-column-center').click({ force: true })
    cy.get(
      ':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > [style="padding: 0px;"] > div'
    )
      .contains('Редактирование')
      .click({ force: true })
    cy.get(
      ':nth-child(1) > .ivu-form-item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
    )
      .should('have.attr', 'placeholder', 'используется внутри админ. панели')
      .type('1', { force: true })
      .should('have.value', 'test1')
    cy.get('.ivu-btn-primary > span').first().should('text', 'Сохранить').click()
    cy.wait(6400)
    cy.get('.ivu-table-tbody > :nth-child(1) > :nth-child(2) > .ivu-table-cell > span').should(
      'text',
      'test1'
    )
    cy.get(
      ':nth-child(1) > .ivu-table-column-center > .ivu-table-cell > :nth-child(1) > .ivu-dropdown > .ivu-select-dropdown > .ivu-dropdown-menu > [style="padding: 0px;"] > div'
    )
      .contains('Редактирование')
      .click({ force: true })
    cy.get(
      ':nth-child(1) > .ivu-form-item > .ivu-form-item-content > .ivu-input-wrapper > .ivu-input'
    )
      .should('have.attr', 'placeholder', 'используется внутри админ. панели')
      .type('{backspace}', { force: true })
      .should('have.value', 'test')
    cy.wait(6500)
    cy.get('.ivu-btn-primary > span').first().should('text', 'Сохранить').click()
    cy.wait(6600)
    cy.get('.ivu-table-tbody > :nth-child(1) > :nth-child(2) > .ivu-table-cell > span').should(
      'text',
      'test'
    )
    //
    // проверяем фильтрацию (берем id-к нашего созданного юр лица и вставляем его в фильтр)
    cy.get(':nth-child(7) > span').click()
    //
    cy.get('.ivu-table-row').then(($row1) => {
      cy.get('.ivu-table-tbody > :nth-child(1) > :nth-child(1) > .ivu-table-cell > span').then(
        ($span) => {
          const idEvent = parseFloat($span.text())
          const n1 = $row1.length
          cy.get('.ivu-input').type(idEvent + '{enter}')
          cy.get('.ivu-table-row').then(($row2) => {
            const n2 = $row2.length
            cy.get($row2).should('have.length', 1)
            cy.get(
              '.ivu-table-tbody > :nth-child(1) > :nth-child(2) > .ivu-table-cell > span'
            ).should('text', 'test')
            cy.get('.ivu-input').clear().click()
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
      )
    })
  })
})
