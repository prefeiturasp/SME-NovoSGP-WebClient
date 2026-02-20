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

// Retornar todas as ausências
When('envio uma requisição GET de ausentes', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/busca-ativa/criancas-estudantes/ausentes?CodigoUe=${Cypress.env('UE_CODIGO')}&AnoLetivo=${Cypress.env('ANO_LETIVO')}&CodigoTurma=${Cypress.env('TURMA_CODIGO')}`,
    headers: {
    accept: 'text/plain',
    'Authorization': `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com todas as ausências', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.be.an('array').and.not.empty
    response.body.forEach((estudante) => {
      expect(estudante).to.have.property('numeroChamada')
      expect(estudante).to.have.property('nome')
      expect(estudante).to.have.property('codigoEol')
      expect(estudante).to.have.property('frequenciaGlobal')
      expect(estudante).to.have.property('diasSeguidosComAusencia')
    })
  })
})

// Retornar as ausências no dia de hoje
When('envio uma requisição GET de ausentes do dia', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/busca-ativa/criancas-estudantes/ausentes?CodigoUe=${Cypress.env('UE_CODIGO')}&AnoLetivo=${Cypress.env('ANO_LETIVO')}&CodigoTurma=${Cypress.env('TURMA_CODIGO')}&Ausencias=1`,
    headers: {
    accept: 'text/plain',
    'Authorization': `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com ausências de hoje', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200) 
  })
})

// Retornar as ausências há 2 dias seguidos
When('envio uma requisição GET de ausentes há 2 dias seguidos', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/busca-ativa/criancas-estudantes/ausentes?CodigoUe=${Cypress.env('UE_CODIGO')}&AnoLetivo=${Cypress.env('ANO_LETIVO')}&CodigoTurma=${Cypress.env('TURMA_CODIGO')}&Ausencias=2`,
    headers: {
    accept: 'text/plain',
    'Authorization': `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

// Retornar as ausências há 3 dias seguidos
When('envio uma requisição GET de ausentes há 3 dias seguidos', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/busca-ativa/criancas-estudantes/ausentes?CodigoUe=${Cypress.env('UE_CODIGO')}&AnoLetivo=${Cypress.env('ANO_LETIVO')}&CodigoTurma=${Cypress.env('TURMA_CODIGO')}&Ausencias=3`,
    headers: {
    accept: 'text/plain',
    'Authorization': `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

// Retornar as ausências há 4 dias seguidos
When('envio uma requisição GET de ausentes há 4 dias seguidos', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/busca-ativa/criancas-estudantes/ausentes?CodigoUe=${Cypress.env('UE_CODIGO')}&AnoLetivo=${Cypress.env('ANO_LETIVO')}&CodigoTurma=${Cypress.env('TURMA_CODIGO')}&Ausencias=4`,
    headers: {
    accept: 'text/plain',
    'Authorization': `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

// Retornar as ausências há 5 dias seguidos
When('envio uma requisição GET de ausentes há 5 dias seguidos', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/busca-ativa/criancas-estudantes/ausentes?CodigoUe=${Cypress.env('UE_CODIGO')}&AnoLetivo=${Cypress.env('ANO_LETIVO')}&CodigoTurma=${Cypress.env('TURMA_CODIGO')}&Ausencias=5`,
    headers: {
    accept: 'text/plain',
    'Authorization': `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

// Retornar as ausências entre 6 e 10 dias seguidos
When('envio uma requisição GET os ausentes entre 6 e 10 dias seguidos', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/busca-ativa/criancas-estudantes/ausentes?CodigoUe=${Cypress.env('UE_CODIGO')}&AnoLetivo=${Cypress.env('ANO_LETIVO')}&CodigoTurma=${Cypress.env('TURMA_CODIGO')}&Ausencias=6`,
    headers: {
    accept: 'text/plain',
    'Authorization': `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

// Retornar as ausências entre 11 e 15 dias seguidos
When('envio uma requisição GET os ausentes entre 11 e 15 dias seguidos', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/busca-ativa/criancas-estudantes/ausentes?CodigoUe=${Cypress.env('UE_CODIGO')}&AnoLetivo=${Cypress.env('ANO_LETIVO')}&CodigoTurma=${Cypress.env('TURMA_CODIGO')}&Ausencias=7`,
    headers: {
    accept: 'text/plain',
    'Authorization': `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

// Retornar as ausências há mais de 15 dias seguidos
When('envio uma requisição GET os ausentes há mais de 15 dias seguidos', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/busca-ativa/criancas-estudantes/ausentes?CodigoUe=${Cypress.env('UE_CODIGO')}&AnoLetivo=${Cypress.env('ANO_LETIVO')}&CodigoTurma=${Cypress.env('TURMA_CODIGO')}&Ausencias=8`,
    headers: {
    accept: 'text/plain',
    'Authorization': `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

// Retornar 3 ausências nos últimos 10 dias
When('envio uma requisição GET de 3 ausências nos últimos 10 dias', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/busca-ativa/criancas-estudantes/ausentes?CodigoUe=${Cypress.env('UE_CODIGO')}&AnoLetivo=${Cypress.env('ANO_LETIVO')}&CodigoTurma=${Cypress.env('TURMA_CODIGO')}&Ausencias=9`,
    headers: {
    accept: 'text/plain',
    'Authorization': `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 somente as ausências do filtro', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200) 
  })
})

// UE deve ser obrigatório na consulta
When('envio uma requisição GET os ausentes sem a UE', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/busca-ativa/criancas-estudantes/ausentes?CodigoUe=&AnoLetivo=${Cypress.env('ANO_LETIVO')}&CodigoTurma=${Cypress.env('TURMA_CODIGO')}`,
    headers: {
    accept: 'text/plain',
    'Authorization': `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 601 que a UE deve ser informada', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)
    expect(response.body).to.include({ existemErros: true })
    expect(response.body.mensagens).to.be.an('array').that.includes("O código da ue deve ser informado para a pesquisa das turmas alunos ausentes.") 
  })
})

// Ano letivo deve ser obrigatório na consulta
When('envio uma requisição GET os ausentes sem o ano letivo', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/busca-ativa/criancas-estudantes/ausentes?CodigoUe=${Cypress.env('UE_CODIGO')}&AnoLetivo=&CodigoTurma=${Cypress.env('TURMA_CODIGO')}`,
    headers: {
    accept: 'text/plain',
    'Authorization': `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 601 que invalidando a consulta', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    expect(response.body).to.include({ existemErros: true })
    expect(response.body.mensagens).to.be.an('array').that.includes("The value '' is invalid.") 
  })
})

// Turma deve ser obrigatório na consulta
When('envio uma requisição GET os ausentes sem a turma', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/busca-ativa/criancas-estudantes/ausentes?CodigoUe=${Cypress.env('UE_CODIGO')}&AnoLetivo=${Cypress.env('ANO_LETIVO')}&CodigoTurma=`,
    headers: {
    accept: 'text/plain',
    'Authorization': `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 601 que a turma deve ser informada', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)
    expect(response.body.existemErros).to.be.true
    expect(response.body.mensagens).to.include("O código da turma deve ser informado para a pesquisa das turmas alunos ausentes.")
  })
}) 

// Não ausências da turma quando estiver deslogado
When('tento uma requisição GET os ausentes da turma', function () { 
  return cy.request({
   method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/busca-ativa/criancas-estudantes/ausentes?CodigoUe=${Cypress.env('UE_CODIGO')}&AnoLetivo=${Cypress.env('ANO_LETIVO')}&CodigoTurma=${Cypress.env('TURMA_CODIGO')}`,
      headers: {
        accept: 'text/plain',
        Authorization: 'Bearer token_invalido' },
      failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem as ausências', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
    expect(response.body).to.be.empty
  })
})

