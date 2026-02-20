import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps'

let token

Before(() => {
  cy.gerar_token_cp().then((token_valido) => {
    token = token_valido
  })
})

Given('que possuo um token de acesso válido', function () {
  expect(token, 'valido').to.exist
})

// Carregar o dashboard do conselho de classe com notas finais
When('envio uma requisição GET', function () { 
  cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/dashboard/fechamentos/conselhos-classes/notas-finais?AnoLetivo=${Cypress.env('ANO_LETIVO')}&DreId=${Cypress.env('DRE_CODIGO')}&UeId=${Cypress.env('UE_CODIGO')}`,
        headers: {
        accept: 'text/plain',
        'Authorization': `Bearer ${token}`
      },
    failOnStatusCode: false,
  }).as('response')
})

Then('retorna o dashboard do conselho de classe de notas finais com status 200', function () {
  cy.get('@response').then((response) => {
  expect(response.status).to.eq(200)
  })
})

// Não retorna notas finais de fechamento sem usuário autenticado
Given('que não possuo um token de acesso válido', () => {
})

When('tento a requisição GET', function () { 
  cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/dashboard/fechamentos/conselhos-classes/notas-finais?AnoLetivo=${Cypress.env('ANO_LETIVO')}&DreId=${Cypress.env('DRE_CODIGO')}&UeId=${Cypress.env('UE_CODIGO')}`,
      headers: {
        accept: 'text/plain',
        'Authorization': 'Bearer token_invalido'
    },
  failOnStatusCode: false,
  }).as('response')
})

Then('não retorna o dashboard do conselho de classe de notas finais mostrando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})
