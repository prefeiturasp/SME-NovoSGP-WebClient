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

// Atribuir um funcionário a UE
When('envio uma requisição POST', function () { 
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/unidades-escolares/funcionarios`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    body:{
      'codigoRF': `${Cypress.env('CODIGO_RF')}`,
      'codigoDRE': `${Cypress.env('DRE_CODIGO')}`,
      'codigoUE': `${Cypress.env('UE_CODIGO')}`, 
      'nomeServidor': `${Cypress.env('NOME_SERVIDOR')}`,   
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 de sucesso ao atribuir', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)          
  })
})

// Dados de funcionário devem ser obrigatórios
When('envio uma requisição POST sem os dados do funcionário', function () { 
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/unidades-escolares/funcionarios`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 415 sem atribuir', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(415)            
  })
})

// DRE deve ser obrigatória ao atribuir funcionário
When('envio uma requisição POST sem a DRE', function () { 
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/unidades-escolares/funcionarios`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    body:{
      'codigoRF': `${Cypress.env('CODIGO_RF')}`,
      'codigoUE': `${Cypress.env('UE_CODIGO')}`, 
      'nomeServidor': `${Cypress.env('NOME_SERVIDOR')}`,   
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 601 sem atribuir funcionário', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)
    expect(response.body).to.deep.equal({
      mensagens: [
        "O código da DRE é obrigatório."
      ],
      existemErros: true
    })          
  })
})

// Não atribuir um funcionário a UE sem autenticação
When('tento uma requisição POST', function () { 
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/unidades-escolares/funcionarios`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    body:{
      'codigoRF': `${Cypress.env('CODIGO_RF')}`,
      'codigoDRE': `${Cypress.env('DRE_CODIGO')}`,
      'codigoUE': `${Cypress.env('UE_CODIGO')}`, 
      'nomeServidor': `${Cypress.env('NOME_SERVIDOR')}`,   
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem atribuir funcionário', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Atribuir um usuário a UE
When('envio uma requisição POST', function () { 
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/unidades-escolares/usuarios`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    body:{
      'codigoRF': `${Cypress.env('CODIGO_RF')}`,
      'codigoDRE': `${Cypress.env('DRE_CODIGO')}`,
      'codigoUE': `${Cypress.env('UE_CODIGO')}`, 
      'nomeServidor': `${Cypress.env('NOME_SERVIDOR')}`,   
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 de sucesso ao atribuir', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)          
  })
})

// Dados de usuário devem ser obrigatórios
When('envio uma requisição POST sem os dados do usuário', function () { 
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/unidades-escolares/usuarios`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },    
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 415 sem atribuir', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(415)               
  })
})

// DRE deve ser obrigatória ao atribuir usuário
When('envio uma requisição POST sem a DRE', function () { 
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/unidades-escolares/usuarios`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    body:{
      'codigoRF': `${Cypress.env('CODIGO_RF')}`,
      'codigoUE': `${Cypress.env('UE_CODIGO')}`, 
      'nomeServidor': `${Cypress.env('NOME_SERVIDOR')}`,   
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 601 sem atribuir usuário', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)
    expect(response.body).to.deep.equal({
      mensagens: [
        "O código da DRE é obrigatório."
      ],
      existemErros: true
    })          
  })
})

// Não atribuir um usuário a UE sem autenticação
When('tento uma requisição POST', function () { 
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/unidades-escolares/usuarios`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    body:{
      'codigoRF': `${Cypress.env('CODIGO_RF')}`,
      'codigoDRE': `${Cypress.env('DRE_CODIGO')}`,
      'codigoUE': `${Cypress.env('UE_CODIGO')}`, 
      'nomeServidor': `${Cypress.env('NOME_SERVIDOR')}`,   
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem atribuir usuário', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

