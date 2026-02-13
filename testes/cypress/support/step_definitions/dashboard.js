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

// Carrega os dashboards da tela inicial
When('envio uma requisição GET para o endpoint de dashboard', function () { 
    return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/dashboard`,
        headers: {
            accept: 'text/plain',            
            'Authorization': `Bearer ${token}`
          },          
          failOnStatusCode: false
    }).as('response')
})

Then('retorna o status 200 carregando os dados', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
        response.body.forEach((item) => {
          expect(item).to.have.all.keys('descricao', 'usuarioTemPermissao', 'turmaObrigatoria', 'rota', 'icone')
          expect(item.descricao).to.be.a('string').and.not.be.empty
          expect(item.usuarioTemPermissao).to.be.a('boolean')
          expect(item.turmaObrigatoria).to.be.a('boolean')
          expect(item.rota).to.be.a('string').and.not.be.empty
          expect(item.icone).to.be.a('string').and.not.be.empty
        })
    })
})

// Não exibe o dashboard sem usuário autenticado
Given('que não login não gerou um token de acesso válido', () => {
  token = 'token_invalido'
})

When('tento a requisição GET para o endpoint de dashboard', function () { 
  return cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/dashboard`,
      headers: {
           accept: 'text/plain',
           'Authorization': 'Bearer token_invalido' },
    failOnStatusCode: false
    }).as('response')
})

Then('retorna o status 401 sem os dados', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})
