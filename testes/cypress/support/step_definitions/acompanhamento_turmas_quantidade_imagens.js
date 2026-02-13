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

// Retorna a quantidade de imagens do percurso coletivo e individual
When('envio uma requisição GET para o endpoint de quantidade de imagens', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/acompanhamento/turmas/quantidade-imagens?ano=${Cypress.env('ANO_LETIVO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna do percurso coletivo e individual com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.have.property('quantidadeImagemPercursoColetivo')
    expect(response.body).to.have.property('quantidadeImagemPercursoIndividual')
  })
})

// Ano letivo é obrigado na consulta das imagens
When('envio uma requisição GET para o endpoint de imagens sem ano letivo', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/acompanhamento/turmas/quantidade-imagens?ano=`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o ano não informado é inválido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    expect(response.body).to.have.property('existemErros', true)
    expect(response.body).to.have.property('mensagens').that.is.an('array').and.not.empty
    expect(response.body.mensagens[0]).to.match(/The value '.*' is invalid\./)    
  })
})

// Não retorna quantidade de imagens sem autenticação
Given('que não possuo um token de acesso válido', () => { 
})

When('tento a requisição GET para o endpoint de quantidade de imagens', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/acompanhamento/turmas/quantidade-imagens?ano=${Cypress.env('ANO_LETIVO')}`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('não retorna a quantidade no letivo mostrando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})
