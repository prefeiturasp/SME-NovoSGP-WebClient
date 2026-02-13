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

// Retorna avisos da aula
When('envio uma requisição GET para o endpoint o ID da aula', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/mural/avisos?aulaId=${Cypress.env('AULA_CODIGO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o mural de avisos com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
  })
})

// Não retorna avisos com código da turma vazio
When('tento a requisição GET para o endpoint sem o ID da aula', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/mural/avisos?aulaId=`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 sem o mural de avisos', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)    
  })
})

// Não retorna avisos sem usuário autenticado
Given('que não login não gerou um token de acesso válido', () => {
  token = 'token_invalido'
})

When('tento a requisição GET para o endpoint o ID da aula', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/mural/avisos?aulaId=${Cypress.env('AULA_CODIGO')}`,
    headers: {
     accept: '*/*',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem o mural de avisos', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})
