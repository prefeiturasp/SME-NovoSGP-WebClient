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

// Listar todas as pendências
When('envio uma requisição GET para o endpoint buscar a lista de pendencias', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/pendencias/listar`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

// Listar pendências da turma
When('envio uma requisição GET para o endpoint de pendências da turma', () => {
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/pendencias/listar?${Cypress.env('TURMA_CODIGO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

// Listar por tipo de pendências
When('envio uma requisição GET para o endpoint por tipo de pendências', () => {
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/pendencias/listar?${Cypress.env('TIPO_PENDENCIA_ID')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

// Listar por turma e tipo de pendências
When('envio uma requisição GET para o endpoint por turma com tipo de pendência', () => {
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/pendencias/listar?${Cypress.env('TURMA_CODIGO')}&${Cypress.env('TIPO_PENDENCIA_ID')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('o corpo da resposta deve conter dados de pendências com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)    
  })
})

// Não permitir acessar sem autenticação
Given('que não possuo um token de acesso válido', () => {
  token = 'token_invalido'
})

When('tento enviar uma requisição GET para o endpoint', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/pendencias/listar`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('a lista de pendencias deve ter o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})
