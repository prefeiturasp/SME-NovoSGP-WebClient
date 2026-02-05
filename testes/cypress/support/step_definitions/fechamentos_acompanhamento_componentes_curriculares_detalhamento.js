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

// Retorna dados através da situação do conselho de classe e alunos
When('envio uma requisição GET', function () { 
  cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') +`/api/v1/fechamentos/acompanhamentos/turmas/${Cypress.env('TURMA_CODIGO_FECHAMENTO')}/conselho-classe/bimestres/${Cypress.env('BIMESTRE_CODIGO')}/alunos/${Cypress.env('ALUNO_ID')}/componentes-curriculares/detalhamento`,
        headers: {
            accept: 'text/plain',
            'Authorization': `Bearer ${token}`
      },
        failOnStatusCode: false,
    timeout: 1200000 
  }).as('response')
})

Then('retorna o status 200 através da situação do conselho de classe e alunos', function () {
  cy.get('@response').then((response) => {
  expect(response.status).to.eq(200)
  })
})

// Não retorna dados com código da turma inválida
When('envio uma requisição GET com turma inválida', function () { 
  cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/fechamentos/acompanhamentos/turmas/${Cypress.env('TURMA_CODIGO_FECHAMENTO_INVALIDO')}/conselho-classe/bimestres/${Cypress.env('BIMESTRE_CODIGO')}/alunos/${Cypress.env('ALUNO_ID')}/componentes-curriculares/detalhamento`,
      headers: {
        accept: 'text/plain',
        'Authorization': `Bearer ${token}`
      },
    failOnStatusCode: false, 
  }).as('response')
})

Then('não retorna os dados exibindo o status 601', function () {
  cy.get('@response').then((response) => {
  expect(response.status).to.eq(601)
  })
})

// Não retorna dados com código do bimestre inválido
When('envio uma requisição GET com bimestre inválido', function () { 
  cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') +`/api/v1/fechamentos/acompanhamentos/turmas/${Cypress.env('TURMA_CODIGO_FECHAMENTO')}/conselho-classe/bimestres/${Cypress.env('BIMESTRE_CODIGO_INVALIDO')}/alunos/${Cypress.env('ALUNO_ID')}/componentes-curriculares/detalhamento`,
      headers: {
        accept: 'text/plain',
        'Authorization': `Bearer ${token}`
      },
    failOnStatusCode: false,
  }).as('response')
})

Then('não retorna as informações exibindo o status 500', function () {
  cy.get('@response').then((response) => {
  expect(response.status).to.eq(500)
  })
})

// Não retorna dados sem usuário autenticado
Given('que não possuo um token de acesso válido', () => {
})

When('tento a requisição GET', function () { 
  cy.request({
    method: 'GET',
      url:  Cypress.config('baseUrl') +`/api/v1/fechamentos/acompanhamentos/turmas/${Cypress.env('TURMA_CODIGO_FECHAMENTO')}/conselho-classe/bimestres/${Cypress.env('BIMESTRE_CODIGO')}/alunos/${Cypress.env('ALUNO_ID')}/componentes-curriculares/detalhamento`,
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
