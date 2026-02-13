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

// Listar as informações de perfil após autenticação
When('envio uma requisição GET para o endpoint de listar perfis', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/autenticacao/${Cypress.env('LOGIN_ADM_COTIC')}/perfis/listar`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna os dados de todos perfis do usuário com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)            
    expect(response.body[0]).to.have.property('id')
    expect(response.body[0]).to.have.property('criadoEm')
    expect(response.body[0]).to.have.property('criadoPor')
    expect(response.body[0]).to.have.property('alteradoEm')
    expect(response.body[0]).to.have.property('alteradoPor')
    expect(response.body[0]).to.have.property('alteradoRF')
    expect(response.body[0]).to.have.property('criadoRF')
    expect(response.body[0]).to.have.property('codigoPerfil')
    expect(response.body[0]).to.have.property('nomePerfil')
    expect(response.body[0]).to.have.property('ordem')
    expect(response.body[0]).to.have.property('tipo')
  })
})

// Sem dados de perfis quando usuário não está autenticado
Given('que não login não gerou um token de acesso válido', () => {
  token = 'token_invalido'
})

When('tento a requisição GET para o endpoint de listar perfis', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/autenticacao/${Cypress.env('LOGIN_ADM_COTIC')}/perfis/listar`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem dados de perfis', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})
