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

// Retornar dashboard de acompanhamento do aluno
When('envio uma requisição GET para o endpoint os dados', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dashboard/acompanhamento-aprendizagem/acompanhamento-aluno?AnoLetivo=${Cypress.env('ANO_LETIVO')}&DreId=${Cypress.env('DRE_CODIGO')}&UeId=${Cypress.env('UE_CODIGO')}&Semestre=${Cypress.env('SEMESTRE_CODIGO')}`,
    headers: {
        accept: 'text/plain',            
        'Authorization': `Bearer ${token}`
    },          
    failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 200 carregando o dashboard de acompanhamento do aluno', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
  })
})

// Ano letivo deve ser informado
When('tento a requisição GET para o endpoint sem o ano', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dashboard/acompanhamento-aprendizagem/acompanhamento-aluno?AnoLetivo=&DreId=${Cypress.env('DRE_CODIGO')}&UeId=${Cypress.env('UE_CODIGO')}&Semestre=${Cypress.env('SEMESTRE_CODIGO')}`,
    headers: {
        accept: 'text/plain',            
        'Authorization': `Bearer ${token}`
    },          
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 que o ano letivo deve ser informado', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
  })
})

// Semestre deve ser informado
When('tento a requisição GET sem o semestre', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dashboard/acompanhamento-aprendizagem/acompanhamento-aluno?AnoLetivo=${Cypress.env('ANO_LETIVO')}&DreId=${Cypress.env('DRE_CODIGO')}&UeId=123&Semestre=`,
    headers: {
        accept: 'text/plain',            
        'Authorization': `Bearer ${token}`
    },          
    failOnStatusCode: false 
  }).as('response')
})

Then('retorna o status 422 que o semestre deve ser informado', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
  })
})

// Não retorna dados de acompanhamento do aluno sem usuário autenticado
Given('que não login não gerou um token de acesso válido', () => {
  token = 'token_invalido'
})

When('tento a requisição GET para o endpoint do dashboard', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dashboard/acompanhamento-aprendizagem/acompanhamento-aluno?AnoLetivo=${Cypress.env('ANO_LETIVO')}&DreId=${Cypress.env('DRE_CODIGO')}&UeId=${Cypress.env('UE_CODIGO')}&Semestre=${Cypress.env('SEMESTRE_CODIGO')}`,
    headers: {
        accept: 'text/plain',
        'Authorization': 'Bearer token_invalido' },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem dados de acompanhamento', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})
