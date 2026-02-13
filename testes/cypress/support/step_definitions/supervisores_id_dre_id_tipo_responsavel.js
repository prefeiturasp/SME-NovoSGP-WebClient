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

// Realiza a busca através do supervisor da DRE e tipo 1
When('envio uma requisição GET com o tipo 1', function () { 
  cy.request({
    method: 'GET', 
      url: Cypress.config('baseUrl') + `/api/v1/supervisores/${Cypress.env('LOGIN_SUPERVISOR')}/dre/${Cypress.env('DRE_CODIGO')}/1`,
      headers: {
      accept: 'text/plain',
      'Authorization': `Bearer ${token}`,            
    },
    failOnStatusCode: false,  
  }).as('response')
})

Then('retorna o status 200 com supervisor da DRE', function () {
  cy.get('@response').then((response) => {
   expect(response.status).to.eq(200)   
  })
})

// Realiza a busca através do supervisor da DRE e tipo 2
When('envio uma requisição GET com o tipo 2', function () { 
  cy.request({
    method: 'GET', 
      url: Cypress.config('baseUrl') + `/api/v1/supervisores/${Cypress.env('LOGIN_SUPERVISOR')}/dre/${Cypress.env('DRE_CODIGO')}/2`,
      headers: {
      accept: 'text/plain',
      'Authorization': `Bearer ${token}`,            
    },
    failOnStatusCode: false,  
  }).as('response')
})

Then('retorna o status 200 com supervisor de DRE', function () {
  cy.get('@response').then((response) => {
   expect(response.status).to.eq(200)   
  })
})

// Realiza a busca através do supervisor da DRE e tipo 3
When('envio uma requisição GET com o tipo 3', function () { 
  cy.request({
    method: 'GET', 
      url: Cypress.config('baseUrl') + `/api/v1/supervisores/${Cypress.env('LOGIN_SUPERVISOR')}/dre/${Cypress.env('DRE_CODIGO')}/3`,
      headers: {
      accept: 'text/plain',
      'Authorization': `Bearer ${token}`,            
    },
    failOnStatusCode: false,  
  }).as('response')
})

Then('retorna o status 200 com supervisor DRE', function () {
  cy.get('@response').then((response) => {
   expect(response.status).to.eq(200)   
  })
})

// Realiza a busca através do supervisor da DRE e tipo 4
When('envio uma requisição GET com o tipo 4', function () { 
  cy.request({
    method: 'GET', 
      url: Cypress.config('baseUrl') + `/api/v1/supervisores/${Cypress.env('LOGIN_SUPERVISOR')}/dre/${Cypress.env('DRE_CODIGO')}/4`,
      headers: {
      accept: 'text/plain',
      'Authorization': `Bearer ${token}`,            
    },
    failOnStatusCode: false,  
  }).as('response')
})

Then('retorna o status 200 e supervisor da DRE', function () {
  cy.get('@response').then((response) => {
   expect(response.status).to.eq(200)   
  })
})

// Realiza a busca através do supervisor da DRE e tipo 5
When('envio uma requisição GET com o tipo 5', function () { 
  cy.request({
    method: 'GET', 
      url: Cypress.config('baseUrl') + `/api/v1/supervisores/${Cypress.env('LOGIN_SUPERVISOR')}/dre/${Cypress.env('DRE_CODIGO')}/5`,
      headers: {
      accept: 'text/plain',
      'Authorization': `Bearer ${token}`,            
    },
    failOnStatusCode: false,  
  }).as('response')
})

Then('retorna o status 200 ceom supervisor DRE', function () {
  cy.get('@response').then((response) => {
   expect(response.status).to.eq(200)   
  })
})

// Tipo deve ser obrigatório
When('envio uma requisição GET para supervisores sem tipo', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/supervisores/${Cypress.env('LOGIN_SUPERVISOR')}/dre/${Cypress.env('DRE_CODIGO')}/`,
    headers: {
      accept: 'text/plain',
      'Authorization': `Bearer ${token}`,            
    },
    failOnStatusCode: false,  
  }).as('response')
})

Then('carrega o status 500 que a DRE do responsável deve ser obrigatório', function () {
  cy.get('@response').then((response) => {
   expect(response.status).to.eq(500)     
  })
})

// DRE deve ser obrigatório
When('envio a requisição GET para supervisores sem dre', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/supervisores/${Cypress.env('LOGIN_SUPERVISOR')}/dre//1`,
    headers: {
      accept: 'text/plain',
      'Authorization': `Bearer ${token}`,            
    },
    failOnStatusCode: false,  
  }).as('response')
})

Then('carrega o status 500 que a DRE do responsável deve ser obrigatório', function () {
  cy.get('@response').then((response) => {
   expect(response.status).to.eq(500)     
  })
})

// Supervisor deve ser obrigatório
When('envio uma requisição GET sem supervisor', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/supervisores//dre/${Cypress.env('DRE_CODIGO')}/1`,
    headers: {
      accept: 'text/plain',
      'Authorization': `Bearer ${token}`,            
    },
    failOnStatusCode: false,  
  }).as('response')
})

Then('carrega o status 500 que a DRE do responsável deve ser obrigatório', function () {
  cy.get('@response').then((response) => {
   expect(response.status).to.eq(500)     
  })
})

// Não retorna dados sem usuário autenticado
Given('que não possuo um token de acesso válido', () => {
})

When('tento a requisição GET de supervisores responsável por tipo', function () { 
  cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/supervisores/${Cypress.env('LOGIN_SUPERVISOR')}/dre/${Cypress.env('DRE_CODIGO')}/1`,
      headers: {
        accept: 'text/plain',
        'Authorization': 'Bearer token_invalido' 
    },
  failOnStatusCode: false
  }).as('response')
})

Then('não retorna os tipos de supervisores mostrando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})
