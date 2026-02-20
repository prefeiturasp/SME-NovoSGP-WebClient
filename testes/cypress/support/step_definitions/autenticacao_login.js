import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps'

let token

Before(() => {
  cy.gerar_token().then((token_valido) => {
    token = token_valido
  })
})

Given('que vou autenticar', function () {
})

// Permitir realizar login com credenciais válidas
When('envio a requisição POST com credenciais válidas', function () { 

  const usuarioValido = Cypress.env('LOGIN_ADM_COTIC')
  const senhaValida = Cypress.env('SENHA')

  cy.request({
    method: 'POST',
		url: Cypress.config('baseUrl') + '/api/v1/autenticacao',
		body: {
			login: usuarioValido,
			senha: senhaValida,
		},
		timeout: 60000,
		failOnStatusCode: false,
	}).then((responseUserToken) => {
		globalThis.token =
		responseUserToken.allRequestResponses[0]['Response Body'].access
  }).as('response')
})

Then('realiza o login com sucesso', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.statusText).to.eq('OK')
    expect(response.body).to.exist
  })
})

// Não autorizar acesso com usuário inválido
When('envio a requisição POST com usuário inválido', function () { 

  const usuarioInValido = Cypress.env('USUARIO_INVALIDO')
  const senhaValida = Cypress.env('SENHA')

  cy.request({
    method: 'POST',
		url: Cypress.config('baseUrl') + '/api/v1/autenticacao',
		body: {
			login: usuarioInValido,
			senha: senhaValida,
		},
		timeout: 60000,
		failOnStatusCode: false,
	}).then((responseUserToken) => {
		globalThis.token =
		responseUserToken.allRequestResponses[0]['Response Body'].access
  }).as('response')
})

Then('não autoriza acesso', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
    expect(response.statusText).to.eq('Unauthorized')
    expect(response.body).to.exist
  })
})

// Não autorizar acesso com senha inválida
When('envio a requisição POST com senha inválida', function () { 

  const usuarioValido = Cypress.env('LOGIN_ADM_COTIC')
  const senhaInValida = Cypress.env('SENHA_INVALIDA')

  cy.request({
    method: 'POST',
		url: Cypress.config('baseUrl') + '/api/v1/autenticacao',
		body: {
			login: usuarioValido,
			senha: senhaInValida,
		},
		timeout: 60000,
		failOnStatusCode: false,
	}).then((responseUserToken) => {
		globalThis.token =
		responseUserToken.allRequestResponses[0]['Response Body'].access
  }).as('response')
})

Then('não autoriza acesso o login', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
    expect(response.statusText).to.eq('Unauthorized')
    expect(response.body).to.exist
  })
})

// Não autorizar acesso com usuário inexistente
When('envio a requisição POST com usuário inexistente', function () { 

  const usuarioInexistente = Cypress.env('USUARIO_INEXISTENTE')
  const senhaInValida = Cypress.env('SENHA_INVALIDA')

  cy.request({
    method: 'POST',
		url: Cypress.config('baseUrl') + '/api/v1/autenticacao',
		body: {
			login: usuarioInexistente,
			senha: senhaInValida,
		},
		timeout: 60000,
		failOnStatusCode: false,
	}).then((responseUserToken) => {
		globalThis.token =
		responseUserToken.allRequestResponses[0]['Response Body'].access
  }).as('response')
})

Then('retorna não autorizado', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
    expect(response.statusText).to.eq('Unauthorized')
    expect(response.body).to.exist
  })
})

// Usuário deve ser inserido para acesso
When('envio a requisição POST com usuário vazio', function () { 

  const usuarioBranco = ' ' 
  const senhaInValida = Cypress.env('SENHA_INVALIDA')

  cy.request({
    method: 'POST',
		url: Cypress.config('baseUrl') + '/api/v1/autenticacao',
		body: {
			login: usuarioBranco,
			senha: senhaInValida,
		},
		timeout: 60000,
		failOnStatusCode: false,
	}).then((responseUserToken) => {
		globalThis.token =
		responseUserToken.allRequestResponses[0]['Response Body'].access
  }).as('response')
})

Then('retorna que usuário deve ser inserido para acesso', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    expect(response.statusText).to.eq('Unprocessable Entity')
    expect(response.body).to.exist
  })
})

// Não permitir acesso sem inserir a senha
When('envio a requisição POST com senha vazia', function () { 

  const usuarioValido = Cypress.env('LOGIN_ADM_COTIC')
  const senhaBranco = ' '

  cy.request({
    method: 'POST',
		url: Cypress.config('baseUrl') + '/api/v1/autenticacao',
		body: {
			login: usuarioValido,
			senha: senhaBranco,
		},
		timeout: 60000,
		failOnStatusCode: false,
	}).then((responseUserToken) => {
		globalThis.token =
		responseUserToken.allRequestResponses[0]['Response Body'].access
  }).as('response')
})

Then('não permitir acesso sem inserir a senha', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    expect(response.statusText).to.eq('Unprocessable Entity')
    expect(response.body).to.exist
  })
})