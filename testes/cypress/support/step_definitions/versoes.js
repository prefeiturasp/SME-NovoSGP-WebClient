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

Given('que não gerou um token de acesso válido', () => {
})

// Retornar versão atual do sistema
When('envio uma requisição GET para o endpoint de versão', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/versoes`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})


Then('retorna o status 200 com a atual', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.include('Versão')
  })
})

// Não acessar a versão sem autenticação
When('tento a requisição GET para o endpoint de versões', function () { 
  cy.request({
   method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/versoes`,
      headers: {
        accept: 'text/plain',
        Authorization: 'Bearer token_invalido' },
      failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401) 
  })
})

// Realizar o teste de ping
Given('que acesso o endpoint', function () {  
})

When('envio uma requisição GET para testar o ping', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/versoes/ping-test`,
      headers: {
      accept: '*/*',           
    },
  failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
  })
})