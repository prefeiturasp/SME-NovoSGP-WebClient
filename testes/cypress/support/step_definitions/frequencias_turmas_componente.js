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

// Listar frequências das aulas por turma e componente
When('envio uma requisição GET para o endpoint de frequências das turmas por componente', () => {
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/calendarios/frequencias/aulas/datas/turmas/${Cypress.env('TURMA_CODIGO')}/componente/${Cypress.env('COMPONENTE_CURRICULAR_CODIGO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    timeout: 60000,
    failOnStatusCode: false
  }).as('response')
})

// Não permitir acessar sem autenticação
Given('que não possuo um token de acesso válido', () => { 
})

When('tento uma requisição GET para o endpoint de frequências das turmas por componente', () => {
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/calendarios/frequencias/aulas/datas/turmas/${Cypress.env('TURMA_CODIGO')}/componente/${Cypress.env('COMPONENTE_CURRICULAR_CODIGO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token_invalido'
    },
    timeout: 60000,
    failOnStatusCode: false
  }).as('response')
})


// Código da turma informado é inexistente
When('envio uma requisição GET para o endpoint com turma inexistente', () => {
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/calendarios/frequencias/aulas/datas/turmas/erro601/componente/erro601`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    timeout: 60000,
    failOnStatusCode: false
  }).as('response')
})

Then('a resposta deve ter o status 200 contendo os dados', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.exist
    expect(response.body).to.be.an('array').and.not.be.empty
    response.body.forEach(frequencia => {
      expect(frequencia).to.have.property('data')
      expect(frequencia).to.have.property('aulas').that.is.an('array').and.not.be.empty
      frequencia.aulas.forEach(aula => {
        expect(aula).to.have.property('aulaId').that.is.a('number')
        expect(aula).to.have.property('aulaCJ').that.is.a('boolean')
        expect(aula).to.have.property('podeEditar').that.is.a('boolean')
        expect(aula).to.have.property('professorRf').that.is.a('string')
        expect(aula).to.have.property('criadoPor').that.is.a('string')
        expect(aula).to.have.property('possuiFrequenciaRegistrada').that.is.a('boolean')
        expect(aula).to.have.property('tipoAula').that.is.a('number')
      })
    })
  })
})

Then('a resposta deve ter o status 401 sem a frequência de turma por componente', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

Then('a resposta deve ter o status 601 com a mensagem de erro', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)
    expect(response.status).to.eq(601)
    expect(response.body).to.deep.equal({
      "mensagens": [
        "Turma não encontrada"
      ],
      "existemErros": true 
    })
  })
})


