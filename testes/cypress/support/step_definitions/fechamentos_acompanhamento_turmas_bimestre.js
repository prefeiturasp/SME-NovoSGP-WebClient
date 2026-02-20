import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps'

let token

Before(() => {
  cy.gerar_token_cp().then((token_valido) => {
    token = token_valido
  })
})

Given('que possuo um token de acesso válido', function () {
  expect(token, 'valido').to.exist
})

// Retorna dados da turma no bimestre
When('envio uma requisição GET', function () { 
  cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/fechamentos/acompanhamentos/turmas/${Cypress.env('TURMA_CODIGO_FECHAMENTO')}/fechamentos/bimestres/${Cypress.env('BIMESTRE_CODIGO')}`,
      headers: {
        accept: 'text/plain',
        'Authorization': `Bearer ${token}`
      },
    failOnStatusCode: false,
  }).as('response')
})

Then('retorna o status 200 com dados da turma no bimestre', function () {
  cy.get('@response').then((response) => {
  expect(response.status).to.eq(200)
  })
})

// Não retorna dados sem usuário autenticado
Given('que não possuo um token de acesso válido', () => {
})

When('tento a requisição GET', function () { 
  cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/fechamentos/acompanhamentos/turmas/${Cypress.env('TURMA_CODIGO_FECHAMENTO')}/fechamentos/bimestres/${Cypress.env('BIMESTRE_CODIGO')}`,
      headers: {
        accept: 'text/plain',
        'Authorization': 'Bearer token-invalido'
    },
  failOnStatusCode: false,
  }).as('response')
})

Then('não retorna os dados mostrando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})
