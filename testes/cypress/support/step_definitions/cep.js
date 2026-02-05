import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps'

let token

Before(() => {
  cy.gerar_token().then((token_valido) => {
    token = token_valido
  })
})

Given('que possuo um token de acesso', function () {
  expect(token, 'valido').to.exist
})

// Buscar dados com CEP válido
When('envio uma requisição GET com CEP válido', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/cep/${Cypress.env('CEP_VALIDO')}`,
    headers: {
      accept: 'text/plain',            
      Authorization: `Bearer ${token}`
    }, 
    timeout: 120000,          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 200 de confirmação da busca', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)    
  })
})

// CEP informado deve ser inválido
When('envio uma requisição GET com CEP inválido', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/cep/${Cypress.env('CEP_INVALIDO')}`,
    headers: {
      accept: 'text/plain',            
      Authorization: `Bearer ${token}`
    },
  timeout: 120000,          
  failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 204 que não foi possível buscar os dados', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(204) 
  })
})

// CEP deve ser informado para busca
When('tento a requisição GET para o endpoint buscar sem o cep', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/cep/`,
    headers: {
      accept: 'text/plain',            
      Authorization: `Bearer ${token}`
    },          
    failOnStatusCode: false  
  }).as('response')
})

Then('não realiza a consulta retornando o status 500', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)
  })
})
