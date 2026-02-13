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

Given('que não possuo um token de acesso válido', () => { 
})

// Listar através do código da turma
When('envio a requisição GET ao endpoint recuperação paralela informando o código da turma', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/recuperacao-paralela/listar?TurmaCodigo=${Cypress.env('TURMA_CODIGO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('recebo status 200 listando os dados', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)  
    expect(response.body).to.have.property('eixos').that.is.an('array').and.not.empty
    expect(response.body.eixos[0]).to.have.property('descricao')
    expect(response.body.eixos[0]).to.have.property('id')
    expect(response.body.eixos[0]).to.have.property('periodoId')
    expect(response.body).to.have.property('periodo').that.is.an('object')
    expect(response.body.periodo).to.have.property('id')
    expect(response.body.periodo).to.have.property('descricao')
  })
})

// Código da turma é obrigatório para listar
When('envio a requisição GET ao endpoint recuperação paralela sem o código da turma', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/recuperacao-paralela/listar?TurmaCodigo=`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('recebo status 601 indicando que o código da turma é obrigatório', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)
    expect(response.body).to.have.property('existemErros', true)
    expect(response.body).to.have.property('mensagens').that.is.an('array').and.not.empty
    expect(response.body.mensagens[0]).to.equal('O código da turma deve ser informado.') 
  })
})

// Não lista através do código da turma sem autenticação
When('tento a requisição GET ao endpoint recuperação paralela com código da turma', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/recuperacao-paralela/listar?TurmaCodigo=${Cypress.env('TURMA_CODIGO')}`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem listar os dados', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Lista total de estudantes
When('envio a requisição GET ao endpoint recuperação paralela informando de total', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/recuperacao-paralela/listar?TurmaCodigo=${Cypress.env('TURMA_CODIGO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('recebo status 200 totalizando os estudantes', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)      
  })
})

// Não totaliza estudantes sem autenticação
When('tento a requisição GET ao endpoint recuperação paralela informando de total', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/recuperacao-paralela/listar?TurmaCodigo=${Cypress.env('TURMA_CODIGO')}`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem total de estudantes', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Retornar o gráfico de frequência
When('envio a requisição GET ao endpoint do gráfico da recuperação paralela', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/recuperacao-paralela/grafico/frequencia`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('recebo status 200 com gráfico de frequência', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(204)      
  })
})

// Não retornar o gráfico de frequências sem autenticação
When('tento a requisição GET ao endpoint do gráfico da recuperação paralela', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/recuperacao-paralela/grafico/frequencia`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem gráfico de frequência', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Busca todos resultados
When('envio a requisição GET ao endpoint de resultados da recuperação paralela', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/recuperacao-paralela/resultado`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('recebo status 200 com todos resultados', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    if (response.body && response.body.periodo) {
      expect(response.body.periodo).to.not.be.null
      expect(response.body.periodo).to.be.an('object')

      if (response.body.periodo.items !== undefined) {
        expect(response.body.periodo).to.have.property('items')
        expect(response.body.periodo).to.have.property('totalPaginas')
        expect(response.body.periodo).to.have.property('totalRegistros')
      } else {
        expect(response.body).to.have.any.keys('items', 'totalRegistros', 'totalPaginas')
      }
    } else {
      expect(response.body).to.be.an('object')
      expect(response.body).to.have.any.keys('items', 'totalRegistros', 'totalPaginas')
      if (response.body.items !== undefined) {
        expect(response.body.items).to.be.an('array')
      }
    }    
  })
})

// Não busca os resultados sem autenticação
When('tento a requisição GET ao endpoint de resultados da recuperação paralela', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/recuperacao-paralela/resultado`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem resultados', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Busca resultados de encaminhamento
When('envio a requisição GET ao endpoint de encaminhamento da recuperação paralela', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/recuperacao-paralela/resultado/encaminhamento`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('recebo status 200 com todos resultados de encaminhamento', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)    
  })
})

// Não busca os encaminhamentos sem autenticação
When('tento a requisição GET ao endpoint de encaminhamento da recuperação paralela', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/recuperacao-paralela/resultado/encaminhamento`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem resultados de encaminhamento', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Listar no período através do código da turma
When('envio a requisição GET ao endpoint recuperação paralela no período', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/recuperacao-paralela/periodo/${Cypress.env('TURMA_CODIGO')}/listar`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('recebo status 200 listando os dados através do código da turma', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(204)  
  })
})

// Código da turma é obrigatório para listar no período
When('envio a requisição GET ao endpoint recuperação paralela no período sem o código da turma', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/recuperacao-paralela/periodo//listar`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('recebo status 500 sem lista a turma', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500) 
  })
})

// Não lista no período através do código da turma sem autenticação
When('tento a requisição GET ao endpoint recuperação paralela no período', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/recuperacao-paralela/periodo/${Cypress.env('TURMA_CODIGO')}/listar`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem listar os dados através do código da turma', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Retorna os anos letivos
When('envio a requisição GET ao endpoint dos anos da recuperação paralela', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/recuperacao-paralela/anos-letivos`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('recebo status 200 com todos anos letivos', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.be.an('array').and.not.empty
    expect(response.body[0]).to.have.property('ano')
    expect(response.body[0]).to.have.property('ehSugestao')   
  })
})

// Não rtorna os anos letivos sem autenticação
When('tento a requisição GET ao endpoint dos anos da recuperação paralela', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/recuperacao-paralela/anos-letivos`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem os anos letivos', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})