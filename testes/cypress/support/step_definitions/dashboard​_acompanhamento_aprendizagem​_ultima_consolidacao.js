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

// Retorna dashboard do ano letivo por última consolidação
When('envio uma requisição GET para o endpoint com os dados', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dashboard/acompanhamento-aprendizagem/ultima-consolidacao?anoLetivo=${Cypress.env('ANO_LETIVO')}`,
    headers: {
      accept: 'text/plain',            
      'Authorization': `Bearer ${token}`
    },          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 200 carregando o dashboard do ano letivo por última consolidação', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
  })
})

// Ano letivo da última consolidação deve ser informado
When('tento a requisição GET para o endpoint sem o ano', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dashboard/acompanhamento-aprendizagem/ultima-consolidacao?anoLetivo=`,
    headers: {
      accept: 'text/plain',            
      'Authorization': `Bearer ${token}`
    },          
    failOnStatusCode: false 
  }).as('response')
})

Then('retorna o status 422 que o ano letivo da última consolidação deve ser informado', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
  })
})

// Ano letivo deve ser inválido
When('tento a requisição GET com ano inválido', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dashboard/acompanhamento-aprendizagem/ultima-consolidacao?anoLetivo=${Cypress.env('ANO_LETIVO_INVALIDO')}`,
    headers: {
      accept: 'text/plain',            
      'Authorization': `Bearer ${token}`
    },          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 500 que o ano letivo deve ser inválido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)
  })
})

// Não busca dashboard sem usuário autenticado
Given('que não login não gerou um token de acesso válido', () => {
  token = 'token_invalido'
})

When('tento a requisição GET para o endpoint do dashboard', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dashboard/acompanhamento-aprendizagem/ultima-consolidacao?anoLetivo=${Cypress.env('ANO_LETIVO')}`,
    headers: {
      accept: 'text/plain',
      'Authorization': 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem buscar dashboard de acompanhamento', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})
