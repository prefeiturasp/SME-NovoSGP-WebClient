import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps'

let token

Before(() => {
  cy.gerar_token_cp().then((token_valido) => {
    token = token_valido
  })
})

Given('que possuo um token de acesso válido', function () {
  expect(token, 'valido').to.exist
})

// Cria o plano de ciclo
When('envio uma requisição POST', function () {
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/planos/ciclo`,
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json-patch+json',
      Authorization: `Bearer ${token}`
    },
    body: {
      ano: `${Cypress.env('ANO_LETIVO')}`,
      cicloId: `${Cypress.env('PLANO_CICLO')}`,
      descricao: " ",
      escolaId: `${Cypress.env('UE_CODIGO')}`,
      id: " ",
      idsMatrizesSaber: [],
      idsObjetivosDesenvolvimento: []
    },
    failOnStatusCode: false
  }).as('response')
})

Then('cria o plano de ciclo com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
  })
})

// Ano letivo é obrigatório
When('envio uma requisição POST sem o ano', function () {
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/planos/ciclo`,
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json-patch+json',
      Authorization: `Bearer ${token}`
    },
    body: {
      ano: " ",
      cicloId: `${Cypress.env('PLANO_CICLO')}`,
      descricao: " ",
      escolaId: `${Cypress.env('UE_CODIGO')}`,
      id: " ",
      idsMatrizesSaber: [],
      idsObjetivosDesenvolvimento: []
    },
    failOnStatusCode: false
  }).as('response')
})

Then('não cria que o ano letivo é obrigatório com status 422', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
  })
})

// Ciclo é obrigatório
When('envio uma requisição POST sem o plano', function () {
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/planos/ciclo`,
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json-patch+json',
      Authorization: `Bearer ${token}`
    },
    body: {
      ano: `${Cypress.env('ANO_LETIVO')}`,
      cicloId: " ",
      descricao: " ",
      escolaId: `${Cypress.env('UE_CODIGO')}`,
      id: " ",
      idsMatrizesSaber: [],
      idsObjetivosDesenvolvimento: []
    },
    failOnStatusCode: false
  }).as('response')
})

Then('não cria que o ciclo é obrigatório com status 422', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
  })
})

// UE é obrigatória
When('envio uma requisição POST sem a UE', function () {
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/planos/ciclo`,
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json-patch+json',
      Authorization: `Bearer ${token}`
    },
    body: {
      ano: `${Cypress.env('ANO_LETIVO')}`,
      cicloId: `${Cypress.env('PLANO_CICLO')}`,
      descricao: " ",
      escolaId: " ",
      id: " ",
      idsMatrizesSaber: [],
      idsObjetivosDesenvolvimento: []
    },
    failOnStatusCode: false
  }).as('response')
})

Then('não cria que a UE é obrigatória com status 422', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
  })
})

// Não cria o plano de ciclo sem autenticação
When('tento a requisição POST', function () {
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/planos/ciclo`,
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json-patch+json',
      Authorization: 'Bearer token_invalido'
    },
    body: {
      ano: `${Cypress.env('ANO_LETIVO')}`,
      cicloId: `${Cypress.env('PLANO_CICLO')}`,
      descricao: " ",
      escolaId: `${Cypress.env('UE_CODIGO')}`,
      id: " ",
      idsMatrizesSaber: [],
      idsObjetivosDesenvolvimento: []
    },
    failOnStatusCode: false
  }).as('response')
})

Then('não cria o plano de ciclo mostrando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Retorna o plano de ciclo
When('envio uma requisição GET', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/planos/ciclo/cicloId: ${Cypress.env('PLANO_CICLO')}/${Cypress.env('PLANO_CICLO')}/${Cypress.env('UE_CODIGO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o plano de ciclo com status 200', function () {
  cy.get('@response').then((response) => {
  expect(response.status).to.eq(200)
  })
})

// Ano letivo é obrigatório
When('envio uma requisição GET sem o ano', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/planos/ciclo//${Cypress.env('PLANO_CICLO')}/${Cypress.env('UE_CODIGO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna que o ano letivo é obrigatório com status 500', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)
  })
})

// Ciclo é obrigatório
When('envio uma requisição GET sem o plano', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/planos/ciclo/${Cypress.env('ANO_LETIVO')}//${Cypress.env('UE_CODIGO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna que o ciclo é obrigatório com status 500', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)
  })
})

// UE é obrigatória
When('envio uma requisição GET sem a UE', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/planos/ciclo/${Cypress.env('ANO_LETIVO')}/${Cypress.env('PLANO_CICLO')}/`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna que a UE é obrigatória com status 500', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)
  })
})

// Não retorna o plano de ciclo sem autenticação
Given('que não possuo um token de acesso válido', () => {
})

When('tento a requisição GET', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/planos/ciclo/${Cypress.env('ANO_LETIVO')}/${Cypress.env('PLANO_CICLO')}/${Cypress.env('UE_CODIGO')}`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('não retorna o plano de ciclo mostrando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})
