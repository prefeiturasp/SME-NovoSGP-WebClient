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

// Retorna dados da DRE
When('envio uma requisição GET para o endpoint', function () { 
  return cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/dashboard/devolutivas/devolutivas/dre?AnoLetivo=${Cypress.env('ANO_LETIVO')}`,
      headers: {
        accept: 'text/plain',            
        'Authorization': `Bearer ${token}`
      },          
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com os dados da DRE', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)    
  })
})

// Ano letivo deve ser obrigatório
When('tento a requisição GET para o endpoint sem o ano', function () { 
  return cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/dashboard/devolutivas/devolutivas/dre?AnoLetivo=`,
      headers: {
        accept: 'text/plain',            
        'Authorization': `Bearer ${token}`
      },          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 422 que o ano letivo é obrigatório', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
  })
})

// Não retorna dados da DRE sem usuário autenticado
Given('que não login não gerou um token de acesso válido', () => {
  token = 'token_invalido'
})

When('tento a requisição GET para o endpoint', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dashboard/devolutivas/devolutivas/dre?AnoLetivo=${Cypress.env('ANO_LETIVO')}`,
    headers: {
        accept: 'text/plain',
        'Authorization': 'Bearer token_invalido' },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem buscar dados da DRE', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})
