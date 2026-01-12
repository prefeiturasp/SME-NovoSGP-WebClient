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

// Necessário realizar o fechamento do bimestre
When('envio uma requisição POST', function () { 
  cy.request({
    method: 'POST',
      url: Cypress.config('baseUrl') + `/api/v1/fechamentos/finais`,
      headers: {
          accept: 'text/plain',
          'Authorization': `Bearer ${token}`
        },
        body: {
          "ehRegencia": true,
            "disciplinaId": `${Cypress.env('DISCIPLINA_CODIGO')}`,
            "itens": [
              {
                "alunoRf": `${Cypress.env('ALUNO_ID')}`,
                "componenteCurricularCodigo": `${Cypress.env('COMPONENTE_CURRICULAR_CODIGO')}`,
                "conceitoId": `${Cypress.env('CONCEITO_ID')}`,
                "nota": `${Cypress.env('NOTA')}`,
                "sinteseId": `${Cypress.env('SINTESE_ID')}`,
              }
                ],
            "turmaCodigo": `${Cypress.env('TURMA_CODIGO')}`,
        }, 
      timeout: 60000,
    failOnStatusCode: false,
  }).as('response')
})

Then('retorna o status 200 sendo necessário realizar o fechamento do bimestre', function () {
  cy.get('@response').then((response) => {
  expect(response.status).to.eq(200)
  })
})

// Não retornar dados com código da turma inválida
When('envio uma requisição POST com turma inválida', function () { 
  cy.request({
    method: 'POST',
      url: Cypress.config('baseUrl') + `/api/v1/fechamentos/finais`,
      headers: {
        accept: 'text/plain',
        'Authorization': `Bearer ${token}`
      },
        body: {
          "ehRegencia": true,
          "disciplinaId": `${Cypress.env('DISCIPLINA_CODIGO')}`,
          "itens": [
            {
              "alunoRf": `${Cypress.env('ALUNO_ID')}`,
              "componenteCurricularCodigo": `${Cypress.env('COMPONENTE_CURRICULAR_CODIGO')}`,
              "conceitoId": `${Cypress.env('CONCEITO_ID')}`,
              "nota": `${Cypress.env('NOTA')}`,
              "sinteseId": `${Cypress.env('SINTESE_ID')}`,
            }
              ],
            "turmaCodigo": `${Cypress.env('TURMA_CODIGO_INVALIDO')}`,
        }, 
    failOnStatusCode: false,
  }).as('response')
})

Then('não retorna os dados exibindo o status 601', function () {
  cy.get('@response').then((response) => {
  expect(response.status).to.eq(601)
  })
})

// Não retornar dados sem usuário autenticado
Given('que não possuo um token de acesso válido', () => {
})

When('tento a requisição POST', function () { 
  cy.request({
    method: 'GET',
    method: 'POST',
      url: Cypress.config('baseUrl') + `/api/v1/fechamentos/finais`,
      headers: {
        accept: 'text/plain',
        'Authorization': `Bearer ${token}`
      },
        body: {
          "ehRegencia": true,
          "disciplinaId": `${Cypress.env('DISCIPLINA_CODIGO')}`,
          "itens": [
            {
              "alunoRf": `${Cypress.env('ALUNO_ID')}`,
              "componenteCurricularCodigo": `${Cypress.env('COMPONENTE_CURRICULAR_CODIGO')}`,
              "conceitoId": `${Cypress.env('CONCEITO_ID')}`,
              "nota": `${Cypress.env('NOTA')}`,
              "sinteseId": `${Cypress.env('SINTESE_ID')}`,
            }
              ],
          "turmaCodigo": `${Cypress.env('TURMA_CODIGO_INVALIDO')}`,
          }, 
      failOnStatusCode: false,
  }).as('response')
})

Then('não retorna os dados mostrando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})
