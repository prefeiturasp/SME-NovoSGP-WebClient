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

Given('que não gerou um token de acesso válido', () => {
})

// Quantidade de dias letivos do calendário
When('envio uma requisição POST na api de dias letivos', function () { 
  return cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/calendarios/dias-letivos`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: {
       'dreId': `${Cypress.env('DRE_CODIGO')}`,
       'tipoCalendarioId': `${Cypress.env('TIPO_CALENDARIO')}`,
       'ueId': `${Cypress.env('UE_CODIGO')}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com a quantidade', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.have.property('dias')
    expect(response.body).to.have.property('estaAbaixoPermitido')
  })
})

// Não acessar dias letivos do calendário sem autenticação
When('tento uma requisição POST na api de dias letivos', function () { 
  return cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/calendarios/dias-letivos`,
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer token_invalido',
    },
    body: {
       'dreId': `${Cypress.env('DRE_CODIGO')}`,
       'tipoCalendarioId': `${Cypress.env('TIPO_CALENDARIO')}`,
       'ueId': `${Cypress.env('UE_CODIGO')}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 que não foi permitido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)    
  })
}) 
