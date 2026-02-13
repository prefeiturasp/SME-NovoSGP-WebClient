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

// Listar todas as pendências por id
When('informo o id da pendência', function () {   
})

Then('envio uma requisição GET para o endpoint', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/fechamentos/acompanhamentos/turmas/pendencias/${Cypress.env('FECHAMENTO_ACOMPANHAMENTO_PENDENCIA_ID')}/detalhamentos`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('a reposta deve conter status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(204)    
  })
})

// Não permitir acessar sem autenticação
Given('que não possuo um token de acesso válido', () => {
  token = 'token_invalido'
})

When('informo somente o id da pendência', function () {   
})

Then('tento o envio uma requisição GET para o endpoint', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/fechamentos/acompanhamentos/turmas/pendencias/${Cypress.env('FECHAMENTO_ACOMPANHAMENTO_PENDENCIA_ID')}/detalhamentos`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('a resposta deve ter o status 401 sem detalhamento da pendência', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Não listar pendência sem id informado
When('não informo o id da pendência', function () {   
})

Then('envio uma requisição GET para o endpoint sem id válido', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/fechamentos/acompanhamentos/turmas/pendencias/${Cypress.env('FECHAMENTO_ACOMPANHAMENTO_PENDENCIA_ID_INVALIDO')}/detalhamentos`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('a resposta deve ter o status 601 com a mensagem de erro de id da pendência não informado', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)
    expect(response.body).to.deep.equal({
          "mensagens": [
              "O id da pendência deve ser informado."
          ],
          "existemErros": true                 
    })    
  })
})