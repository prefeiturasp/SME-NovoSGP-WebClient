import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps'

let token

Before(() => {
  cy.gerar_token().then((token_valido) => {
    token = token_valido
  })
})

Given('que o usuário é autenticado', function () {
  expect(token, 'valido').to.exist
})

Given('que o usuário não é autenticado', () => {
})

// Deve inserir um novo e-mail para o usuário
When('envio uma requisição PUT para alterar o e-mail', function () { 
  return cy.gerar_email_usuario().then((emailGerado) => {
        cy.log(`Email gerado e alterado: ${emailGerado}`)
      return cy.request({
        method: 'PUT',
          url: Cypress.config('baseUrl') + `/api/v1/usuarios/${Cypress.env('LOGIN_PRIMEIRO_ACESSO')}/email`,
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

Then('retorna o status 200 com o novo e-mail', function () {
  cy.get('@response').then((response) => {
   expect(response.status).to.eq(200)
  
  cy.log(`Status da resposta: ${response.status}`)        
  })
})

// Não inserir e-mail para usuário inexistente
When('envio uma requisição PUT', function () { 
  return cy.gerar_email_usuario().then((emailGerado) => {
      cy.log(`Email gerado e alterado: ${emailGerado}`)
    return cy.request({
        method: 'PUT',
        url: Cypress.config('baseUrl') + `/api/v1/usuarios/${Cypress.env('USUARIO_INEXISTENTE')}/email`,
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

Then('o usuário inserido é inexistente', function () {     
})

Then('retorna o status 601 informando erro ao obter dados', function () {
  cy.get('@response').then((response) => {
   expect(response.status).to.eq(601)  
    expect(response.body).to.include({
      existemErros: true,
    })
    expect(response.body.mensagens).to.be.an('array').that.includes('Ocorreu um erro ao obter os dados/perfis do usuário no EOL.')
  })      
})

// E-mail para o usuário deve ser informado
When('envio uma requisição PUT com usuário', function () {     
  return cy.request({
      method: 'PUT',
      url: Cypress.config('baseUrl') + `/api/v1/usuarios/${Cypress.env('LOGIN_PRIMEIRO_ACESSO')}/email`,
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


Then('não informo um novo e-mail', function () {     
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

// Não permitir e-mail inválido
When('envio uma requisição PUT para alterar', function () { 
  return cy.gerar_email_usuario().then((emailGerado) => {
        cy.log(`Email gerado e alterado: ${emailGerado}`)
    return cy.request({
        method: 'PUT',
        url: Cypress.config('baseUrl') + `/api/v1/usuarios/${Cypress.env('LOGIN_PRIMEIRO_ACESSO')}/email`,
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

// Não atualizar e-mail sem autenticação
When('tento a requisição PUT para alterar o e-mail', function () { 
  return cy.gerar_email_usuario().then((emailGerado) => {
      cy.log(`Email gerado e alterado: ${emailGerado}`)
    return cy.request({
        method: 'PUT',
        url: Cypress.config('baseUrl') + `/api/v1/usuarios/${Cypress.env('LOGIN_PRIMEIRO_ACESSO')}/email`,
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

