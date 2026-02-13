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

// Realiza a busca através do código da DRE
When('envio uma requisição GET a lista de supervisores', function () { 
  cy.request({
    method: 'GET', 
      url: Cypress.config('baseUrl') + `/api/v1/supervisores/dre/${Cypress.env('DRE_CODIGO')}`,
      headers: {
      accept: 'text/plain',
      'Authorization': `Bearer ${token}`,            
    },
    failOnStatusCode: false,  
  }).as('response')
})

Then('retorna o status 200 através do código da DRE', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)   
  })
})

// Realiza a busca através do código da DRE e tipo de responsável 1
When('envio uma requisição GET a lista tipo do 1', function () { 
  cy.request({
    method: 'GET', 
      url: Cypress.config('baseUrl') + `/api/v1/supervisores/dre/${Cypress.env('DRE_CODIGO')}?TipoResponsavelAtribuicao=1`,
      headers: {
      accept: 'text/plain',
      'Authorization': `Bearer ${token}`,            
    },
    failOnStatusCode: false,  
  }).as('response')
})

Then('retorna o status 200 através do código da DRE', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body[0]).to.have.property('supervisorNome')
    expect(response.body[0]).to.have.property('supervisorId')     
  })
})

// Realiza a busca através do código da DRE e tipo de responsável 2
When('envio uma requisição GET a lista tipo do 2', function () { 
  cy.request({
    method: 'GET', 
      url: Cypress.config('baseUrl') + `/api/v1/supervisores/dre/${Cypress.env('DRE_CODIGO')}?TipoResponsavelAtribuicao=2`,
      headers: {
      accept: 'text/plain',
      'Authorization': `Bearer ${token}`,            
    },
    failOnStatusCode: false,  
  }).as('response')
})

Then('retorna o status 200 através do código DRE', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body[0]).to.have.property('supervisorNome')
    expect(response.body[0]).to.have.property('supervisorId')     
  })
})

// Realiza a busca através do código da DRE e tipo de responsável 3
When('envio uma requisição GET a lista tipo do 3', function () { 
  cy.request({
    method: 'GET', 
      url: Cypress.config('baseUrl') + `/api/v1/supervisores/dre/${Cypress.env('DRE_CODIGO')}?TipoResponsavelAtribuicao=3`,
      headers: {
      accept: 'text/plain',
      'Authorization': `Bearer ${token}`,            
    },
    failOnStatusCode: false,  
  }).as('response')
})

Then('retorna o status 200 através do código de DRE', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body[0]).to.have.property('supervisorNome')
    expect(response.body[0]).to.have.property('supervisorId')     
  })
})

// Realiza a busca através do código da DRE e tipo de responsável 4
When('envio uma requisição GET a lista tipo do 4', function () { 
  cy.request({
    method: 'GET', 
      url: Cypress.config('baseUrl') + `/api/v1/supervisores/dre/${Cypress.env('DRE_CODIGO')}?TipoResponsavelAtribuicao=4`,
      headers: {
      accept: 'text/plain',
      'Authorization': `Bearer ${token}`,            
    },
    failOnStatusCode: false,  
  }).as('response')
})

Then('retorna o status 200 através de código da DRE', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body[0]).to.have.property('supervisorNome')
    expect(response.body[0]).to.have.property('supervisorId')     
  })
})

// Realiza a busca através do código da DRE e tipo de responsável 5
When('envio uma requisição GET a lista tipo do 5', function () { 
  cy.request({
    method: 'GET', 
      url: Cypress.config('baseUrl') + `/api/v1/supervisores/dre/${Cypress.env('DRE_CODIGO')}?TipoResponsavelAtribuicao=5`,
      headers: {
      accept: 'text/plain',
      'Authorization': `Bearer ${token}`,            
    },
    failOnStatusCode: false,  
  }).as('response')
})

Then('retorna o status 200 através código da DRE', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body[0]).to.have.property('supervisorNome')
    expect(response.body[0]).to.have.property('supervisorId')     
  })
})

// Não retorna dados sem usuário autenticado
Given('que não possuo um token de acesso válido', () => {
})

When('tento a requisição GET a lista de supervisores', function () { 
  cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/supervisores/dre/${Cypress.env('DRE_CODIGO')}`,
      headers: {
        accept: 'text/plain',
        'Authorization': 'Bearer token_invalido' 
    },
  failOnStatusCode: false
  }).as('response')
})

Then('não retorna código da DRE mostrando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})
