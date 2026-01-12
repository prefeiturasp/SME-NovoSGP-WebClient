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

// Solicitar recuperação de senha para usuário válido
When('envio uma requisição POST para recuperar a senha', function () { 
  cy.request({
    method: 'POST',
      url: Cypress.config('baseUrl') + `/api/v1/autenticacao/solicitar-recuperacao-senha?login=${Cypress.env('LOGIN_PRIMEIRO_ACESSO')}`,
      headers: {
        accept: 'text/plain',
        'Authorization': `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})

Then('solicita recuperação de senha para usuário válido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.include('@')
  })
})

// Usuário deve ser informado para recuperação de senha
When('envio uma requisição POST de recuperar a senha', function () { 
  cy.request({
    method: 'POST',
      url: Cypress.config('baseUrl') + `/api/v1/autenticacao/solicitar-recuperacao-senha?login=`,
      headers: {
        accept: 'text/plain',
        'Authorization': `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})

Then('o usuário deve ser informado para recuperação de senha', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)
  })
})  

// Não solicitar recuperação para usuário inválido
Given('que não possuo um token de acesso válido', () => { 
})

When('tento a requisição POST para recuperar a senha', function () { 
  cy.request({
    method: 'POST',
      url: Cypress.config('baseUrl') + `/api/v1/autenticacao/solicitar-recuperacao-senha?login=123`,
      headers: {
          accept: 'text/plain',
          'Authorization': `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})

Then('não solicita recuperação para usuário inválido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)
    expect(response.body.existemErros).to.be.true
    expect(response.body.mensagens).to.include('"Usuário ou RF não encontrado"')
  })
})  
