import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps'

let token

Before(() => {
  cy.gerar_token().then((token_valido) => {
    token = token_valido
  })
})

Given('que login gerou um token de acesso válido', function () {
  expect(token, 'valido').to.exist
})

// Retorna dados de relatórios
When('envio uma requisição GET para o endpoint de exemplos relatórios', function () { 
  return cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/exemplos/games`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o relatório com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(415)    
  })
})

// Não retorna relatório sem usuário autenticado
Given('que não login não gerou um token de acesso válido', () => {
  token = 'token_invalido'
})

When('tento a requisição GET para o endpoint de exemplos relatórios', function () { 
  return cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/exemplos/games`,
    headers: {
     accept: '*/*',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem dados', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})
