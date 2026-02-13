import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

Given('que acesso o endpoint de cache', function () {  
})

// Retornar os dados de cache chaves
When('envio uma requisição GET', function () {   
    return cy.request({
      method: 'GET',
      url: Cypress.config('baseUrl') + '/api/v1/cache/chaves',
      headers: {
        accept: 'text/plain',
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com as chaves', function () {
  cy.get('@response').then((response) => {
    cy.log(JSON.stringify(response.body))
    expect(response.status).to.eq(200)
    expect(response.body).to.be.an('array').and.not.empty
  })
})



