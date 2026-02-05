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

// Carrega os dados do relatório
When('envio uma requisição POST para NAAPA dinâmico', function () { 
  cy.request({
    method: 'POST',
      url: Cypress.config('baseUrl') + `/api/v1/relatorio-dinamico-naapa`,
      headers: {
        accept: 'text/plain',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json-patch+json'
      },
        body: {
          historico: Cypress.env('HISTORICO') === 'false', 
          anoLetivo: Number(Cypress.env('ANO_LETIVO')),
          dreId: Cypress.env('DRE_CODIGO'),
          ueId: Cypress.env('UE_CODIGO'),
          modalidades: Array.isArray(Cypress.env('MODALIDADE_CODIGO'))
             ? Cypress.env('MODALIDADE_CODIGO')
             : Cypress.env('MODALIDADE_CODIGO')
             ? [Number(Cypress.env('MODALIDADE_CODIGO'))]
             : [],
          anos: Array.isArray(Cypress.env('ANOS'))
             ? Cypress.env('ANOS')
             : Cypress.env('ANOS')
             ? [String(Cypress.env('ANOS'))]
             : [],
          filtroAvancado: Array.isArray(Cypress.env('FILTRO_AVANCADO'))
             ? Cypress.env('FILTRO_AVANCADO')
             : [],
        },
    failOnStatusCode: false     
  }).as('response')
})

Then('carrega o status 200 o relatório dinâmico NAAPA', function () {
  cy.get('@response').then((response) => {
   expect(response.status).to.eq(200)
      expect(response.body).to.have.property('totalRegistro')
    })
  })

// Não retorna dados sem usuário autenticado
Given('que não possuo um token de acesso válido', () => {
})

When('tento a requisição POST para NAAPA dinâmico', function () { 
  cy.request({
    method: 'POST',
      url: Cypress.config('baseUrl') + `/api/v1/relatorio-dinamico-naapa`,
      headers: {
        accept: 'text/plain',
          'Authorization': 'Bearer token_invalido',
          'Content-Type': 'application/json-patch+json'
        },
      body: {
        historico: false,
        anoLetivo: 2025,
        dreId: '',
        ueId: '',
        modalidades: [],
        anos: [],
    filtroAvancado: []
      },
    failOnStatusCode: false
  }).as('response')
})

Then('não retorna o relatório dinâmico NAAPA mostrando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})
