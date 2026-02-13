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

Given('que não gerou um token de acesso válido', () => {
})

// Retornar os valores do ano letivo
When('insiro o ano letivo', function () {   
})

Then('envio uma requisição GET para o endpoint de sinteses', function () { 
  return cy.gerar_token().then((token) => {
      return cy.request({
          method: 'GET',
          url: Cypress.config('baseUrl') + `/api/v1/sinteses/${Cypress.env('ANO_LETIVO')}`,
          headers: {
            accept: 'text/plain',
            Authorization: `Bearer ${token}`
          },
          failOnStatusCode: false
      }).as('response')
  })
})

Then('retorna o status 200 com os valores', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.deep.equal([
      { id: 1, valor: "\tFrequente" },
      { id: 2, valor: "\tNão Frequente" }
    ])
  })
})

// Não acessar a versão sem autenticação
When('tento a requisição GET para o endpoint de sinteses', function () { 
  cy.request({
   method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/sinteses/${Cypress.env('ANO_LETIVO')}`,
      headers: {
        accept: 'text/plain',
        Authorization: 'Bearer token_invalido' },
      failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem valores', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401) 
  })
})


// Ano letivo deve ser obrigatório nas sinteses
When('envio uma requisição GET de sinteses sem ano letivo', function () { 
  return cy.gerar_token().then((token) => {
      return cy.request({
          method: 'GET',
          url: Cypress.config('baseUrl') + `/api/v1/sinteses/`,
          headers: {
            accept: 'text/plain',
            Authorization: `Bearer ${token}`
          },
          failOnStatusCode: false
      }).as('response')
  })
})

Then('retorna o status 500', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)
  })
})

// Ano letivo deve ser válido nas sinteses
When('insiro o ano letivo inválido', function () {   
})

Then('tento o envio uma requisição GET de sinteses', function () { 
  return cy.gerar_token().then((token) => {
      return cy.request({
          method: 'GET',
          url: Cypress.config('baseUrl') + `/api/v1/sinteses/${Cypress.env('ANO_LETIVO_INVALIDO')}`,
          headers: {
            accept: 'text/plain',
            Authorization: `Bearer ${token}`
          },
          failOnStatusCode: false
      }).as('response')
  })
})

Then('retorna o status 601 com a mensagem de erro', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)
    expect(response.body).to.deep.equal({
      mensagens: [
        "Não foi possível obter as sínteses"
      ],
      existemErros: true
    })
  })
})