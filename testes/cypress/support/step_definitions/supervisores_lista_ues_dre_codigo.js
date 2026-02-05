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

// Listar todas UEs através da DRE
When('envio uma requisição GET de supervisores responsável', function () { 
  cy.request({
    method: 'GET',   
      url: Cypress.config('baseUrl') + `/api/v1/supervisores/lista-ues/${Cypress.env('DRE_CODIGO')}`,
      headers: {
      accept: 'text/plain',
      'Authorization': `Bearer ${token}`,            
    },
    failOnStatusCode: false,  
  }).as('response')
})

Then('carrega o status 200 com todas UEs através da DRE', function () {
  cy.get('@response').then((response) => {
   expect(response.status).to.eq(200)
    expect(response.body[0]).to.have.property('id')
    expect(response.body[0]).to.have.property('codigo')
    expect(response.body[0]).to.have.property('nomeSimples')
    expect(response.body[0]).to.have.property('tipoEscola')
    expect(response.body[0]).to.have.property('nome')  
  })
})

// Código da DRE deve ser obrigatório
When('envio uma requisição GET para supervisores sem dre', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/supervisores/lista-ues/`,
    headers: {
      accept: 'text/plain',
      'Authorization': `Bearer ${token}`,            
    },
    failOnStatusCode: false,  
  }).as('response')
})

Then('carrega o status 500 que a DRE do responsável deve ser obrigatório', function () {
  cy.get('@response').then((response) => {
   expect(response.status).to.eq(500)     
  })
})

// Não retorna dados sem usuário autenticado
Given('que não possuo um token de acesso válido', () => {
})

When('tento a requisição GET de supervisores responsável', function () { 
  cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/supervisores/lista-ues/${Cypress.env('DRE_CODIGO')}`,
      headers: {
        accept: 'text/plain',
        'Authorization': 'Bearer token_invalido' 
    },
  failOnStatusCode: false
  }).as('response')
})

Then('não retorna todos os códigos e tipostodas UEs através da DRE mostrando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})
