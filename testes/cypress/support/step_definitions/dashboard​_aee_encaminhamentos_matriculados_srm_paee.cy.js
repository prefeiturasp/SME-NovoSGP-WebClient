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

// Retorna dados AEE planos acessibilidades
When('envio uma requisição GET para o endpoint', function () { 
  return cy.request({
    method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/aee/encaminhamentos/matriculados-srm-paee?anoLetivo=${Cypress.env('ANO_LETIVO')}&dreCodigo=${Cypress.env('DRE_CODIGO')}&ueCodigo=${Cypress.env('UE_CODIGO')}`,
        headers: {
          accept: 'text/plain',            
          'Authorization': `Bearer ${token}`
        },    
        timeout: 60000,      
        failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com os dados AEE planos acessibilidades', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
  })
})

// Ano letivo deve ser obrigatório no AEE planos acessibilidades
When('tento a requisição GET para o endpoint sem o ano', function () { 
  return cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/dashboard/aee/encaminhamentos/matriculados-srm-paee?anoLetivo=&dreCodigo=${Cypress.env('DRE_CODIGO')}&ueCodigo=${Cypress.env('UE_CODIGO')}`,
      headers: {
        accept: 'text/plain',            
        'Authorization': `Bearer ${token}`
      },          
      failOnStatusCode: false 
  }).as('response')
})

Then('retorna o status 422 que o ano letivo é obrigatório no AEE planos acessibilidades', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
  })
})

// Não retorna dados de no AEE planos acessibilidades sem usuário autenticado
Given('que não login não gerou um token de acesso válido', () => {
  token = 'token_invalido'
})

When('tento a requisição GET para o endpoint do dashboard AEE', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dashboard/aee/encaminhamentos/matriculados-srm-paee?anoLetivo=${Cypress.env('ANO_LETIVO')}&dreCodigo=${Cypress.env('DRE_CODIGO')}&ueCodigo=${Cypress.env('UE_CODIGO')}`,
    headers: {
         accept: 'text/plain',
         'Authorization': 'Bearer token_invalido' },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem buscar AEE planos acessibilidades', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})
