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

// Retorna o ano letivo atual
When('envio uma requisição GET para o endpoint buscar o ano letivo', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/anos-letivos/atribuicoes?consideraHistorico=false`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o ano atual com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200) 
    
    const anoAtual = new Date().getFullYear()

    expect(response.body).to.include(anoAtual)
  })
})

// Retorna os anos letivos anteriores e atual
When('envio uma requisição GET para o endpoint buscar os anos letivos', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/anos-letivos/atribuicoes?consideraHistorico=true`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna os anos anteriores e atual com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200) 
    
    const anoAtual = new Date().getFullYear()
    const anoAnterior = response.body.some(year => year < anoAtual)

    expect(anoAnterior).to.be.true
  })
})

// Não permitir acessar sem autenticação
Given('que não possuo um token de acesso válido', () => {
  token = 'token_invalido'
})

When('tento a requisição GET para o endpoint buscar o ano letivo', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/anos-letivos/atribuicoes?consideraHistorico=false`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('não consulta ano letivo mostrando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})
