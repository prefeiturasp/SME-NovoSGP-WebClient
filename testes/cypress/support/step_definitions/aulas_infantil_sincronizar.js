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

// Realizar sincronização das aulas infantil
When('envio uma requisição GET para sincronizar através do código da turma', function () { 
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/aulas_infantil/sincronizar-aulas?codigoTurma=${Cypress.env('TURMA_CODIGO')}`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('a sincronização aulas infantil retorna com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)     
  })
})

// Não permitir acessar sem autenticação
Given('que não possuo um token de acesso válido', () => {
  token = 'token_invalido'
})

When('tento sincronizar através do código da turma com requisição GET', function () { 
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/aulas_infantil/sincronizar-aulas?codigoTurma=${Cypress.env('TURMA_CODIGO')}`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('não sincroniza as aulas infantil retornando com status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})
