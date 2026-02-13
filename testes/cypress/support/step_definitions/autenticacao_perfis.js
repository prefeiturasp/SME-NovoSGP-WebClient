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

// Selecionar perfil válido para o usuário
When('envio uma requisição PUT para o endpoint de autenticação do perfil', function () { 
  return cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/autenticacao/perfis/${Cypress.env('PERFIL_VALIDO')}`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o id com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.have.property('dataHoraExpiracao').and.not.be.empty
    expect(response.body).to.have.property('token').and.not.be.empty
    expect(response.body.ehPerfilProfessor).to.be.false
  })
})

// Não permitir selecionar perfil inválido
When('tento a requisição PUT para o endpoint com perfil inválido', function () { 
  return cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/autenticacao/perfis/${Cypress.env('PERFIL_INVALIDO')}`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
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

// Não selecionar perfil sem autenticação
Given('que não login não gerou um token de acesso válido', () => {
  token = 'token_invalido'
})

When('tento a requisição PUT para o endpoint de autenticação do perfil', function () { 
  return cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/autenticacao/perfis/${Cypress.env('PERFIL_VALIDO')}`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})
