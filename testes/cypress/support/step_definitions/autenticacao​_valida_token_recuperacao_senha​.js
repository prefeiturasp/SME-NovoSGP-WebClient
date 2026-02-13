import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps'

let token

Before(() => {
  cy.gerar_token().then((token_valido) => {
    token = token_valido
  })
})

Given('que solicito a recuperação de senha', function () {
  expect(token, 'valido').to.exist
})

// Token informado deve ser válido
When('envio uma requisição GET com token válido', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/autenticacao/valida-token-recuperacao-senha/${Cypress.env('TOKEN_VALIDO')}`,
    headers: {
      accept: 'text/plain',
      'Authorization': `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')  
})

Then('retorna o status 200 de sucesso da solicitação', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
  })
})

// Token informado deve ser inválido
When('tento a requisição GET com token inválido', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/autenticacao/valida-token-recuperacao-senha/${Cypress.env('TOKEN_INVALIDO')}`,
    headers: {
      accept: 'text/plain',
      'Authorization': 'Bearer token_invalido'
          },
    failOnStatusCode: false
  }).as('response') 
})

Then('retorna o status 422', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    expect(response.body).to.include({
        existemErros: true
      })
    expect(response.body.mensagens[0]).to.match(/The value .* is not valid/)
  })
})


