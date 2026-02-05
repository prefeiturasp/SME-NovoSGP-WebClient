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

// Filtrar o ciclo de alfabetização
When('envio uma requisição POST com anos de 1 até 3', function () { 
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/ciclos/filtro`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    body:{
      'anos': [
        `${Cypress.env('CICLO_ALFABETIZACAO')}`,
      ],
      'anoSelecionado': `${Cypress.env('ANO_LETIVO')}`, 
      'modalidade': `${Cypress.env('MODALIDADE_CODIGO')}`,   
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 filtrando o ciclo de alfabetização', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.be.an('array').and.deep.include({
      descricao: 'Alfabetização',
      id: 1,
      selecionado: true
    })
  })
})

// Filtrar o ciclo interdisciplinar
When('envio uma requisição POST com anos de 4 até 6', function () { 
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/ciclos/filtro`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    body:{
      'anos': [
        `${Cypress.env('CICLO_INTERDISCIPLINAR')}`,
      ],
      'anoSelecionado': `${Cypress.env('ANO_LETIVO')}`, 
      'modalidade': `${Cypress.env('MODALIDADE_CODIGO')}`,   
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 filtrando o ciclo interdisciplinar', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.be.an('array').and.deep.include({
      descricao: 'Interdisciplinar',
      id: 2,
      selecionado: true
    })
  })
})

// Filtrar o ciclo autoral
When('envio uma requisição POST com anos de 7 até 9', function () { 
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/ciclos/filtro`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    body:{
      'anos': [
        `${Cypress.env('CICLO_AUTORAL')}`,
      ],
      'anoSelecionado': `${Cypress.env('ANO_LETIVO')}`, 
      'modalidade': `${Cypress.env('MODALIDADE_CODIGO')}`,   
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 filtrando o ciclo autoral', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.be.an('array').and.deep.include({
      descricao: 'Autoral',
      id: 3,
      selecionado: true
    })
  })
})

// Filtro de ciclo inválido
When('envio uma requisição POST com ano inexistente', function () { 
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/ciclos/filtro`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    body:{
      'anos': [
        `${Cypress.env('CICLO_FILTRO_INVALIDO')}`,
      ],
      'anoSelecionado': `${Cypress.env('ANO_LETIVO')}`, 
      'modalidade': `${Cypress.env('MODALIDADE_CODIGO')}`,   
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 601 que o filtro de ciclo é inválido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)
    expect(response.body).to.have.property('mensagens').that.is.an('array')
    expect(response.body.mensagens).to.include("Não foi possível localizar o ciclo da turma selecionada")
    expect(response.body).to.have.property('existemErros', true)
  })
})

// Não retorna filtro de ciclo sem autenticação
Given('que não possuo um token de acesso válido', () => {
})

When('tento a requisição POST para o endpoint de filtro de ciclo', function () { 
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/ciclos/filtro`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    body:{
      'anos': [
        `${Cypress.env('CICLO_ALFABETIZACAO')}`,
      ],
      'anoSelecionado': `${Cypress.env('ANO_LETIVO')}`, 
      'modalidade': `${Cypress.env('MODALIDADE_CODIGO')}`,   
    },
    failOnStatusCode: false
  }).as('response')
})

Then('não retorna o filtro mostrando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})
