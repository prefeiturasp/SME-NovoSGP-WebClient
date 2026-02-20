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

// Retorna a quantidade do apanhado geral
When('envio uma requisição GET para o endpoint de apanhado geral', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/acompanhamento/turmas/apanhado-geral?TurmaId=${Cypress.env('TURMA_CODIGO_APANHADO_GERAL')}&Semestre=${Cypress.env('SEMESTRE_CODIGO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna a quantidade com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.have.property('turmaId')
    expect(response.body).to.have.property('semestre')
    expect(response.body).to.have.property('apanhadoGeral')
    expect(response.body).to.have.property('acompanhamentoTurmaId')
    expect(response.body).to.have.property('auditoria')
  })
})

// Turma é obrigatório na consulta do apanhado geral
When('envio uma requisição GET para o endpoint de apanhado sem a turma', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/acompanhamento/turmas/apanhado-geral?TurmaId=&Semestre=${Cypress.env('SEMESTRE_CODIGO')}`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 que a turma é inválida', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    expect(response.body).to.have.property('existemErros', true)
    expect(response.body).to.have.property('mensagens').that.is.an('array').and.not.empty
    expect(response.body.mensagens[0]).to.match(/The value '.*' is invalid\./)    
  })
})

// Semestre é obrigatório na consulta do apanhado geral
When('envio uma requisição GET para o endpoint de apanhado sem o semestre', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/acompanhamento/turmas/apanhado-geral?TurmaId=${Cypress.env('TURMA_CODIGO_APANHADO_GERAL')}&Semestre=`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 que o semestre é inválido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    expect(response.body).to.have.property('existemErros', true)
    expect(response.body).to.have.property('mensagens').that.is.an('array').and.not.empty
    expect(response.body.mensagens[0]).to.match(/The value '.*' is invalid\./)    
  })
})

// Não retorna quantidade do apanhado geral sem autenticação
Given('que não possuo um token de acesso válido', () => {
})

When('tento a requisição GET para o endpoint de apanhado geral', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/acompanhamento/turmas/apanhado-geral?TurmaId=${Cypress.env('TURMA_CODIGO_APANHADO_GERAL')}&Semestre=${Cypress.env('SEMESTRE_CODIGO')}`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('não retorna a quantidade do apanhado mostrando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})
