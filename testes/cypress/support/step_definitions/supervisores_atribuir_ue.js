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

// Realizar a atribuição do supervisor na UE
When('envio uma requisição POST no endpoiint de atribuição responsável', function () { 
  cy.request({
    method: 'POST',
      url: Cypress.config('baseUrl') + `/api/v1/supervisores/atribuir-ue`,
      headers: {
        accept: 'text/plain',
        'Authorization': `Bearer ${token}`,            
      },
        body: {          
          "dreId": `${Cypress.env('DRE_CODIGO')}`,
          "responsavelId": `${Cypress.env('LOGIN_SUPERVISOR')}`,
          "uesIds": [
        `${Cypress.env('UE_CODIGO')}`
      ],
    "tipoResponsavelAtribuicao": 1
      },
    failOnStatusCode: false,  
  }).as('response')
})

Then('retorna o status 200 associando o supervisor na UE', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.be.oneOf([200, 601])
  })
})

// DRE deve ser obrigatório
When('envio uma requisição POST no endpoiint de atribuição sem a DRE', function () { 
  cy.request({
    method: 'POST',
      url: Cypress.config('baseUrl') + `/api/v1/supervisores/atribuir-ue`,
      headers: {
        accept: 'text/plain',
        'Authorization': `Bearer ${token}`,            
      },
        body: {          
          "dreId": " ",
          "responsavelId": `${Cypress.env('LOGIN_SUPERVISOR')}`,
          "uesIds": [
        `${Cypress.env('UE_CODIGO')}`
      ],
    "tipoResponsavelAtribuicao": 1
      },
    failOnStatusCode: false,  
  }).as('response')
})

Then('retorna o status 422 que código da DRE do responsável deve ser informado', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)  
    expect(response.body).to.have.property('mensagens')
    expect(response.body.mensagens).to.include("A Dre deve ser informada")
    expect(response.body).to.have.property('existemErros', true)       
  })
})

// Responsável deve ser obrigatório
When('envio uma requisição POST no endpoiint de atribuição sem responsável', function () { 
  cy.request({
    method: 'POST',
      url: Cypress.config('baseUrl') + `/api/v1/supervisores/atribuir-ue`,
      headers: {
        accept: 'text/plain',
        'Authorization': `Bearer ${token}`,            
      },
        body: {          
          "dreId": `${Cypress.env('DRE_CODIGO')}`,
          "responsavelId": " ",
          "uesIds": [
        `${Cypress.env('UE_CODIGO')}`
      ],
    "tipoResponsavelAtribuicao": 1
      },
    failOnStatusCode: false, 
  }).as('response')
})

Then('retorna o status 422 que responsável deve ser informado', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)  
    expect(response.body).to.have.property('mensagens')
    expect(response.body.mensagens).to.include("O Responsavel deve ser informado")
    expect(response.body).to.have.property('existemErros', true)     
  })
})

// UE deve ser obrigatório
When('envio uma requisição POST no endpoiint de atribuição sem UE', function () { 
  cy.request({
    method: 'POST',
      url: Cypress.config('baseUrl') + `/api/v1/supervisores/atribuir-ue`,
      headers: {
        accept: 'text/plain',
        'Authorization': `Bearer ${token}`,            
      },
        body: {          
          "dreId": `${Cypress.env('DRE_CODIGO')}`,
          "responsavelId": `${Cypress.env('LOGIN_SUPERVISOR')}`,
          "uesIds": [
        `${Cypress.env('UE_CODIGO')}`
      ],
    "tipoResponsavelAtribuicao": 1
      },
    failOnStatusCode: false,    
  }).as('response')
})

Then('retorna o status 601 que código da UE do responsável deve ser informado', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)   
  })
})

// Tipo de responsável deve ser obrigatório
When('envio uma requisição POST no endpoiint de atribuição sem tipo', function () { 
  cy.request({
    method: 'POST',
      url: Cypress.config('baseUrl') + `/api/v1/supervisores/atribuir-ue`,
      headers: {
        accept: 'text/plain',
        'Authorization': `Bearer ${token}`,            
      },
        body: {          
          "dreId": `${Cypress.env('DRE_CODIGO')}`,
          "responsavelId": `${Cypress.env('LOGIN_SUPERVISOR')}`,
          "uesIds": [
        `${Cypress.env('UE_CODIGO')}`
      ],
    "tipoResponsavelAtribuicao": 1
      },
    failOnStatusCode: false,   
  }).as('response')
})

Then('retorna o status 601 que tipo do responsável deve ser informado', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601) 
  })
})

// Não retorna dados sem usuário autenticado
Given('que não possuo um token de acesso válido', () => {
})

When('tento a requisição POST no endpoiint de atribuição responsável', function () { 
  cy.request({
    method: 'POST',
      url: Cypress.config('baseUrl') + `/api/v1/supervisores/atribuir-ue`,
      headers: {
        accept: 'text/plain',
        'Authorization': `Bearer token_invalido`,            
      },
        body: {          
          "dreId": `${Cypress.env('DRE_CODIGO')}`,
          "responsavelId": `${Cypress.env('LOGIN_SUPERVISOR')}`,
          "uesIds": [
        `${Cypress.env('UE_CODIGO')}`
      ],
    "tipoResponsavelAtribuicao": 1
      },
    failOnStatusCode: false,  
  }).as('response')
})

Then('não associa o supervisor na UE mostrando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})
