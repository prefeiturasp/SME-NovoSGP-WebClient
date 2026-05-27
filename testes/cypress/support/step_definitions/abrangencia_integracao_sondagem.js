import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps'

let token
let response

Before(() => {
  cy.gerar_token().then((token_valido) => {
    token = token_valido
  })
})

/**
 * =============================
 * GIVEN
 * =============================
 */

Given('que possuo um token de acesso válido', function () {
  expect(token, 'Token não foi gerado').to.exist
})

Given('que não possuo um token de acesso válido', () => {
})

/**
 * =============================
 * WHEN
 * =============================
 */

// SUCESSO
When('envio uma requisição GET de abrangência integração válida', function () {
  cy.request({
    method: 'GET',
    url: `${Cypress.config('baseUrl')}/api/v1/abrangencias/integracoes/${Cypress.env('USUARIO_RF')}/perfis/${Cypress.env('USUARIO_PERFIL')}/acesso-sondagem`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`,
      'x-sgp-api-key': Cypress.env('API_KEY') || ''
    },
    failOnStatusCode: false
  }).then((res) => {
    response = res
  })
})

// RF INVÁLIDO
When('envio uma requisição GET de abrangência integração com RF inválido', function () {
  cy.request({
    method: 'GET',
    url: `${Cypress.config('baseUrl')}/api/v1/abrangencias/integracoes/000000/perfis/${Cypress.env('USUARIO_PERFIL')}/acesso-sondagem`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`,
      'x-sgp-api-key': Cypress.env('API_KEY') || ''
    },
    failOnStatusCode: false
  }).then((res) => {
    response = res
  })
})

// PERFIL INVÁLIDO
When('envio uma requisição GET de abrangência integração com perfil inválido', function () {
  cy.request({
    method: 'GET',
    url: `${Cypress.config('baseUrl')}/api/v1/abrangencias/integracoes/${Cypress.env('USUARIO_RF')}/perfis/00000000-0000-0000-0000-000000000000/acesso-sondagem`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`,
      'x-sgp-api-key': Cypress.env('API_KEY') || ''
    },
    failOnStatusCode: false
  }).then((res) => {
    response = res
  })
})

// SEM API KEY
When('envio uma requisição GET de abrangência integração sem api key', function () {
  cy.request({
    method: 'GET',
    url: `${Cypress.config('baseUrl')}/api/v1/abrangencias/integracoes/${Cypress.env('USUARIO_RF')}/perfis/${Cypress.env('USUARIO_PERFIL')}/acesso-sondagem`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).then((res) => {
    response = res
  })
})

// SEM TOKEN
When('envio uma requisição GET de abrangência integração sem autorização', function () {
  cy.request({
    method: 'GET',
    url: `${Cypress.config('baseUrl')}/api/v1/abrangencias/integracoes/${Cypress.env('USUARIO_RF')}/perfis/${Cypress.env('USUARIO_PERFIL')}/acesso-sondagem`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token-invalido',
      'x-sgp-api-key': Cypress.env('API_KEY') || ''
    },
    failOnStatusCode: false
  }).then((res) => {
    response = res
  })
})

/**
 * =============================
 * THEN
 * =============================
 */

Then('retorna os dados com status 200 de abrangência integração', function () {
  expect(response, 'Response não definida').to.exist
  expect(response.status).to.eq(200)
})

Then('retorna status 422 de erro', function () {
  expect(response, 'Response não definida').to.exist
  expect(response.status).to.eq(422)
})

Then('retorna status 401 não autorizado', function () {
  expect(response, 'Response não definida').to.exist
  expect(response.status).to.eq(401)
})