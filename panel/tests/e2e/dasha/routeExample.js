describe('Events', function () {
  before(function () {
    cy.login('admin@s256.ru', 'devmydev')
  })
  beforeEach(function () {
    cy.visit('http://panel.cto.s256.ru/home')
    cy.wait(2000)
    cy.url().should('eq', 'http://panel.cto.s256.ru/home')
  })

  it('Check route', function () {
    cy.server()
    cy.route({
      method: 'GET',
      url: '/api/v1/legal-entity',
      fixture: 'activities.json',
    }).as('schedule')

    cy.get('body').contains('Мероприятия').click()
    cy.wait(3000)
    // cy.main()
    cy.get('.event-actions__btn > span > span').should('text', 'Создать мероприятие') // сначала проверяем обязательность полей: Создать мероприятие-Применить(проверили ошибки под полями)
    // - Сохранить(проверили ошибки под полями)-Назад(проверяю, что редирект на грид)
    cy.get('.event-actions__btn').click()

    cy.wait('@schedule').then((xhr) => {
      assert('xhr.status', '200')
      expect(xhr.response.body.data[1]).to.have.property('id', '747')
    })

    // cy.get("@schedule").its('response.body').should('have.property','data').and('contain','{id: "746", type: "legal-entity",…}')
  })
  it('Get cookies', () => {
    cy.getCookie('user').should('have.property', 'value', '1')
  })
})
