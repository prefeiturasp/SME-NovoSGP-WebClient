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

// Retorna os dados do usuário após autenticação
When('envio uma requisição GET para o endpoint de dados da autenticação', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/usuarios/meus-dados`,
    headers: {
      accept: 'text/plain',
      'Authorization': `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com informações do usuário', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.have.property('nome').and.to.not.be.empty
    expect(response.body).to.have.property('cpf').and.to.not.be.empty
    expect(response.body).to.have.property('codigoRf')
    expect(response.body).to.have.property('empresa')
    expect(response.body).to.have.property('email').and.to.not.be.empty 
  })
})

// Não retorna dados para usuário não autenticado
When('tento a requisição GET para o endpoint', function () { 
  cy.request({
   method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/usuarios/meus-dados`,
      headers: {
           accept: 'text/plain',
           'Authorization': 'Bearer token_invalido' },
      failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem dados do usuário', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401) 
  })
})

