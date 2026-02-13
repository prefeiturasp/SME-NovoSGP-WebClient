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

// Retornar dashboard de acompanhamento do aluno e DRE
When('envio uma requisição GET para o endpoint de acompanhamento de aprendizagem', function () { 
    return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/acompanhamento-aprendizagem/acompanhamento-aluno-dre?AnoLetivo=${Cypress.env('ANO_LETIVO')}`,
        headers: {
          accept: 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false  
  }).as('response')
})

Then('retorna o status 200 com dados por aluno e DRE', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)    
  })
})

// Não retorna dados sem usuário autenticado
When('tento a requisição GET para o endpoint de acompanhamento de aprendizagem', function () { 
    return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/acompanhamento-aprendizagem/acompanhamento-aluno-dre?AnoLetivo=${Cypress.env('ANO_LETIVO')}`,
        headers: {
          accept: 'text/plain',
         'Authorization': 'Bearer token_invalido' },
        failOnStatusCode: false
    }).as('response')
})

Then('retorna o status 401 sem dados por aluno e DRE', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)   
  })
})

// Ano letivo deve ser informado
Given('que não login não gerou um token de acesso válido', () => {  
})

When('tento a requisição GET para o endpoint de dashboard de aprendizagem', function () { 
    return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard/acompanhamento-aprendizagem/acompanhamento-aluno-dre?AnoLetivo=`,
        headers: {
          accept: 'text/plain',            
          'Authorization': `Bearer ${token}`
        },          
        failOnStatusCode: false 
    }).as('response')
})

Then('não insiro o ano letivo', function () {  
})

Then('retorna o status 422 sem os dados de acompanhamento por aluno e DRE', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
  })
})
