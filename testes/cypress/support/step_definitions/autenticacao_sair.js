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

// Confirmar o logout do usuário
When('envio uma requisição GET para deslogar', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + '/api/v1/autenticacao/sair',
    headers: {
      accept: 'text/plain',
      'Authorization': `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 de sucesso', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.be.empty
  })
})

// Não confirmar quando estiver deslogado
When('tento a requisição GET para deslogar', function () { 
  cy.request({
   method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/autenticacao/sair`,
      headers: {
        accept: 'text/plain',
        Authorization: 'Bearer token_invalido' },
      failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 ', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
    expect(response.body).to.be.empty
  })
})


