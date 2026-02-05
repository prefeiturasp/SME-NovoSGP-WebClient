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

// Retornar a descrição e id das ausências
When('envio uma requisição GET de ausências', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/busca-ativa/criancas-estudantes/ausentes/ausencias`,
    headers: {
    accept: 'text/plain',
    'Authorization': `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com todas as ausências descritas e id', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.be.an('array').and.have.length(9)
    expect(response.body).to.deep.include({ descricao: "No dia de hoje", id: 1 })
    expect(response.body).to.deep.include({ descricao: "Há 2 dias seguidos", id: 2 })
    expect(response.body).to.deep.include({ descricao: "Há 3 dias seguidos", id: 3 })
    expect(response.body).to.deep.include({ descricao: "Há 4 dias seguidos", id: 4 })
    expect(response.body).to.deep.include({ descricao: "Há 5 dias seguidos", id: 5 })
    expect(response.body).to.deep.include({ descricao: "Entre 6 e 10 dias seguidos", id: 6 })
    expect(response.body).to.deep.include({ descricao: "Entre 11 e 15 dias seguidos", id: 7 })
    expect(response.body).to.deep.include({ descricao: "Há mais de 15 dias seguidos", id: 8 })
    expect(response.body).to.deep.include({ descricao: "3 ausências nos últimos 10 dias", id: 9 })
  })
})


Given('que não gerou um token de acesso válido', () => {
})

// Não retorna ausências quando estiver deslogado
When('tento uma requisição GET de ausências', function () { 
  return cy.request({
   method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/busca-ativa/criancas-estudantes/ausentes?CodigoUe=${Cypress.env('UE_CODIGO')}&AnoLetivo=${Cypress.env('ANO_LETIVO')}&CodigoTurma=${Cypress.env('TURMA_CODIGO')}`,
      headers: {
        accept: 'text/plain',
        Authorization: 'Bearer token_invalido' },
      failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 a descrição e id', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
    expect(response.body).to.be.empty
  })
})

