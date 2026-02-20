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

Given('que não gerou um token de acesso válido', () => {
})

// Retornar os ids e tipos de ocorrências
When('envio a requisição GET para o endpoint de ocorrências', function () {   
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ocorrencias/tipos`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com os ids e tipos', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.be.an('array').and.not.empty
    response.body.forEach((item) => {
      expect(item).to.have.property('id')
      expect(item).to.have.property('descricao')
    })
  })
})

// Não acessar os tipos de ocorrências sem autenticação
When('tento a requisição GET para o endpoint de ocorrências', function () { 
  cy.request({
   method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/ocorrencias/tipos`,
      headers: {
        accept: 'text/plain',
        Authorization: 'Bearer token_invalido' },
      failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem os ids e tipos', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401) 
  })
})
