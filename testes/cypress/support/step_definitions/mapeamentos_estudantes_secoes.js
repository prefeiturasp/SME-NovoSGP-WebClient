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

// Retornar os dados do mapeamento do estudante
When('envio uma requisição GET', function () { 
  const questionarioId = Cypress.env('QUESTIONARIO_ID')
  cy.request({
   method: 'GET',
      url: `${Cypress.config('baseUrl')}/api/v1/mapeamentos-estudantes/secoes`,
      qs: { mapeamentoEstudanteId },
      headers: {
        accept: 'application/json',
        'Authorization': `Bearer ${token}`
      },
        failOnStatusCode: false
      }).then((response) => {
        cy.log(`Status: ${response.status}`)
        cy.log(`Response Body: ${JSON.stringify(response.body)}`)
            
        return cy.wrap(response).then((res) => {
          expect(res.status).to.equal(200)
        return res
    })
  }).as('response')
})

Then('retorna o status 200 com dados do mapeamento do estudante', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
  })
})

// Não retorna dados sem usuário autenticado
Given('que não possuo um token de acesso válido', () => {
})

When('tento a requisição GET', function () { 
  const mapeamentoEstudanteId = Cypress.env('MAPEAMENTO_ESTUDANTE_ID')
  cy.request({
    method: 'GET',
      url: `${Cypress.config('baseUrl')}/api/v1/mapeamentos-estudantes/secoes`,
      qs: { mapeamentoEstudanteId },
      headers: { 
        'Authorization': 'Bearer token_invalido'
      },
    failOnStatusCode: false
  }).as('response')
})

Then('não retorna os dados mostrando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})
