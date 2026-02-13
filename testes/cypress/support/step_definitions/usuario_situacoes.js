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

// Situações do usuário devem ser listadas
When('envio uma requisição GET para o endpoint de situações dos usuários', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/usuarios/situacoes`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})


Then('retorna o status 200 listando todas disponíveis', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)

    const situacoes = [
     { key: 1, value: 'Ativo' },
     { key: 2, value: 'Bloqueado' },
     { key: 3, value: 'Excluido' },
     { key: 4, value: 'Padrão Sistema' },
     { key: 5, value: 'Senha Expirada' }
    ]

    response.body.forEach((situacao, index) => {
      const esperado = situacoes[index]
        expect(situacao).to.deep.equal(esperado)
    })
  })
})

// Não acessar sem autenticação
When('tento a requisição GET para o endpoint de situações dos usuários', function () { 
  cy.request({
   method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/usuarios/situacoes`,
      headers: {
        accept: 'text/plain',
        Authorization: 'Bearer token_invalido' },
      failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401) 
  })
})