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

// Reiniciar senha de usuário válido
When('envio uma requisição PUT para reiniciar a senha', function () {
  return cy.request({
    method: 'PUT',
    url: `${Cypress.config('baseUrl')}/api/v1/autenticacao/${Cypress.env('LOGIN_PRIMEIRO_ACESSO')}/reiniciar-senha`,
    headers: {
      accept: 'text/plain',
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: {
      dreCodigo: Cypress.env('DRE_CODIGO'),
      ueCodigo: Cypress.env('UE_CODIGO'),
    },
  }).as('response')
})

Then('deve confirmar com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body.deveAtualizarEmail).to.be.false
    expect(response.body.mensagem).to.not.be.empty
  })
})

// Não reiniciar para usuário inválido
When('envio uma requisição PUT para reiniciar a senha de usuário inválido', function () {
  return cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/autenticacao/${Cypress.env('USUARIO_INVALIDO')}/reiniciar-senha`,
      headers: {
      accept: 'text/plain',
      'Content-Type': 'application/json',
    },
      body: {
      dreCodigo: Cypress.env('DRE_CODIGO'),
      ueCodigo: Cypress.env('UE_CODIGO')
      },
    failOnStatusCode: false,
  }).as('response')
})

Then('retorna o status 601 que não foi possível reiniciar deste usuário', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)
    expect(response.body.existemErros).to.be.true
    expect(response.body.mensagens).to.include("Não foi possível reiniciar a senha deste usuário")
  })
})

// Código da DRE deve ser obrigatório
When('envio uma requisição PUT sem a DRE para reiniciar a senha', function () {
  return cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/autenticacao/${Cypress.env('LOGIN_PRIMEIRO_ACESSO')}/reiniciar-senha`,
    headers: {
      accept: 'text/plain',
      'Content-Type': 'application/json',
    },
      body: {      
        ueCodigo: Cypress.env('UE_CODIGO')
      },
    failOnStatusCode: false,
  }).as('response')
})

Then('retorna o status 601 que o código é obrigatório', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
  })
})