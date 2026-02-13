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

// Usuário logado deve possuir perfil selecionado
When('envio uma requisição GET para o endpoint de perfil', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/usuarios/perfis`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com perfil do usuário', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body[0]).to.have.property('key').and.not.be.empty
    expect(response.body[0]).to.have.property('value').and.not.be.empty
  })
})

// Não acessa sem autenticação
When('tento a requisição GET para o endpoint de perfil', function () { 
  cy.request({
   method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/usuarios/perfis`,
      headers: {
           accept: 'text/plain',
           Authorization: 'Bearer token_invalido' },
      failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem perfil associado', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401) 
  })
})

