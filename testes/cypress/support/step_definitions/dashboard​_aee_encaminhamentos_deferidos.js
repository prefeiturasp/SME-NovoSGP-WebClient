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

// Retorna dados AEE de encaminhamentos deferidos
When('envio uma requisição GET para o endpoint', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dashboard/aee/encaminhamentos/deferidos?anoLetivo=${Cypress.env('ANO_LETIVO')}&dreId=${Cypress.env('DRE_CODIGO')}&ueId=${Cypress.env('UE_CODIGO')}`,
    headers: {
      accept: 'text/plain',            
      'Authorization': `Bearer ${token}`
    },          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 200 com os dados AEE de encaminhamentos deferidos', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
  })
})

// Ano letivo deve ser obrigatório
When('tento a requisição GET para o endpoint sem o ano', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dashboard/aee/encaminhamentos/deferidos?anoLetivo=&dreId=${Cypress.env('DRE_CODIGO')}&ueId=${Cypress.env('UE_CODIGO')}`,
    headers: {
    accept: 'text/plain',            
        'Authorization': `Bearer ${token}`
    },          
    failOnStatusCode: false 
  }).as('response')
})

Then('retorna o status 422 que o ano letivo é obrigatório no encaminhamentos deferidos', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
  })
})

// Ano letivo da última consolidação deve ser informado
When('tento a requisição GET para o endpoint sem o ano', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dashboard/acompanhamento-aprendizagem/ultima-consolidacao?anoLetivo=`,
    headers: {
      accept: 'text/plain',            
      'Authorization': `Bearer ${token}`
    },          
    failOnStatusCode: false 
  }).as('response')
})

Then('retorna o status 422 que o ano letivo da última consolidação deve ser informado', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
  })
})

// DRE deve ser obrigatório no encaminhamentos deferidos
When('tento a requisição GET sem a DRE', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dashboard/aee/encaminhamentos/deferidos?anoLetivo=${Cypress.env('ANO_LETIVO')}&dreId=&ueId=${Cypress.env('UE_CODIGO')}`,
    headers: {
      accept: 'text/plain',            
      'Authorization': `Bearer ${token}`
    },          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 422 que a DRE deve ser obrigatório no encaminhamentos deferidos', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
  })
})

// UE deve ser obrigatório no encaminhamentos deferidos
When('tento a requisição GET sem a UE', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dashboard/aee/encaminhamentos/deferidos?anoLetivo=${Cypress.env('ANO_LETIVO')}&dreId=${Cypress.env('DRE_CODIGO')}&ueId=`,
    headers: {
      accept: 'text/plain',            
      'Authorization': `Bearer ${token}`
    },          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 422 que a UE deve ser obrigatório no encaminhamentos deferidos', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
  })
})

// Não retorna dados de encaminhamentos deferidos sem usuário autenticado
Given('que não login não gerou um token de acesso válido', () => {
  token = 'token_invalido'
})

When('tento a requisição GET para o endpoint do dashboard AEE', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dashboard/aee/encaminhamentos/deferidos?anoLetivo=${Cypress.env('ANO_LETIVO')}&dreId=${Cypress.env('DRE_CODIGO')}&ueId=${Cypress.env('UE_CODIGO')}`,
    headers: {
      accept: 'text/plain',
      'Authorization': 'Bearer token_invalido' },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem buscar de encaminhamentos deferidos', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})
