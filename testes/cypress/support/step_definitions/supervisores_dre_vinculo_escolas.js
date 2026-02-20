import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps'

let token

before(() => {
  cy.gerar_token().then((token_valido) => {
    token = token_valido
  })
})

Given('que possuo um token de acesso válido', function () {
  expect(token, 'valido').to.exist
})

// Listar todos os códigos e nomes das UEs
When('envio uma requisição GET de vínculos DRE', function () { 
  cy.request({
    method: 'GET', 
      url: Cypress.config('baseUrl') + `/api/v1/supervisores/dre/${Cypress.env('DRE_CODIGO')}/vinculo-escolas`,
      headers: {
      accept: 'text/plain',
      'Authorization': `Bearer ${token}`,            
    },
    failOnStatusCode: false,  
  }).as('response')
})

Then('retorna o status 200 todos os códigos e nomes das UEs', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(204)    
  })
})

// Não retorna dados sem usuário autenticado
Given('que não possuo um token de acesso válido', () => {
})

When('tento a requisição GET de vínculos DRE', function () { 
  cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/supervisores/dre/${Cypress.env('DRE_CODIGO')}/vinculo-escolas`,
      headers: {
        accept: 'text/plain',
        'Authorization': 'Bearer token_invalido' 
    },
  failOnStatusCode: false
  }).as('response')
})

Then('não retorna todos os códigos e nomes das UEs mostrando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})
