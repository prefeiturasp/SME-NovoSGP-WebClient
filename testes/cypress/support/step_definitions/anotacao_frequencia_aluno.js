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

// Retorna a anotação do aluno através do id
When('envio uma requisição GET para o endpoint do id da anotação', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/anotacoes/alunos/${Cypress.env('ANOTACAO_FREQUENCIA_ALUNO_ID')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna os dados do id com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.have.property('id')
    expect(response.body).to.have.property('motivoAusenciaId')
    expect(response.body).to.have.property('motivoAusencia')
    expect(response.body).to.have.property('anotacao')
    expect(response.body).to.have.property('aulaId')
    expect(response.body).to.have.property('codigoAluno')
    expect(response.body).to.have.property('aluno')
    expect(response.body).to.have.property('auditoria')
    expect(response.body.motivoAusencia).to.have.property('id', 7)
    expect(response.body.motivoAusencia).to.have.property('descricao', 'Falta de transporte')
    expect(response.body.aluno).to.have.property('nome')
    expect(response.body.aluno).to.have.property('numeroChamada')
    expect(response.body.aluno).to.have.property('dataNascimento')
    expect(response.body.aluno).to.have.property('codigoEOL')
    expect(response.body.aluno).to.have.property('situacaoCodigo')
    expect(response.body.aluno).to.have.property('situacao')
    expect(response.body.aluno).to.have.property('frequencia')
    expect(response.body.aluno).to.have.property('nomeResponsavel')
    expect(response.body.auditoria).to.have.property('id')
    expect(response.body.auditoria).to.have.property('criadoEm')
    expect(response.body.auditoria).to.have.property('criadoPor')
    expect(response.body.auditoria).to.have.property('criadoRF')
  })
})

// Id da anotação é obrigatório na consulta do aluno
When('envio uma requisição GET para o endpoint sem id da anotação', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/anotacoes/alunos/`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 405 que o id é obrigatório', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(405)   
  })
})

// Id da anotação inválido na consulta do aluno
When('envio uma requisição GET para o endpoint com id da anotação incorreto', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/anotacoes/alunos/${Cypress.env('ANOTACAO_FREQUENCIA_ALUNO_ID_INVALIDO')}`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 601 que o id deve ser informado', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)
    expect(response.body).to.have.property('existemErros', true)
    expect(response.body).to.have.property('mensagens').that.is.an('array').and.not.empty
    expect(response.body.mensagens[0]).to.eq("O id deve ser informado para consulta da anotação de frequência do aluno.")
  })
})

// Id da anotação inexistente na consulta do aluno
When('envio uma requisição GET para o endpoint com id da anotação inexistente', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/anotacoes/alunos/${Cypress.env('ANOTACAO_FREQUENCIA_ALUNO_ID_INEXISTENTE')}`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 601 que anotação não foi encontrada', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)
    expect(response.body).to.have.property('existemErros', true)
    expect(response.body.mensagens[0]).to.eq("Anotação não encontrada!")
  })
})

// Não retorna a anotação do aluno através do id sem autenticação
When('tento a requisição GET para o endpoint do id da anotação', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/anotacoes/alunos/${Cypress.env('ANOTACAO_FREQUENCIA_ALUNO_ID')}`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('não retorna dados da anotação id mostrando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Retorna a anotação do aluno na aula
When('envio uma requisição GET para o endpoint de anotação do aluno na aula', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/anotacoes/alunos/${Cypress.env('ALUNO_ID')}/aulas/${Cypress.env('AULA_CODIGO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna os dados do id aula com status 204', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(204)   
  })
})

// Id do aluno é obrigatório na anotação da aula
When('envio uma requisição GET para o endpoint sem id do aluno na aula', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/anotacoes/alunos//aulas/${Cypress.env('AULA_CODIGO')}`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 500 sem dados de aula', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)   
  })
})

// Id da aula é obrigatório na anotação do aluno
When('envio uma requisição GET para o endpoint sem id da aula do aluno', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/anotacoes/alunos/${Cypress.env('ALUNO_ID')}/aulas/`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 500 sem dados de aluno', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500) 
  })
})

// Não retorna a anotação do aluno através do id sem autenticação
When('tento a requisição GET para o endpoint do id da anotação', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/anotacoes/alunos/${Cypress.env('ALUNO_ID')}/aulas/${Cypress.env('AULA_CODIGO')}`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('não retorna dados da anotação id mostrando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Retorna os motivos de ausências nas anotações do aluno
When('envio uma requisição GET para o endpoint de motivos de ausências', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/anotacoes/alunos/motivos-ausencia`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 as descrições nas anotações do aluno', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.be.an('array').and.not.empty
    response.body.forEach((item) => {
      expect(item).to.have.all.keys('valor', 'descricao')
    })
    expect(response.body).to.deep.include({ valor: '1', descricao: 'Atestado Médico do Aluno' })
    expect(response.body).to.deep.include({ valor: '2', descricao: 'Atestado Médico de pessoa da Família' })
    expect(response.body).to.deep.include({ valor: '3', descricao: 'Doença na Família, sem atestado' })
    expect(response.body).to.deep.include({ valor: '4', descricao: 'Óbito de pessoa da Família' })
    expect(response.body).to.deep.include({ valor: '5', descricao: 'Inexistência de pessoa para levar à escola' })
    expect(response.body).to.deep.include({ valor: '6', descricao: 'Enchente' })
    expect(response.body).to.deep.include({ valor: '7', descricao: 'Falta de transporte' })
    expect(response.body).to.deep.include({ valor: '8', descricao: 'Violência na área onde mora' })
    expect(response.body).to.deep.include({ valor: '9', descricao: 'Calamidade pública que atingiu a escola ou exigiu o uso do espaço como abrigamento' })
    expect(response.body).to.deep.include({ valor: '10', descricao: 'Escola fechada por situação de violência' })
  })
})

// Não retorna os motivos de ausências sem autenticação
When('tento uma requisição GET para o endpoint de motivos de ausências', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/anotacoes/alunos/${Cypress.env('ALUNO_ID')}/aulas/${Cypress.env('AULA_CODIGO')}`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('não retorna as descrições exibindo o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Retorna as anotações do aluno na data selecionada
When('envio uma requisição GET para o endpoint de anotações na data', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/anotacoes/alunos/${Cypress.env('ALUNO_ID')}/data?dataInicio=${Cypress.env('DATA_INICIO')}&dataFim=${Cypress.env('DATA_FIM')}`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com os dados de aluno no período', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)    
  })
})

// Data de fim deve ser maior que início
When('envio uma requisição GET para o endpoint de anotações com data', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/anotacoes/alunos/${Cypress.env('ALUNO_ID')}/data?dataInicio=${Cypress.env('DATA_FIM')}&dataFim=${Cypress.env('DATA_INICIO')}`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

And('data de fim é maior que início', function () { 
})

Then('retorna o status 601 que o fim deve ser maior', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)
    expect(response.body).to.have.property('existemErros', true)
    expect(response.body).to.have.property('mensagens').that.is.an('array').and.not.empty
    expect(response.body.mensagens[0]).to.eq("A data de fim deve ser maior que a data de início")    
  })
})

// Não permitir data inválida
When('envio uma requisição GET para o endpoint de anotações da data', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/anotacoes/alunos/${Cypress.env('ALUNO_ID')}/data?dataInicio=${Cypress.env('DATA_INICIO')}&dataFim=${Cypress.env('DATA_INVALIDA')}`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

And('a data está inválida', function () { 
})

Then('retorna o status 422 que o valor é inválido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    expect(response.body).to.have.property('existemErros', true)
  })
})

// Data fim deve ser preenchida
When('envio uma requisição GET para o endpoint sem data fim preenchida', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/anotacoes/alunos/${Cypress.env('ALUNO_ID')}/data?dataInicio=${Cypress.env('DATA_INICIO')}&dataFim=`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 que data fim é inválida', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    expect(response.body).to.have.property('existemErros', true)
    expect(response.body).to.have.property('mensagens').that.is.an('array').and.not.empty
    expect(response.body.mensagens[0]).to.eq("The value '' is invalid.")    
  })
})

// Filtrar somente com data fim
When('envio uma requisição GET para o endpoint sem data fim', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/anotacoes/alunos/${Cypress.env('ALUNO_ID')}/data?dataInicio=${Cypress.env('DATA_INICIO')}`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 601 que data fim é obrigatório', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)
    expect(response.body).to.have.property('existemErros', true)
    expect(response.body).to.have.property('mensagens').that.is.an('array').and.not.empty
    expect(response.body.mensagens).to.include("Data de fim é obrigatória")
    expect(response.body.mensagens).to.include("A data de fim deve ser maior que a data de início")
  })
})

// Data início deve ser preenchida
When('envio uma requisição GET para o endpoint sem data início preenchida', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/anotacoes/alunos/${Cypress.env('ALUNO_ID')}/data?dataInicio=&dataFim=${Cypress.env('DATA_FIM')}`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 que data início é inválida', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    expect(response.body).to.have.property('existemErros', true)
    expect(response.body).to.have.property('mensagens').that.is.an('array').and.not.empty
    expect(response.body.mensagens[0]).to.eq("The value '' is invalid.")    
  })
})

// Filtrar somente com data início
When('envio uma requisição GET para o endpoint sem data início', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/anotacoes/alunos/${Cypress.env('ALUNO_ID')}/data?dataFim=${Cypress.env('DATA_FIM')}`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 601 que data início é obrigatório', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)
    expect(response.body).to.have.property('existemErros', true)
    expect(response.body).to.have.property('mensagens').that.is.an('array').and.not.empty
    expect(response.body.mensagens).to.include("Data de início é obrigatória")
  })
})

// Aluno deve ser preenchido
When('envio uma requisição GET para o endpoint da data sem o aluno', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/anotacoes/alunos//data?dataInicio=${Cypress.env('DATA_INICIO')}&dataFim=${Cypress.env('DATA_FIM')}`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 que a consulta do aluno é inválida', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    expect(response.body).to.have.property('existemErros', true)
    expect(response.body).to.have.property('mensagens').that.is.an('array').and.not.empty
    expect(response.body.mensagens[0]).to.eq("The value 'data' is not valid.")    
  })
})

// Não retorna as anotações do aluno na data selecionada sem autenticação
When('tento uma requisição GET para o endpoint de anotações na data', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/anotacoes/alunos/${Cypress.env('ALUNO_ID')}/data?dataInicio=${Cypress.env('DATA_INICIO')}&dataFim=${Cypress.env('DATA_FIM')}`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('não retorna os dados de aluno no período exibindo o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

