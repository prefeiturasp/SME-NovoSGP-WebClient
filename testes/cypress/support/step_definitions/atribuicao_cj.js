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

Given('que não possuo um token de acesso válido', () => { 
})

// Busca as atribuições CJ
When('envio uma requisição GET para o endpoint atribuições', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/atribuicoes/cjs`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false,
    timeout: 300000
  }).as('response')
})

Then('retorna atribuições CJ com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
  })
})

// Não busca as atribuições CJ sem autenticação
When('tento a requisição GET para o endpoint atribuições', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/atribuicoes/cjs`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false,
    timeout: 60000
  }).as('response')
})

Then('não retorna atribuições CJ mostrando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Cadastrar atribuição CJS com dados válidos
When('envio uma requisição POST para cadastrar atribuições CJ', function () { 
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/atribuicoes/cjs`,
    headers: {
      accept: '*/*',
      authorization: `Bearer ${token}`,
      'Content-Type': 'application/json-patch+json'
    },
    body: {
      disciplinas: [
        {
          disciplinaId: `${Cypress.env('DISCIPLINA_CODIGO')}`,
          substituir: true
        }
      ],
      dreId: `${Cypress.env('DRE_CODIGO')}`,
      modalidade: Number(Cypress.env('MODALIDADE_CODIGO')),
      turmaId: `${Cypress.env('TURMA_CODIGO')}`,
      ueId: `${Cypress.env('UE_CODIGO')}`,
      usuarioRf: `${Cypress.env('CODIGO_RF')}`,
      anoLetivo: `${Cypress.env('ANO_LETIVO')}`,
      historico: true
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna status 200 confirmando o cadastro', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.equal(200)
  })
})

// Código da disciplina deve ser preenchido
When('envio a requisição do CJ com disciplina vazia', function () { 
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/atribuicoes/cjs`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json-patch+json'
    },
    body: {
      disciplinas: [
        {
          disciplinaId: ` `,
          substituir: true
        }
      ],
      dreId: `${Cypress.env('DRE_CODIGO')}`,
      modalidade: Number(Cypress.env('MODALIDADE_CODIGO')),
      turmaId: `${Cypress.env('TURMA_CODIGO')}`,
      ueId: `${Cypress.env('UE_CODIGO')}`,
      usuarioRf: `${Cypress.env('CODIGO_RF')}`,
      anoLetivo: `${Cypress.env('ANO_LETIVO')}`,
      historico: true
    },
    failOnStatusCode: false
  }).as('response')
})

Then('deve retornar status 422 por não ter sido preenchido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.equal(422)
  })
})

// Código da turma deve ser preenchido
When('envio a requisição CJS com turma vazia', function () { 
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/atribuicoes/cjs`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json-patch+json'
    }, 
    body: {
      disciplinas: [
        {
          disciplinaId: `${Cypress.env('DISCIPLINA_CODIGO')}`,
          substituir: true
        }
      ],
      dreId: `${Cypress.env('DRE_CODIGO')}`,
      modalidade: Number(Cypress.env('MODALIDADE_CODIGO')),
      turmaId: ` `,
      ueId: `${Cypress.env('UE_CODIGO')}`,
      usuarioRf: `${Cypress.env('CODIGO_RF')}`,
      anoLetivo: `${Cypress.env('ANO_LETIVO')}`,
      historico: true
    },
    failOnStatusCode: false
  }).as('response')
})

Then('deve retornar status 422 de sem preenchimento', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.equal(422)
    expect(response.body).to.have.property('existemErros', true)
    expect(response.body).to.have.property('mensagens').that.is.an('array').and.not.empty
    expect(response.body.mensagens[0]).to.equal('É necessário informar a turma.') 
  })
})

// Modalidade deve ser preenchida
When('envio a requisição CJS com modalidade vazia', function () { 
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/atribuicoes/cjs`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json-patch+json'
    },
    body: {
      disciplinas: [
        {
          disciplinaId: `${Cypress.env('DISCIPLINA_CODIGO')}`,
          substituir: true
        }
      ],
      dreId: `${Cypress.env('DRE_CODIGO')}`,
      modalidade: ` `,
      turmaId: `${Cypress.env('TURMA_CODIGO')}`,
      ueId: `${Cypress.env('UE_CODIGO')}`,
      usuarioRf: `${Cypress.env('CODIGO_RF')}`,
      anoLetivo: `${Cypress.env('ANO_LETIVO')}`,
      historico: true
    },
    failOnStatusCode: false
  }).as('response')
})

Then('deve retornar status 422 de sem modalidade', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.equal(422)
  })
})

// DRE deve ser preenchida
When('envio a requisição CJS com DRE vazio', function () { 
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/atribuicoes/cjs`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json-patch+json'
    },
    body: {
      disciplinas: [
        {
          disciplinaId: `${Cypress.env('DISCIPLINA_CODIGO')}`,
          substituir: true
        }
      ],
      dreId: ` `,
      modalidade: Number(Cypress.env('MODALIDADE_CODIGO')),
      turmaId: `${Cypress.env('TURMA_CODIGO')}`,
      ueId: `${Cypress.env('UE_CODIGO')}`,
      usuarioRf: `${Cypress.env('CODIGO_RF')}`,
      anoLetivo: `${Cypress.env('ANO_LETIVO')}`,
      historico: true
    },
    failOnStatusCode: false
  }).as('response')
})

Then('deve retornar status 422 sem a DRE', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.equal(422)
    expect(response.body).to.have.property('existemErros', true)
    expect(response.body).to.have.property('mensagens').that.is.an('array').and.not.empty
    expect(response.body.mensagens[0]).to.equal('É necessário informar a Dre.') 
  })
})

// UE deve ser preenchida
When('envio a requisição CJS com UE vazio', function () { 
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/atribuicoes/cjs`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json-patch+json'
    },
    body: {
      disciplinas: [
        {
          disciplinaId: `${Cypress.env('DISCIPLINA_CODIGO')}`,
          substituir: true
        }
      ],
      dreId: `${Cypress.env('DRE_CODIGO')}`,
      modalidade: Number(Cypress.env('MODALIDADE_CODIGO')),
      turmaId: `${Cypress.env('TURMA_CODIGO')}`,
      ueId: ` `,
      usuarioRf: `${Cypress.env('CODIGO_RF')}`,
      anoLetivo: `${Cypress.env('ANO_LETIVO')}`,
      historico: true
    },
    failOnStatusCode: false
  }).as('response')
})

Then('deve retornar status 422 sem a UE', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.equal(422)
    expect(response.body).to.have.property('existemErros', true)
    expect(response.body).to.have.property('mensagens').that.is.an('array').and.not.empty
    expect(response.body.mensagens[0]).to.equal('É necessário informar a Ue.') 
  })
})

// Ano letivo deve ser preenchido
When('envio a requisição CJS com ano letivo vazio', function () { 
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/atribuicoes/cjs`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json-patch+json'
    },
    body: {
      disciplinas: [
        {
          disciplinaId: `${Cypress.env('DISCIPLINA_CODIGO')}`,
          substituir: true
        }
      ],
      dreId: `${Cypress.env('DRE_CODIGO')}`,
      modalidade: Number(Cypress.env('MODALIDADE_CODIGO')),
      turmaId: `${Cypress.env('TURMA_CODIGO')}`,
      ueId: `${Cypress.env('UE_CODIGO')}`,
      usuarioRf: `${Cypress.env('CODIGO_RF')}`,
      anoLetivo: ` `,
      historico: true
    },
    failOnStatusCode: false
  }).as('response')
})

Then('deve retornar status 500 devido o ano ser obrigatório', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.equal(500)
  })
})

// Cadastrar atribuição CJS com histórico false
When('envio a requisição CJS com historico false', function () { 
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/atribuicoes/cjs`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json-patch+json'
    },
    body: {
      disciplinas: [
        {
          disciplinaId: `${Cypress.env('DISCIPLINA_CODIGO')}`,
          substituir: true
        }
      ],
      dreId: `${Cypress.env('DRE_CODIGO')}`,
      modalidade: Number(Cypress.env('MODALIDADE_CODIGO')),
      turmaId: `${Cypress.env('TURMA_CODIGO')}`,
      ueId: `${Cypress.env('UE_CODIGO')}`,
      usuarioRf: `${Cypress.env('CODIGO_RF')}`,
      anoLetivo: `${Cypress.env('ANO_LETIVO')}`,
      historico: false
    },
    failOnStatusCode: false
  }).as('response')
})

Then('o sistema deve retornar status 200 de cadastrado', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.equal(200)
  })
})

// Não cadastrar atribuições CJ sem autenticação
When('tento a requisição POST para cadastrar atribuições CJ', function () { 
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/atribuicoes/cjs`,
    headers: {
      accept: '*/*',
      Authorization: 'Bearer token_invalido',
      'Content-Type': 'application/json-patch+json'
    },
    body: {
      disciplinas: [
        {
          disciplinaId: `${Cypress.env('DISCIPLINA_CODIGO')}`,
          substituir: true
        }
      ],
      dreId: `${Cypress.env('DRE_CODIGO')}`,
      modalidade: Number(Cypress.env('MODALIDADE_CODIGO')),
      turmaId: `${Cypress.env('TURMA_CODIGO')}`,
      ueId: `${Cypress.env('UE_CODIGO')}`,
      usuarioRf: `${Cypress.env('CODIGO_RF')}`,
      anoLetivo: `${Cypress.env('ANO_LETIVO')}`,
      historico: true
    },
    failOnStatusCode: false
  }).as('response')
})

Then('não cadastra atribuições CJ mostrando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.equal(401)
  })
})
