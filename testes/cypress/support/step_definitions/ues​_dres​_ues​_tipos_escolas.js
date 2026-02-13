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

// Retorna dados do tipo da UE
When('envio uma requisição GET para endpoint de tipos escolas', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ues/dres/${Cypress.env('DRE_CODIGO')}/ues/${Cypress.env('UE_CODIGO')}/tipos-escolas`,
    headers: {
        accept: 'text/plain',
        Authorization: `Bearer ${token}`
    },    
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 de sucesso com os dados', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array').and.not.be.empty
        response.body.forEach(item => {
          expect(item).to.have.all.keys('codTipoEscola', 'descricao', 'id')
          expect(item.codTipoEscola).to.be.a('number')
          expect(item.descricao).to.be.a('string')
          expect(item.id).to.be.a('number')
        })
    })
}) 

// Não retorna dados sem usuário autenticado
When('tento uma requisição GET para endpoint de tipos escolas', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ues/${Cypress.env('UE_CODIGO')}/modalidades/${Cypress.env('MODALIDADE_CODIGO')}?ano=${Cypress.env('ANO_LETIVO')}`,
    headers: {
        accept: 'text/plain',
        Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem os dados', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Código da DRE deve ser obrigatório
When('envio uma requisição GET para endpoint dos tipos de UE', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ues/dres//ues/${Cypress.env('UE_CODIGO')}/tipos-escolas`,
    headers: {
        accept: 'text/plain',
        Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('não informo a DRE', function () {  
})

Then('retorna o status 500 sem os dados de UE', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)            
  })
})

// Código da UE deve ser obrigatório
When('envio uma requisição GET para endpoint de tipos', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ues/dres/${Cypress.env('DRE_CODIGO')}/ues//tipos-escolas`,
    headers: {
        accept: 'text/plain',
        Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('não informo a UE', function () {  
})

Then('retorna o status 500 sem os dados da DRE', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)            
  })
})
