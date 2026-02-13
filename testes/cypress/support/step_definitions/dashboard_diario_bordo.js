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

Given('que login não gerou um token de acesso válido', () => {
})

// Retorna a quantidade preenchidos pendentes
When('envio uma requisição GET para o endpoint do dashboard', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dashboard/diario-bordo/quantidade-preenchidos-pendentes?Modalidade=${Cypress.env('MODALIDADE_CODIGO')}&DreId=${Cypress.env('DRE_CODIGO')}&UeId=${Cypress.env('UE_CODIGO')}&UsuarioRf=${Cypress.env('LOGIN_ADM_COTIC')}&AnoLetivo=${Cypress.env('ANO_LETIVO')}`,
    headers: {
      accept: 'text/plain',
      'Authorization': `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})


Then('insiro o ano letivo, modallidade, DRE, UE, usuário', function () {  
})

Then('retorna o status 200 do diário de bordo', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)    
  })
})

// Ano letivo deve ser obrigatório no dashboard do diário de bordo
When('envio uma requisição GET para o endpoint de preenchidos pendentes', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dashboard/diario-bordo/quantidade-preenchidos-pendentes?Modalidade=${Cypress.env('MODALIDADE_CODIGO')}&DreId=${Cypress.env('DRE_CODIGO')}&UeId=${Cypress.env('UE_CODIGO')}&UsuarioRf=${Cypress.env('LOGIN_ADM_COTIC')}&AnoLetivo=`,
    headers: {
      accept: 'text/plain',
      'Authorization': `Bearer ${token}`
   },
    failOnStatusCode: false
  }).as('response')
})

Then('não insiro o ano letivo', function () {  
})

Then('retorna o status 422 de valor do ano inválido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)    
  })
})

// Modallidade deve ser obrigatória no dashboard do diário de bordo
When('envio uma requisição GET para o endpoint do dashboard do diário de bordo', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dashboard/diario-bordo/quantidade-preenchidos-pendentes?Modalidade=&DreId=${Cypress.env('DRE_CODIGO')}&UeId=${Cypress.env('UE_CODIGO')}&UsuarioRf=${Cypress.env('LOGIN_ADM_COTIC')}&AnoLetivo=${Cypress.env('ANO_LETIVO')}`,
    headers: {
      accept: 'text/plain',
      'Authorization': `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})


Then('não insiro modallidade', function () {  
})

Then('retorna o status 422 que não foi preenchido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)    
  })
})

// Não retorna dados para usuário não autenticado
When('tento a requisição GET para buscar a quantidade de preenchidos', function () { 
  cy.request({
   method: 'GET',
      url: `${Cypress.config('baseUrl')}/api/v1/usuarios/meus-dados`,
      headers: {
           accept: 'text/plain',
           'Authorization': 'Bearer token_invalido' },
      failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem os dados pendentes', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401) 
  })
})

// Retorna a quantidade preenchidos pendentes por DREs
When('envio uma requisição GET para o endpoint do dashboard das DREs', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dashboard/diario-bordo/quantidade-diarios-pendentes-dre?anoLetivo=${Cypress.env('ANO_LETIVO')}`,
    headers: {
      accept: 'text/plain',
      'Authorization': `Bearer ${token}`
    },
  failOnStatusCode: false
  }).as('response')
})


Then('insiro o ano letivo', function () {  
})

Then('retorna o status 200 com quantidade das DREs', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)    
  })
})

// Retorna os pendentes das DREs no ano
When('envio uma requisição GET para o endpoint de DREs', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dashboard/diario-bordo/quantidade-diarios-pendentes-dre?anoLetivo=${Cypress.env('ANO_LETIVO')}&ano=${Cypress.env('ANOS')}`,
     headers: {
      accept: 'text/plain',
      'Authorization': `Bearer ${token}`
    },
      failOnStatusCode: false
  }).as('response')
 })


Then('insiro o ano com o letivo', function () {  
})

Then('retorna o status 200 dos dados pendentes', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)    
  })
})

// Ano letivo deve ser informado para consulta por DRE
When('envio uma requisição GET para o endpoint somente ano', function () { 
  return cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/dashboard/diario-bordo/quantidade-diarios-pendentes-dre?ano=${Cypress.env('ANOS')}`,
      headers: {
        accept: 'text/plain',
        'Authorization': `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})

Then('não insiro o letivo na busca', function () {  
})

Then('retorna o status 601 com a mensagem que ano letivo não foi informado', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)    
  })
})

// Usuário sem autenticação não acessa o dashboard do diário de bordo por DRE
When('tento a requisição GET para buscar a quantidade de preenchidos', function () { 
  cy.request({
   method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/dashboard/diario-bordo/quantidade-diarios-pendentes-dre?anoLetivo=${Cypress.env('ANO_LETIVO')}&ano=${Cypress.env('ANOS')}`,
      headers: {
           accept: 'text/plain',
           'Authorization': 'Bearer token_invalido' },
      failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem os dados pendentes de DREs', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401) 
  })
})

// Buscar a consolidação do diário de bordo no dashboard
When('envio uma requisição GET para o endpoint de consolidação', function () { 
  return cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/dashboard/diario-bordo/consolidacao?anoLetivo=${Cypress.env('ANO_LETIVO')}`,
      headers: {
        accept: 'text/plain',
        'Authorization': `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})

Then('insiri o ano letivo', function () {  
})

Then('retorna o status 200 com o registro', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)    
  })
})

// Ano letivo deve ser informado para consulta da consolidação
When('envio uma requisição GET para o endpoint de consolidação sem o ano letivo', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dashboard/diario-bordo/consolidacao`,
      headers: {
        accept: 'text/plain',
        'Authorization': `Bearer ${token}`
       },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 601 com a mensagem que o ano deve ser informado', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)    
  })
})

// Usuário sem autenticação não acessa a consolidação do diário de bordo
When('tento a requisição GET para buscar a consolidação', function () { 
  cy.request({
   method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/dashboard/diario-bordo/consolidacao?anoLetivo=${Cypress.env('ANO_LETIVO')}`,
      headers: {
           accept: 'text/plain',
           'Authorization': 'Bearer token_invalido' },
      failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem os dados de registro', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401) 
  })
})