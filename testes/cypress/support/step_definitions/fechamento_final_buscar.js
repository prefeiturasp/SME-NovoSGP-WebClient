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

// Necessário realizar o fechamento do bimestre
When('envio uma requisição POST', function () { 
  cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/fechamentos/finais?DisciplinaCodigo=${Cypress.env('DISCIPLINA_CODIGO')}&TurmaCodigo=${Cypress.env('TURMA_CODIGO')}&Semestre=${Cypress.env('SEMESTRE_CODIGO')}`,
      headers: {
        accept: 'text/plain',
        'Authorization': `Bearer ${token}`
      },
    failOnStatusCode: false, 
  }).as('response')
})

Then('retorna o status 200 sendo necessário realizar o fechamento do bimestre', function () {
  cy.get('@response').then((response) => {
  expect(response.status).to.eq(200)
  })
})

// Não retornar dados com código da turma inválida
When('envio uma requisição POST com turma inválida', function () { 
  cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/fechamentos/finais?DisciplinaCodigo=${Cypress.env('DISCIPLINA_CODIGO')}&TurmaCodigo=${Cypress.env('TURMA_CODIGO_INVALIDO')}&Semestre=${Cypress.env('SEMESTRE_CODIGO')}`,
      headers: {
        accept: 'text/plain',
        'Authorization': `Bearer ${token}`
     },
    failOnStatusCode: false,
  }).as('response')
})

Then('não retorna os dados exibindo o status 601', function () {
  cy.get('@response').then((response) => {
  expect(response.status).to.eq(601)
  })
})

// Não retornar dados sem usuário autenticado
Given('que não possuo um token de acesso válido', () => {
})

When('tento a requisição POST', function () { 
  cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/fechamentos/finais?DisciplinaCodigo=${Cypress.env('DISCIPLINA_CODIGO')}&TurmaCodigo=${Cypress.env('TURMA_CODIGO')}&Semestre=${Cypress.env('SEMESTRE_CODIGO')}`,
      headers: {
        accept: 'text/plain',
        'Authorization': 'Bearer token_invalido'
    },
    failOnStatusCode: false,
  }).as('response')
})

Then('não retorna os dados mostrando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})
