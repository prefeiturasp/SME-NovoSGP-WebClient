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
      url: Cypress.config('baseUrl') + `/api/v1/fechamentos/turmas?turmaCodigo=${Cypress.env('TURMA_CODIGO_FECHAMENTO')}&disciplinaCodigo=${Cypress.env('DISCIPLINA_CODIGO')}&bimestre=${Cypress.env('BIMESTRE_CODIGO')}&semestre=${Cypress.env('SEMESTRE_CODIGO')}`,
      headers: {
        accept: 'text/plain',
        'Authorization': `Bearer ${token}`
      },
    timeout: 60000,
  failOnStatusCode: false, 
  }).as('response')
})

Then('retorna o status 200 com dados da turma no bimestre', function () {
  cy.get('@response').then((response) => {
  expect(response.status).to.eq(200)
  })
})

// Não retorna dados com código da turma inválido
When('envio uma requisição GET sem turma', function () { 
  cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/fechamentos/turmas?turmaCodigo=${Cypress.env('TURMA_CODIGO_FECHAMENTO_INVALIDO')}&disciplinaCodigo=${Cypress.env('DISCIPLINA_CODIGO')}&bimestre=${Cypress.env('BIMESTRE_CODIGO')}&semestre=${Cypress.env('SEMESTRE_CODIGO')}`,
      headers: {
        accept: 'text/plain',
       'Authorization': `Bearer ${token}`
    },           
  failOnStatusCode: false,
  }).as('response')
})

Then('retorna o status 500 sem dados da turma no bimestre', function () {
  cy.get('@response').then((response) => {
  expect(response.status).to.eq(500)
  })
})

// Não retorna dados sem usuário autenticado
Given('que não possuo um token de acesso válido', () => {
})

When('tento a requisição GET', function () { 
  cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/fechamentos/turmas?turmaCodigo=${Cypress.env('TURMA_CODIGO_FECHAMENTO')}&disciplinaCodigo=${Cypress.env('DISCIPLINA_CODIGO')}&bimestre=${Cypress.env('BIMESTRE_CODIGO')}&semestre=${Cypress.env('SEMESTRE_CODIGO')}`,
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
