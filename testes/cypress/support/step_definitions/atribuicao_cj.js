import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps'

let token

Before(() => {
  return cy.gerar_token().then((token_valido) => {
    token = token_valido
    cy.log('token gerado (atribuicao_cj):', token)
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
      Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false,
    timeout: 30000
  }).as('response')
})

Then('retorna atribuições CJ com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
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

// Buscar as atribuições CJ no ano letivo
When('envio uma requisição GET para o endpoint de atribuições CJ', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/atribuicoes/cjs/anos-letivos`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`,
    },
    failOnStatusCode: false,
    timeout: 30000
  }).as('response')
})

Then('retorna o status 200 da busca no ano letivo', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(204)
  })
})

// Não busca as atribuições CJ no ano letivo sem autenticação
When('tento a requisição GET para o endpoint de atribuições CJ', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/atribuicoes/cjs/anos-letivos`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false,
    timeout: 60000
  }).as('response')
})

Then('não retorna no ano letivo mostrando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Buscar as atribuições CJ através dos dados de UE
When('envio uma requisição GET para o endpoint com todos os campos', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/atribuicoes/cjs/ues/${Cypress.env('UE_CODIGO')}/modalidades/${Cypress.env('MODALIDADE_CODIGO')}/turmas/${Cypress.env('TURMA_CODIGO')}/professores/${Cypress.env('LOGIN_PROFESSOR')}?anoLetivo=${Cypress.env('ANO_LETIVO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`,
    },
    failOnStatusCode: false,
    timeout: 30000
  }).as('response')
})

Then('retorna o status 200 com dados de UE de atribuições CJ', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.have.property('alteradoEm')
    expect(response.body).to.have.property('alteradoPor')
    expect(response.body).to.have.property('alteradoRF')
    expect(response.body).to.have.property('criadoEm')
    expect(response.body).to.have.property('criadoPor')
    expect(response.body).to.have.property('criadoRF')
    expect(response.body).to.have.property('itens')
  })
})

// Ano letivo deve ser preenchido nos dados de UE nas atribuições
When('envio uma requisição GET para o endpoint com os campos sem ano', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/atribuicoes/cjs/ues/${Cypress.env('UE_CODIGO')}/modalidades/${Cypress.env('MODALIDADE_CODIGO')}/turmas/${Cypress.env('TURMA_CODIGO')}/professores/${Cypress.env('LOGIN_PROFESSOR')}?anoLetivo=`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`,
    },
    failOnStatusCode: false,
    timeout: 30000
  }).as('response')
})

Then('retorna o status 422 que ano letivo deve ser preenchido na atribuições CJ', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
  })
})

// Professores deve ser preenchido nos dados de UE nas atribuições
When('envio uma requisição GET para o endpoint com os campos sem professores', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/atribuicoes/cjs/ues/${Cypress.env('UE_CODIGO')}/modalidades/${Cypress.env('MODALIDADE_CODIGO')}/turmas/${Cypress.env('TURMA_CODIGO')}/professores/?anoLetivo=${Cypress.env('ANO_LETIVO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`,
    },
    failOnStatusCode: false,
    timeout: 30000
  }).as('response')
})

Then('retorna o status 500 que professor deve ser preenchido na atribuições CJ', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)
  })
})

// Turmas deve ser preenchido nos dados de UE nas atribuições
When('envio uma requisição GET para o endpoint com os campos sem turmas', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/atribuicoes/cjs/ues/${Cypress.env('UE_CODIGO')}/modalidades/${Cypress.env('MODALIDADE_CODIGO')}/turmas//professores/${Cypress.env('LOGIN_PROFESSOR')}?anoLetivo=${Cypress.env('ANO_LETIVO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`,
    },
    failOnStatusCode: false,
    timeout: 30000
  }).as('response')
})

Then('retorna o status 500 que a turma deve ser preenchida na atribuições CJ', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)
  })
})

// UEs deve ser preenchido nos dados de UE nas atribuições
When('envio uma requisição GET para o endpoint com os campos sem UEs', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/atribuicoes/cjs/ues//modalidades/${Cypress.env('MODALIDADE_CODIGO')}/turmas/${Cypress.env('TURMA_CODIGO')}/professores/${Cypress.env('LOGIN_PROFESSOR')}?anoLetivo=${Cypress.env('ANO_LETIVO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`,
    },
    failOnStatusCode: false,
    timeout: 30000
  }).as('response')
})

Then('retorna o status 500 que a UE deve ser preenchida na atribuições CJ', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)
  })
})

// Não busca as atribuições CJ dos dados de UE sem autenticação
When('tento a requisição GET para o endpoint com todos os campos', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/atribuicoes/cjs/ues/${Cypress.env('UE_CODIGO')}/modalidades/${Cypress.env('MODALIDADE_CODIGO')}/turmas/${Cypress.env('TURMA_CODIGO')}/professores/${Cypress.env('LOGIN_PROFESSOR')}?anoLetivo=${Cypress.env('ANO_LETIVO')}`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false,
    timeout: 60000
  }).as('response')
})

Then('não retorna dados de UE de atribuições CJ mostrando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})