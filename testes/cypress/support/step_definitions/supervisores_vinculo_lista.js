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

// Listar os vínculos através da DRE
When('envio uma requisição GET para endpoint de vínculo', function () { 
  cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/supervisores/vinculo-lista?DreCodigo=${Cypress.env('DRE_CODIGO')}`,
      headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com supervisores da DRE', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
        expect(response.body[0]).to.have.property('escolas')
        expect(response.body[0]).to.have.property('responsavelId')
        expect(response.body[0]).to.have.property('responsavel')
        expect(response.body[0]).to.have.property('tipoResponsavel')
        expect(response.body[0]).to.have.property('tipoResponsavelId')
        expect(response.body[0]).to.have.property('ueNome')
        expect(response.body[0]).to.have.property('ueId')
        expect(response.body[0]).to.have.property('dreNome')
        expect(response.body[0]).to.have.property('dreId')
        expect(response.body[0]).to.have.property('id')
        expect(response.body[0]).to.have.property('alteradoEm')
        expect(response.body[0]).to.have.property('alteradoPor')
        expect(response.body[0]).to.have.property('alteradoRF')
        expect(response.body[0]).to.have.property('criadoEm')
        expect(response.body[0]).to.have.property('criadoPor')
        expect(response.body[0]).to.have.property('criadoRF')         
  })
})

// Listar os vínculos através da DRE e UE
When('envio uma requisição GET para endpoint de vínculo da DRE e UE', function () { 
  cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/supervisores/vinculo-lista?DreCodigo=${Cypress.env('DRE_CODIGO')}&UeCodigo=${Cypress.env('UE_CODIGO')}`,
      headers: {
        accept: 'text/plain',
        Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com supervisores da abranagência', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)    
        expect(response.body[0]).to.have.property('escolas')
        expect(response.body[0]).to.have.property('responsavelId')
        expect(response.body[0]).to.have.property('responsavel')
        expect(response.body[0]).to.have.property('tipoResponsavel')
        expect(response.body[0]).to.have.property('tipoResponsavelId')
        expect(response.body[0]).to.have.property('ueNome')
        expect(response.body[0]).to.have.property('ueId')
        expect(response.body[0]).to.have.property('dreNome')
        expect(response.body[0]).to.have.property('dreId')
        expect(response.body[0]).to.have.property('id')
        expect(response.body[0]).to.have.property('alteradoEm')
        expect(response.body[0]).to.have.property('alteradoPor')
        expect(response.body[0]).to.have.property('alteradoRF')
        expect(response.body[0]).to.have.property('criadoEm')
        expect(response.body[0]).to.have.property('criadoPor')
        expect(response.body[0]).to.have.property('criadoRF')          
  })
})

// Listar os vínculos através da DRE, UE e supervisor
When('envio a requisição GET para endpoint de vínculo da DRE e UE', function () { 
  cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/supervisores/vinculo-lista?DreCodigo=${Cypress.env('DRE_CODIGO')}&UeCodigo=${Cypress.env('UE_CODIGO')}&SupervisorId=${Cypress.env('LOGIN_SUPERVISOR')}`,
      headers: {
        accept: 'text/plain',
        Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 e os supervisores', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)                 
  })
})

// UE não deve ter supervisor responsável
When('envio a requisição GET para endpoint sem vínculo na DRE e UE', function () { 
  cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/supervisores/vinculo-lista?DreCodigo=${Cypress.env('DRE_CODIGO')}&UeCodigo=${Cypress.env('UE_CODIGO')}&SupervisorId=${Cypress.env('LOGIN_SUPERVISOR')}&UESemResponsavel=true`,
      headers: {
        accept: 'text/plain',
        Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 sem supervisor responsável', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)                 
  })
})

// Código da DRE deve ser obrigatório
When('envio uma requisição GET para endpoint de vínculo sem a DRE', function () { 
  cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/supervisores/vinculo-lista?DreCodigo=`,
      headers: {
        accept: 'text/plain',
        Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 601 que não foi preenchido o código', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)                 
  })
})

// Não retornar dados de vínculos de supervisores sem usuário autenticado
Given('que não possuo um token de acesso válido', () => {
  token = 'token_invalido'
})

When('tento a requisição GET para endpoint de vínculo', function () { 
  cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/supervisores/vinculo-lista?DreCodigo=${Cypress.env('DRE_CODIGO')}`,
      headers: {
        accept: 'text/plain',
        Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem os dados', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})
