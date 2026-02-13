import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps'

let token

Before(() => {
  cy.gerar_token().then((token_valido) => {
    token = token_valido
  })
})

Given('que minhas credenciais geraram um token válido', function () {
  expect(token, 'valido').to.exist
})

// Realizar o primeiro acesso do usuário
When('envio uma requisição POST para o endpoint de primeiro acesso', function () { 
  return cy.gerar_senha().then((novaSenha) => {
    return cy.request({
      method: 'POST',
      url: Cypress.config('baseUrl') + '/api/v1/autenticacao/primeiro-acesso',
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json-patch+json',
        Authorization: `Bearer ${token}`
      },
      body: {
        'usuario': Cypress.env('LOGIN_PRIMEIRO_ACESSO'),
        'novaSenha': novaSenha,
        'confirmarSenha': novaSenha
      },
      failOnStatusCode: false,
      timeout: 60000
    }).as('response')
  })
})


Then('retorna a confirmação no status 200', function () {
  cy.get('@response').then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body).to.have.property('autenticado')
          expect(response.body).to.have.property('modificarSenha')
          expect(response.body).to.have.property('perfisUsuario')
          expect(response.body.perfisUsuario).to.have.property('perfis').that.is.an('array')
          expect(response.body).to.have.property('dataHoraExpiracao')
          expect(response.body).to.have.property('token')
          expect(response.body).to.have.property('usuarioId')
          expect(response.body).to.have.property('usuarioRf')
          expect(response.body).to.have.property('usuarioLogin')
          expect(response.body).to.have.property('contratoExterno')   
          expect(response.body).to.have.property('administradorSuporte')
  })
})

// Confirmação deve ser igual a nova senha
Given('que insiro minhas credenciais', function () {
  expect(token, 'valido').to.exist
})

Then('a confirmação não é igual a senha', function () { 
})

When('tento a requisição POST para o endpoint de primeiro acesso', function () { 
  return cy.gerar_senha().then((novaSenha) => {
    return cy.request({
      method: 'POST',
      url: Cypress.config('baseUrl') + '/api/v1/autenticacao/primeiro-acesso',
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json-patch+json',
          Authorization: `Bearer ${token}`               
      },
       body: {
        'usuario': Cypress.env('LOGIN_PRIMEIRO_ACESSO'),
        'novaSenha': novaSenha,
        'confirmarSenha': Cypress.env('SENHA')
      },
      failOnStatusCode: false 
    }).as('response')
  })
})

Then('retorna o status 422 com a mensagem de senhas diferentes', function () {
  cy.get('@response').then((response) => {
          expect(response.status).to.eq(422)
          expect(response.body).to.include({
              existemErros: true
            })
          expect(response.body.mensagens).to.be.an('array').that.includes("As senhas não são iguais")      
  })
})

// Não permitir cadastro de senha vazia
Given('que insiro as credenciais sem a nova senha', function () {
  expect(token, 'valido').to.exist
})

When('tento a requisição POST para o endpoint com perfil inválido', function () { 
  return cy.gerar_senha().then((novaSenha) => {
    return cy.request({
      method: 'POST',
      url: Cypress.config('baseUrl') + '/api/v1/autenticacao/primeiro-acesso',
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json-patch+json',
        Authorization: `Bearer ${token}`
      },
        body: {
          'usuario': Cypress.env('LOGIN_PRIMEIRO_ACESSO'),
          'novaSenha': ' ',
          'confirmarSenha': ' ',
      },
      failOnStatusCode: false 
    }).as('response')
  })
})


Then('retorna o status 422 com a mensagem de senha obrigatória', function () {
  cy.get('@response').then((response) => {
          expect(response.status).to.eq(422)
          expect(response.body).to.include({
              existemErros: true
            })
          expect(response.body.mensagens).to.be.an('array').that.includes("É necessário informar a nova senha.")
          expect(response.body.mensagens).to.include("A senha deve ter no minimo 8 caracteres.")    
    })
})

// Não realizar o primeiro acesso sem autenticação
Given('que minhas credenciais não autenticaram', () => {  
})

When('tento a requisição PUT para o endpoint sem usuário', function () { 
  cy.request({
    method: 'POST',
      url: Cypress.config('baseUrl') + '/api/v1/autenticacao/primeiro-acesso',
      headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido' },
      failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})
