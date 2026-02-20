import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps'

let token

before(() => {
  cy.gerar_token().then((token_valido) => {
    token = token_valido
  })
})

Given('que possuo um token de acesso válido', function () {
  expect(token, 'valido').to.exist
})

// Carrega os dados do relatório
When('envio uma requisição GET para supervisores responsável', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/supervisores/tipo-responsavel`,
    headers: {
      accept: 'text/plain',
      'Authorization': `Bearer ${token}`,            
    },
    failOnStatusCode: false,  
  }).as('response')
})

Then('carrega o status 200 com todos os códigos e tipos', function () {
  cy.get('@response').then((response) => {
   expect(response.status).to.eq(200)   
    expect(response.body[0]).to.have.property('codigo')
    expect(response.body[0]).to.have.property('descricao')    
  })
})

// Não retorna dados sem usuário autenticado
Given('que não possuo um token de acesso válido', () => {
})

When('tento a requisição GET para supervisores responsável', function () { 
  cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/supervisores/tipo-responsavel`,
      headers: {
        accept: 'text/plain',
        'Authorization': 'Bearer token_invalido' 
    },
  failOnStatusCode: false
  }).as('response')
})

Then('não retorna todos os códigos e tipos mostrando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})
