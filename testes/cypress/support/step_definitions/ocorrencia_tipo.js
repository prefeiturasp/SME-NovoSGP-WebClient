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

// Retornar os ids e tipos de ocorrências
When('envio a requisição GET para o endpoint de ocorrências', function () {   
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ocorrencias/tipos`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com os ids e tipos', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.be.an('array').and.not.empty
    response.body.forEach((item) => {
      expect(item).to.have.property('id')
      expect(item).to.have.property('descricao')
    })
  })
})

// Não acessar os tipos de ocorrências sem autenticação
When('tento a requisição GET para o endpoint de ocorrências', function () { 
  cy.request({
   method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/ocorrencias/tipos`,
      headers: {
        accept: 'text/plain',
        Authorization: 'Bearer token_invalido' },
      failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem os ids e tipos', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401) 
  })
})

Given('que possuo um token de acesso válido', function () {
  expect(token, 'valido').to.exist
})

// Listar todos tipos de ocorrências
When('envio uma requisição GET para o endpoint buscar', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ocorrencias/tipos`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('o corpo da resposta deve conter todos tipos de ocorrências com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.deep.equal([
      { id: 1, descricao: "Incidente (Brigas, desentendimentos)" },
      { id: 2, descricao: "Acidente (quedas, machucados)" },
      { id: 3, descricao: "Alimentação" },
      { id: 4, descricao: "Como chegou à escola?" },
      { id: 5, descricao: "Roubo" },
      { id: 6, descricao: "Furto" },
      { id: 7, descricao: "Violência contra os professores" },
      { id: 8, descricao: "Violência contra os funcionários" },
      { id: 9, descricao: "Violência contra a criança/estudante" },
      { id: 10, descricao: "Racismo" },
      { id: 11, descricao: "Homofobia" },
      { id: 43, descricao: "Acolhimento" },
      { id: 45, descricao: "Outros" },
      { id: 44, descricao: "Atendimento aos Pais/Responsáveis" },
      { id: 76, descricao: "Alteração de Calendário" },
      { id: 77, descricao: "Suspensão de Aulas/Turmas" }
    ])
  })
})

// Não permitir acessar sem autenticação
Given('que não possuo um token de acesso válido', () => {
  token = 'token_invalido'
})

When('tento enviar uma requisição GET para o endpoint', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ocorrencias/tipos`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('a consulta de tipos de ocorrências deve ter o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

