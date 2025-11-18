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

// Listar todas as pendências por aula
When('informo o id de pendência da aula', function () {   
})

Then('envio uma requisição GET para o endpoint', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/fechamentos/acompanhamentos/turmas/pendencias/${Cypress.env('FECHAMENTO_ACOMPANHAMENTO_PENDENCIA_ID')}/aulas/detalhamentos`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('a reposta deve conter status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(204)    
  })
})

// Não permitir acessar sem autenticação
Given('que não possuo um token de acesso válido', () => {
  token = 'token_invalido'
})

When('informo o id de pendência da aula', function () {   
})

Then('envio uma requisição GET para o endpoint sem autenticação', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/fechamentos/acompanhamentos/turmas/pendencias/${Cypress.env('FECHAMENTO_ACOMPANHAMENTO_PENDENCIA_ID')}/aulas/detalhamentos`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('a resposta deve ter o status 401 sem acompanhamento de pendências por aula', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Não listar pendência da aula sem id informado
When('não informo o id de pendência da aula', function () {   
})

Then('envio uma requisição GET para o endpoint sem o id', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/fechamentos/acompanhamentos/turmas/pendencias/${Cypress.env('FECHAMENTO_ACOMPANHAMENTO_PENDENCIA_ID_INVALIDO')}/aulas/detalhamentos`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('a resposta deve ter o status 601 com a mensagem de erro de id não informado', function () {  
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)
    expect(response.body).to.deep.equal({
          "mensagens": [
              "O id da pendência deve ser informado."
          ],
          "existemErros": true                 
    })    
  })
})