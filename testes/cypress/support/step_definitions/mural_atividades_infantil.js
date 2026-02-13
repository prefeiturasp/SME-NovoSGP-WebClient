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

// Retorna mural de atividades da turma
When('envio uma requisição GET para o endpoint do mural', function () { 
  cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/mural/atividades/infantil?aulaId=${Cypress.env('AULA_CODIGO')}`,
      headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna as atividades da turma com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
  })
})

// Não retorna com turma inválida
When('envio a requisição GET para o endpoint com a aula inválida', function () { 
  cy.request({
    method: 'GET',
    url: `${Cypress.config('baseUrl')}/api/v1/mural/atividades/infantil?aulaId=${Cypress.env('AULA_CODIGO_INVALIDO')}`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('não retorna as atividades exibindo mensagem para informar', function () {
  cy.get('@response').then((response) => {
   expect(response.status).to.eq(601)
    expect(response.body).to.include({
      existemErros: true,
        })
      expect(response.body.mensagens).to.be.an('array').that.includes('É necessário informar o identificador da aula para consulta as Atividades do Infantil')          
  })
})

// Não retorna as atividades sem usuário autenticado
Given('que não possuo um token de acesso válido', () => { 
})

When('tento requisição GET para o endpoint do mural', function () { 
  cy.request({
    method: 'GET',
    url: `${Cypress.config('baseUrl')}/api/v1/mural/atividades/infantil?aulaId=${Cypress.env('AULA_CODIGO')}`,
    headers: {
      accept: '*/*',
      Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('não retorna as atividades mostrando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})
