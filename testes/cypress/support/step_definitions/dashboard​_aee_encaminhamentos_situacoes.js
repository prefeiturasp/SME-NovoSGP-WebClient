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

// Retorna dados AEE das situações
When('envio uma requisição GET para o endpoint', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dashboard/aee/encaminhamentos/situacoes?anoLetivo=${Cypress.env('ANO_LETIVO')}&dreId=${Cypress.env('DRE_CODIGO')}&ueId=${Cypress.env('UE_CODIGO')}`,
    headers: {
      accept: 'text/plain',            
      'Authorization': `Bearer ${token}`
    },          
    failOnStatusCode: false 
  }).as('response')
})

Then('retorna o status 200 com os dados AEE das situações', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body.qtdeEncaminhamentosSituacao)
    expect(response.body.totalEncaminhamentosAnalise)
    expect(response.body.situacoesEncaminhamentoAEE)
  })
})

// Ano letivo é obrigatório no AEE das situações
When('tento a requisição GET para o endpoint sem o ano', function () { 
  return cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/dashboard/aee/encaminhamentos/situacoes?anoLetivo=&dreId=${Cypress.env('DRE_CODIGO')}&ueId=${Cypress.env('UE_CODIGO')}`,
      headers: {
        accept: 'text/plain',            
        'Authorization': `Bearer ${token}`
    },          
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 que o ano letivo é obrigatório no AEE das situações', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
  })
})

// DRE deve ser obrigatório no AEE das situações
When('tento a requisição GET para o endpoint sem o DRE', function () { 
  return cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/dashboard/aee/encaminhamentos/situacoes?anoLetivo=${Cypress.env('ANO_LETIVO')}&dreId=&ueId=${Cypress.env('UE_CODIGO')}`,
      headers: {
        accept: 'text/plain',            
        'Authorization': `Bearer ${token}`
    },          
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 que DRE é obrigatório no AEE das situações', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
  })
})

// UE deve ser obrigatório no AEE das situações
When('tento a requisição GET para o endpoint sem UE', function () { 
  return cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/dashboard/aee/encaminhamentos/situacoes?anoLetivo=${Cypress.env('ANO_LETIVO')}&dreId=${Cypress.env('DRE_CODIGO')}&ueId=`,
      headers: {
        accept: 'text/plain',            
        'Authorization': `Bearer ${token}`
    },          
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 que o ano letivo é obrigatório no AEE das situações', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
  })
})

// Não retorna dados sem usuário autenticado
Given('que não login não gerou um token de acesso válido', () => {
  token = 'token_invalido'
})

When('tento a requisição GET para o endpoint', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dashboard/aee/encaminhamentos/situacoes?anoLetivo=${Cypress.env('ANO_LETIVO')}&dreId=${Cypress.env('DRE_CODIGO')}&ueId=${Cypress.env('UE_CODIGO')}`,
    headers: {
      accept: 'text/plain',
      'Authorization': 'Bearer token_invalido' },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem buscar AEE das situações', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})
