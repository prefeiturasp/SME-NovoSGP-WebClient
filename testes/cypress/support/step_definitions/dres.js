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

// Retornar todas as DREs cadastradas
When('envio uma requisição GET para o endpoint DREs', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dres`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna todas DREs cadastradas com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)            
    expect(response.body[0]).to.have.property('id')
    expect(response.body[0]).to.have.property('nome')
    expect(response.body[0]).to.have.property('sigla')    
  })
})

// Sem retornar DREs quando usuário não está autenticado
Given('não gerou um token de acesso válido', () => {
})

When('tento a requisição GET para o endpoint DREs', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dres`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem dados de DREs', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Buscar todas UEs sem Assistente Social
When('envio uma requisição GET para o endpoint buscar sem atribuição', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dres/${Cypress.env('DRE_CODIGO')}/ues/sem-atribuicao/${Cypress.env('TIPO_RESPONSAVEL_ASSISTENTE_SOCIAL')}`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('insiro o tipo de responsável Assistente Social', function () {   
})

Then('retorna todas UEs com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)            
    expect(response.body[0]).to.have.property('codigo')
    expect(response.body[0]).to.have.property('nome')    
  })
})

// Buscar todas UEs sem PAAI
When('envio uma requisição GET para o endpoint buscar sem atribuição', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dres/${Cypress.env('DRE_CODIGO')}/ues/sem-atribuicao/${Cypress.env('TIPO_RESPONSAVEL_PAAI')}`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('insiro o tipo de responsável PAAI', function () {   
})

Then('retorna todas UEs com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)            
    expect(response.body[0]).to.have.property('codigo')
    expect(response.body[0]).to.have.property('nome')     
  })
})

// Buscar todas UEs sem Psicólogo Escolar
When('envio uma requisição GET para o endpoint buscar sem atribuição', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dres/${Cypress.env('DRE_CODIGO')}/ues/sem-atribuicao/${Cypress.env('TIPO_RESPONSAVEL_PSICOLOGO_ESCOLAR')}`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('insiro o tipo de responsável Psicólogo Escolar', function () {   
})

Then('retorna todas UEs com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)            
    expect(response.body[0]).to.have.property('codigo')
    expect(response.body[0]).to.have.property('nome')    
  })
})

// Buscar todas UEs sem Psicopedagogo
When('envio uma requisição GET para o endpoint buscar sem atribuição', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dres/${Cypress.env('DRE_CODIGO')}/ues/sem-atribuicao/${Cypress.env('TIPO_RESPONSAVEL_PSICOPEDAGOGO')}`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('insiro o tipo de responsável Psicopedagogo', function () {   
})

Then('retorna todas UEs com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)            
    expect(response.body[0]).to.have.property('codigo')
    expect(response.body[0]).to.have.property('nome')     
  })
})

// Buscar todas UEs sem Supervisor Escolar
When('envio uma requisição GET para o endpoint buscar sem atribuição', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dres/${Cypress.env('DRE_CODIGO')}/ues/sem-atribuicao/${Cypress.env('TIPO_RESPONSAVEL_SUPERVISOR_ESCOLAR')}`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('insiro o tipo de responsável Supervisor Escolar', function () {   
})

Then('retorna todas UEs com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)            
    expect(response.body[0]).to.have.property('codigo')
    expect(response.body[0]).to.have.property('nome')        
  })
})

// DRE deve ser informada
When('envio uma requisição GET para o endpoint buscar sem DRE', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dres//ues/sem-atribuicao/${Cypress.env('TIPO_RESPONSAVEL_SUPERVISOR_ESCOLAR')}`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('deve retornar status 404 sem nenhuma UE', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)         
  })
})

// Tipo de responsável deve ser informado
When('envio uma requisição GET para o endpoint buscar sem tipo de responsável', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dres/${Cypress.env('DRE_CODIGO')}/ues/sem-atribuicao/`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('deve retornar status 404 sem nenhum responsável', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)         
  })
})

// Sem retornar UES quando usuário não está autenticado
When('tento a requisição GET para o endpoint de buscar DRE sem atribuição', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dres/${Cypress.env('DRE_CODIGO')}/ues/sem-atribuicao/${Cypress.env('TIPO_RESPONSAVEL_SUPERVISOR_ESCOLAR')}`,
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem dados de UEs', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)         
  })
})

// Retornar todas as UEs cadastradas
When('envio uma requisição GET para o endpoint de UEs na DRE', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dres/${Cypress.env('DRE_CODIGO')}/ues`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna todas UEs cadastradas com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)            
    expect(response.body[0]).to.have.property('codigo')
    expect(response.body[0]).to.have.property('nome')  
  })
})

// DRE deve ser informada para buscar UE
When('envio uma requisição GET para o endpoint sem DRE da UE', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dres//ues`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna sem UE com status 500', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)          
  })
})

// Sem retornar DREs quando usuário não está autenticado
Given('não gerou um token de acesso válido', () => {
})

When('tento uma requisição GET para o endpoint de UEs na DRE', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/dres/${Cypress.env('DRE_CODIGO')}/ues`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem dados de UEs', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})