import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps'

let token
let response

Before(() => {
  cy.gerar_token().then((token_valido) => {
    token = token_valido
  })
})

Given('que possuo um token de acesso válido', function () {
  expect(token, 'valido').to.exist
})

Given('que não possuo um token de acesso válido', () => {
})

/**
 * =============================
 * BODY BASE
 * =============================
 */

const bodyValido = {
  id: 0,
  alteradoEm: new Date().toISOString(),
  alteradoPor: "Teste QA",
  alteradoRF: "123456",
  criadoEm: new Date().toISOString(),
  criadoPor: "Teste QA",
  criadoRF: "123456",
  ueId: 1,
  nome: "Usuário Teste",
  cpf: "12345678901",
  email: "teste@email.com",
  telefone: "11999999999",
  situacao: true,
  cep: Cypress.env('CEP_VALIDO'),
  endereco: "Rua Teste",
  numero: 123,
  complemento: "Apto 1",
  bairro: "Centro",
  cidade: "São Paulo",
  estado: "SP",
  excluido: false,
  ueCodigo: Cypress.env('UE_CODIGO'),
  dreCodigo: Cypress.env('DRE_CODIGO')
}

const bodyInvalido = {
  nome: "",
  cpf: "000",
  email: "invalido",
}

/**
 * =============================
 * WHEN
 * =============================
 */

// SUCESSO
When('envio uma requisição POST de usuário válida', function () {
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/usuarios`,
    body: bodyValido,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).then((res) => {
    response = res
  })
})

// INVALIDO
When('envio uma requisição POST de usuário inválida', function () {
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/usuarios`,
    body: bodyInvalido,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).then((res) => {
    response = res
  })
})

// SEM AUTORIZAÇÃO
When('envio uma requisição POST de usuário sem autorização', function () {
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/usuarios`,
    body: bodyValido,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token-invalido'
    },
    failOnStatusCode: false
  }).then((res) => {
    response = res
  })
})

// SEM ALTERAÇÃO (simulação)
When('envio uma requisição POST sem alteração de usuário', function () {
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/usuarios`,
    body: bodyValido,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
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

Then('retorna os dados do usuário com status 200', function () {
  expect(response.status).to.eq(200)
  expect(response.body).to.have.property('id')
  expect(response.body).to.have.property('nome')
})

Then('retorna status 500 de erro', function () {
  expect(response.status).to.eq(500)
})

Then('retorna status 401 não autorizado', function () {
  expect(response.status).to.eq(401)
})

Then('retorna status 204 sem conteúdo', function () {
  expect(response.status).to.eq(204)
})