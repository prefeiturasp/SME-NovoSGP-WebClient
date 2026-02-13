import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps'

let token

Before(() => {
  cy.gerar_token().then((token_valido) => {
    token = token_valido
  })
})

Given('que possuo um token de acesso válido', function () {
  expect(token, 'valido').to.exist
})

// Retorna dados de UE através do código
When('envio uma requisição GET para o endpoint de modalidades da UE', function () { 
  cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/ues/${Cypress.env('UE_CODIGO')}/modalidades?ano=${Cypress.env('ANO_LETIVO')}&consideraNovasModalidades=false`,
      headers: {
        accept: 'text/plain',
        'Authorization': `Bearer ${token}`, 
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna os dados da UE com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
      expect(response.body).to.be.an('array').and.not.be.empty
      response.body.forEach(item => {
      expect(item).to.have.all.keys('id', 'nome')
      expect(item.id).to.be.a('number')
      expect(item.nome).to.be.a('string').and.not.be.empty
    })
  })
})

// Ano letivo deve ser obrigatório
When('envio uma requisição GET para o endpoint sem o ano letivo', function () { 
  cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/ues/${Cypress.env('UE_CODIGO')}/modalidades`,
      headers: {
        accept: 'text/plain',
        'Authorization': `Bearer ${token}`, 
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 sem os dados da turma', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)
      expect(response.body).to.include({
      existemErros: true,
      })
      expect(response.body.mensagens).to.be.an('array').that.includes('O ano letivo deve ser informado para consulta das novas modalidades.')
  })  
})   

// Não retornar dados sem usuário autenticado
Given('que não possuo um token de acesso válido', () => {
})

When('tento uma requisição GET para o endpoint de modalidades', function () { 
  cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/ues/${Cypress.env('UE_CODIGO')}/modalidades?ano=${Cypress.env('ANO_LETIVO')}&consideraNovasModalidades=false`,
      headers: {
        accept: 'text/plain',
        'Authorization': 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('não retorna os dados da UE com status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})
