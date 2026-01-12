import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps'

let token

Before(() => {
  cy.gerar_token_cp().then((token_valido) => {
    token = token_valido
  })
})

Given('que possuo um token de acesso válido', function () {
  expect(token, 'valido').to.exist
})

// Retorna dados através da situação do conselho de classe
When('envio uma requisição GET', function () { 
  cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/fechamentos/acompanhamentos/turmas/${Cypress.env('TURMA_CODIGO_FECHAMENTO')}/conselho-classe/bimestres/${Cypress.env('BIMESTRE_CODIGO')}?situacaoConselhoClasse=${Cypress.env('SITUACAO_CONSELHO_CLASSE_ID')}`,
        headers: {
          accept: 'text/plain',
          'Authorization': `Bearer ${token}`
      },
    failOnStatusCode: false,
  }).as('response')
})

Then('retorna o status 200 com dados através da situação do conselho de classe', function () {
  cy.get('@response').then((response) => {
  expect(response.status).to.eq(200)
  })
})

// Não retorna dados com código da turma inválido
When('envio uma requisição GET sem turma', function () { 
  cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/fechamentos/acompanhamentos/turmas/${Cypress.env('TURMA_CODIGO_FECHAMENTO_INVALIDO')}/conselho-classe/bimestres/${Cypress.env('BIMESTRE_CODIGO')}?situacaoConselhoClasse=${Cypress.env('SITUACAO_CONSELHO_CLASSE_ID')}`,
      headers: {
        accept: 'text/plain',
        'Authorization': `Bearer ${token}`
      },
    failOnStatusCode: false,
  }).as('response')
})

Then('retorna o status 500 sem dados da turma no bimestre', function () {
  cy.get('@response').then((response) => {
  expect(response.status).to.eq(500)
  })
})

// Não retorna dados com código do bimestre inválido
When('envio uma requisição GET sem bimestre', function () { 
  cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/fechamentos/acompanhamentos/turmas/${Cypress.env('TURMA_CODIGO_FECHAMENTO')}/conselho-classe/bimestres/${Cypress.env('BIMESTRE_CODIGO_INVALIDO')}?situacaoConselhoClasse=${Cypress.env('SITUACAO_CONSELHO_CLASSE_ID')}`,
      headers: {
        accept: 'text/plain',
        'Authorization': `Bearer ${token}`
     },
    failOnStatusCode: false,
  }).as('response')
})

Then('retorna o status 601 sem dados da turma no bimestre', function () {
  cy.get('@response').then((response) => {
  expect(response.status).to.eq(601)
  })
})

// Não retorna dados com conselho de classe inválido
When('envio uma requisição GET sem a classe', function () { 
  cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/fechamentos/acompanhamentos/turmas/${Cypress.env('TURMA_CODIGO_FECHAMENTO_INVALIDO')}/conselho-classe/bimestres/${Cypress.env('BIMESTRE_CODIGO_INVALIDO')}?situacaoConselhoClasse=${Cypress.env('SITUACAO_CONSELHO_CLASSE_ID_INVALIDO')}`,
      headers: {
        accept: 'text/plain',
        'Authorization': `Bearer ${token}`
      },
    failOnStatusCode: false,
  }).as('response')
})

Then('retorna o status 422 sem dados do conselho de classe', function () {
  cy.get('@response').then((response) => {
  expect(response.status).to.eq(422)
  })
})

// Não retorna dados sem usuário autenticado
Given('que não possuo um token de acesso válido', () => {
})

When('tento a requisição GET', function () { 
  cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/fechamentos/acompanhamentos/turmas/${Cypress.env('TURMA_CODIGO_FECHAMENTO')}/conselho-classe/bimestres/${Cypress.env('BIMESTRE_CODIGO')}?situacaoConselhoClasse=${Cypress.env('SITUACAO_CONSELHO_CLASSE_ID')}`,
      headers: {
        accept: 'text/plain',
        'Authorization': 'Bearer token-invalido'
    },
  failOnStatusCode: false,
  }).as('response')
})

Then('não retorna os dados mostrando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})
