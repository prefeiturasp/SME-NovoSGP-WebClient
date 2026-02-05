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

Given('que não possuo um token de acesso válido', () => {
})

// Confirmar que o e-mail foi autenticado
When('envio uma requisição PUT para autenticar o e-mail', function () { 
  return cy.gerar_email_usuario().then((emailGerado) => {
      cy.log(`Email gerado e alterado: ${emailGerado}`)
    return cy.request({
      method: 'PUT',
      url: Cypress.config('baseUrl') + `/api/v1/usuarios/autenticado/email`,
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json-patch+json',
        'Authorization': `Bearer ${token}`
      },
      body: {
        novoEmail: emailGerado,
      },
    failOnStatusCode: false  })  
  }).as('response')
})

Then('retorna o status 200 confirmando', function () {
  cy.get('@response').then((response) => {
   expect(response.status).to.eq(200)     
  })
})

// E-mail para o usuário deve ser informado
When('envio uma requisição PUT com usuário', function () {     
  return cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/usuarios/autenticado/email`,
    headers: {
      accept: '*/*',
        'Content-Type': 'application/json-patch+json',
        'Authorization': `Bearer ${token}`
      },
      body: {
        novoEmail: ' ',
      },
    failOnStatusCode: false  
  }).as('response')
})

Then('não informo o e-mail', function () {     
})

Then('retorna o status 422 que o e-mail deve informado', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
      expect(response.body).to.include({
        existemErros: true,
      })
    expect(response.body.mensagens).to.be.an('array').that.includes('O novo e-mail deve ser informado.')
    expect(response.body.mensagens).to.be.an('array').that.includes('E-mail inválido.')
  })
})

// Não autenticar e-mail inválido
When('envio uma requisição PUT para autenticar com usuário', function () {   
  return cy.gerar_email_usuario().then((emailGerado) => {
        cy.log(`Email gerado e alterado: ${emailGerado}`)
    return cy.request({
      method: 'PUT',
      url: Cypress.config('baseUrl') + `/api/v1/usuarios/autenticado/email`,
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json-patch+json',
        'Authorization': `Bearer ${token}`
      },
      body: {
        novoEmail: Cypress.env('EMAIL_INVALIDO'),
      },
    failOnStatusCode: false  })  
  }).as('response')
})

Then('insiro e-mail inválido', function () {     
})

Then('retorna o status 422 que o e-mail é inválido', function () {
  cy.get('@response').then((response) => {
  expect(response.status).to.eq(422)
    expect(response.body).to.include({
      existemErros: true,
    })
  expect(response.body.mensagens).to.be.an('array').that.includes('E-mail inválido.')
  })      
})

// Não autenticar usuário deslogado
When('tento a requisição PUT para autenticar o e-mail', function () { 
  return cy.gerar_email_usuario().then((emailGerado) => {
      cy.log(`Email gerado e alterado: ${emailGerado}`)
    return cy.request({
      method: 'PUT',
      url: Cypress.config('baseUrl') + `/api/v1/usuarios/autenticado/email`,
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json-patch+json',
        'Authorization': 'Bearer token_invalido',
      },
      body: {
        novoEmail: emailGerado,
      },
    failOnStatusCode: false  })  
  }).as('response')
})

Then('retorna o status 401 de não autorizado', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401) 
  })
})

