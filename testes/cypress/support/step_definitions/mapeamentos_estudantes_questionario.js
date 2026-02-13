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

// Retorna os dados referente ao ID do questionário
When('envio uma requisição GET', function () { 
  const questionarioId = Cypress.env('QUESTIONARIO_ID')
  cy.request({
    method: 'GET',
      url: `${Cypress.config('baseUrl')}/api/v1/mapeamentos-estudantes/questionarios/${questionarioId}/questoes`,
        qs: { mapeamentoEstudanteId },
        headers: {
          accept: 'application/json',
          'Authorization': `Bearer ${token}`
      },
    failOnStatusCode: false
 }).then((response) => {
    cy.log(`Status: ${response.status}`)
    cy.log(`Response Body: ${JSON.stringify(response.body)}`)
      return cy.wrap(response)
  }).as('response')
})

Then('retorna o status 200 com dados referente ao ID do questionário', function () {
  cy.get('@response').then((response) => {
  expect(response.status).to.eq(200)
  })
})

// Não retorna dados sem usuário autenticado
Given('que não possuo um token de acesso válido', () => {
})

When('tento a requisição GET', function () { 
  const questionarioId = Cypress.env('QUESTIONARIO_ID')
  cy.request({
    method: 'GET',
      url: `${Cypress.config('baseUrl')}/api/v1/mapeamentos-estudantes/questionarios/${questionarioId}/questoes`,
      qs: { mapeamentoEstudanteId },
      headers: { 'Authorization': 'Bearer token_invalido' },
  failOnStatusCode: false
  }).as('response')
})

Then('não retorna os dados mostrando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})
