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

// Carrega situações do dashboard de fechamentos
When('envio uma requisição GET para o endpoint do dashboard de fechamentos', function () { 
  return cy.request({
    method: 'GET',
            url: Cypress.config('baseUrl') + `/api/v1/dashboard/fechamentos/situacoes?AnoLetivo=${Cypress.env('ANO_LETIVO')}&DreId=${Cypress.env('DRE_CODIGO')}&UeId=${Cypress.env('UE_CODIGO')}`,
            headers: {
              accept: 'text/plain',
              'Authorization': `Bearer ${token}`
            },
        failOnStatusCode: false,   
    }).as('response')
})

Then('retorna todas situações com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)   
  })
})

// Não selecionar perfil sem autenticação
Given('que não login não gerou um token de acesso válido', () => {
  token = 'token_invalido'
})

When('tento a requisição GET para o endpoint do dashboard de fechamentos', function () { 
  return cy.request({
    method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/fechamentos/situacoes?AnoLetivo=${Cypress.env('ANO_LETIVO')}&DreId=${Cypress.env('DRE_CODIGO')}&UeId=${Cypress.env('UE_CODIGO')}`,
        headers: {
          accept: 'text/plain',
          'Authorization': 'Bearer token_invalido'
        },
        failOnStatusCode: false,
    }).as('response')
})

Then('retorna o status 401 sem as situações', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})
