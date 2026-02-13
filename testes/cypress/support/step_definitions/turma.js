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

// Buscar alunos da turma no ano letivo
When('envio uma requisição GET para o endpoint de código da turma com ano letivo', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/turmas/${Cypress.env('TURMA_CODIGO')}/alunos/anos/${Cypress.env('ANO_LETIVO')}`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna os dados de todos alunos com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)            
    expect(response.body).to.be.an('array').and.not.empty
    expect(response.body[0]).to.have.property('nome')
    expect(response.body[0]).to.have.property('numeroChamada')
    expect(response.body[0]).to.have.property('dataNascimento')
    expect(response.body[0]).to.have.property('codigoEOL')
    expect(response.body[0]).to.have.property('situacaoCodigo')
    expect(response.body[0]).to.have.property('situacao')
    expect(response.body[0]).to.have.property('dataSituacao')
    expect(response.body[0]).to.have.property('frequencia')
    expect(response.body[0]).to.have.property('marcador')
    expect(response.body[0]).to.have.property('nomeResponsavel')
    expect(response.body[0]).to.have.property('ehAtendidoAEE')
    expect(response.body[0]).to.have.property('ehMatriculadoTurmaPAP')
    expect(response.body[0]).to.have.property('tipoResponsavel')
    expect(response.body[0]).to.have.property('celularResponsavel')
    expect(response.body[0]).to.have.property('dataAtualizacaoContato')
    expect(response.body[0]).to.have.property('marcadorDiasSemRegistroExibir')
    expect(response.body[0]).to.have.property('marcadorDiasSemRegistroTexto')
    expect(response.body[0]).to.have.property('dataMatricula')
    expect(response.body[0]).to.have.property('processoConcluido')
    expect(response.body[0]).to.have.property('desabilitado') 
  })
})

// Não buscar alunos com turma inválida
When('envio uma requisição GET para o endpoint de código da turma inválida', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/turmas/${Cypress.env('TURMA_CODIGO_INVALIDO')}/alunos/anos/${Cypress.env('ANO_LETIVO')}`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna a mensagem de erro com status 601 sem os dados de alunos', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)            
    expect(response.body).to.deep.equal({
      mensagens: [
        "Não foram localizados dados dos alunos para turma 275184 no EOL para o ano letivo 2025"
      ],
      existemErros: true
    })      
  })
})

// Código da turma deve ser obrigatório
When('envio uma requisição GET para o endpoint sem código da turma', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/turmas//alunos/anos/${Cypress.env('ANO_LETIVO')}`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('não retorna os dados de alunos com status 500', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)        
  })
})

// Ano letivo deve ser obrigatório
When('envio uma requisição GET para o endpoint sem ano letivo', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/turmas/${Cypress.env('TURMA_CODIGO_INVALIDO')}/alunos/anos/`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('não retorna os dados de alunos com status 500', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)        
  })
})

// Não busca os dados da turma sem autenticação
When('tento a requisição GET para o endpoint de código da turma com ano letivo', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/turmas/${Cypress.env('TURMA_CODIGO')}/alunos/anos/${Cypress.env('ANO_LETIVO')}`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem dados dos alunos', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Buscar tipo de calendário
When('envio uma requisição GET para o endpoint de tipo de calendário', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/turmas/${Cypress.env('TURMA_CODIGO')}/tipo-calendario`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com nome junto ao id', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)            
    expect(response.body).to.have.property('nome')
    expect(response.body).to.have.property('id')
  })
})

// Código da turma deve ser obrigatório no tipo de calendário
When('envio uma requisição GET para o endpoint sem turma no tipo de calendário', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/turmas//tipo-calendario`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 404 sem dados do calendário', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)        
  })
})

// Não buscar tipo de calendário com turma inválida
When('envio uma requisição GET para o endpoint com turma inválida no tipo de calendário', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/turmas/${Cypress.env('TURMA_CODIGO_INVALIDO')}/tipo-calendario`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna a mensagem de erro com status 601 sem os tipos', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601) 
    expect(response.body).to.deep.equal({
      mensagens: [
        "Não foi encontrado a turma 275184."
      ],
      existemErros: true
    })              
  })
})

// Não busca o tipo de calendário sem autenticação
When('tento a requisição GET para o endpoint o tipo de calendário', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/turmas/${Cypress.env('TURMA_CODIGO_INVALIDO')}/tipo-calendario`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem dados de calendário', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Buscar modalidades da turma
When('envio uma requisição GET para o endpoint de modalidades', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/turmas/modalidades?turmasCodigo=${Cypress.env('TURMA_CODIGO')}`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com código junto a descrição', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.be.an('array').and.not.empty
    expect(response.body[0]).to.have.property('turmaCodigo')
    expect(response.body[0]).to.have.property('modalidadeCodigo')
    expect(response.body[0]).to.have.property('modalidadeDescricao')       
  })
})

// Não busca modalidades da turma sem autenticação
When('tento a requisição GET para o endpoint de modalidades', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/turmas/modalidades?turmasCodigo=${Cypress.env('TURMA_CODIGO')}`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem dados de modalidades', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Buscar turmas de sondagem da UE 
When('envio uma requisição GET para o endpoint de sondagem da UE', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/turmas/ues/${Cypress.env('UE_CODIGO')}/sondagem?anoLetivo=${Cypress.env('ANO_LETIVO')}`,
    headers: {
      accept: 'accept: text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com código da turma junto ao nome', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200) 
    expect(response.body).to.be.an('array').and.not.empty
    expect(response.body[0]).to.have.property('codigo')
    expect(response.body[0]).to.have.property('nome')       
  })
})

// Ano deve ser obrigatório na sondagem da UE 
When('tento uma requisição GET para o endpoint de sondagem sem ano', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/turmas/ues/${Cypress.env('UE_CODIGO')}/sondagem?anoLetivo=`,
    headers: {
      accept: 'accept: text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 com mensagem de ano inválido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422) 
    expect(response.body).to.deep.equal({
      mensagens: [
        "The value '' is invalid."
      ],
      existemErros: true
    })          
  })
})

// UE deve ser obrigatório na sondagem da UE 
When('tento uma requisição GET para o endpoint de sondagem sem UE', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/turmas/ues//sondagem?anoLetivo=${Cypress.env('ANO_LETIVO')}`,
    headers: {
      accept: 'accept: text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 404 sem dados de UE', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)     
  })
})

// Não busca sondagem da turma sem autenticação
When('tento a requisição GET para o endpoint de sondagem', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/turmas/ues/${Cypress.env('UE_CODIGO')}/sondagem?anoLetivo=${Cypress.env('ANO_LETIVO')}`,
    headers: {
      accept: 'accept: text/plain',
      Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem dados de sondagem', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)         
  })
})

// Retornar listagem de turmas
When('envio uma requisição GET para o endpoint de listagem de turmas', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/turmas/listagem-turmas?AnoLetivo=${Cypress.env('ANO_LETIVO')}&DreCodigo=${Cypress.env('DRE_CODIGO')}&UeCodigo=${Cypress.env('UE_CODIGO')}&Modalidade=${Cypress.env('MODALIDADE_CODIGO')}&TurmaCodigo=${Cypress.env('TURMA_CODIGO')}&Bimestre=${Cypress.env('BIMESTRE_CODIGO')}&Semestre=${Cypress.env('SEMESTRE_CODIGO')}&ConsideraHistorico=true`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com itens, total de páginas e total de registros', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200) 
    expect(response.body).to.have.property('items')
    expect(response.body).to.have.property('totalPaginas')
    expect(response.body).to.have.property('totalRegistros')
  })
})

// Não retornar listagem de turmas sem ano letivo
When('tento uma requisição GET para o endpoint da listagem sem ano', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/turmas/listagem-turmas?AnoLetivo=&DreCodigo=${Cypress.env('DRE_CODIGO')}&UeCodigo=${Cypress.env('UE_CODIGO')}&Modalidade=${Cypress.env('MODALIDADE_CODIGO')}&TurmaCodigo=${Cypress.env('TURMA_CODIGO')}&Bimestre=${Cypress.env('BIMESTRE_CODIGO')}&Semestre=${Cypress.env('SEMESTRE_CODIGO')}&ConsideraHistorico=true`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 que o ano está inválido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422) 
    expect(response.body).to.deep.equal({
      mensagens: [
        "The value '' is invalid."
      ],
      existemErros: true
    })  
  })
})

// Não retornar listagem de turmas sem modalidade
When('tento uma requisição GET para o endpoint da listagem sem modalidade', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/turmas/listagem-turmas?AnoLetivo=${Cypress.env('ANO_LETIVO')}&DreCodigo=${Cypress.env('DRE_CODIGO')}&UeCodigo=${Cypress.env('UE_CODIGO')}&Modalidade=&TurmaCodigo=${Cypress.env('TURMA_CODIGO')}&Bimestre=${Cypress.env('BIMESTRE_CODIGO')}&Semestre=${Cypress.env('SEMESTRE_CODIGO')}&ConsideraHistorico=true`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 500 que a modalidade está inválida', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500) 
  })
})

// Não retornar listagem de turmas sem bimestre
When('tento uma requisição GET para o endpoint da listagem sem o bimestre', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/turmas/listagem-turmas?AnoLetivo=${Cypress.env('ANO_LETIVO')}&DreCodigo=${Cypress.env('DRE_CODIGO')}&UeCodigo=${Cypress.env('UE_CODIGO')}&Modalidade=${Cypress.env('MODALIDADE_CODIGO')}&TurmaCodigo=${Cypress.env('TURMA_CODIGO')}&Bimestre=&Semestre=${Cypress.env('SEMESTRE_CODIGO')}&ConsideraHistorico=true`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 que o bimestre está inválido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422) 
    expect(response.body).to.deep.equal({
      mensagens: [
        "The value '' is invalid."
      ],
      existemErros: true
    })  
  })
})

// Retornar listagem de turmas sem histórico
When('envio uma requisição GET para o endpoint de listagem sem histórico', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/turmas/listagem-turmas?AnoLetivo=${Cypress.env('ANO_LETIVO')}&DreCodigo=${Cypress.env('DRE_CODIGO')}&UeCodigo=${Cypress.env('UE_CODIGO')}&Modalidade=${Cypress.env('MODALIDADE_CODIGO')}&TurmaCodigo=${Cypress.env('TURMA_CODIGO')}&Bimestre=${Cypress.env('BIMESTRE_CODIGO')}&Semestre=${Cypress.env('SEMESTRE_CODIGO')}&ConsideraHistorico=false`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200) 
  })
})

// Não listar turmas sem autenticação
When('tento uma requisição GET para o endpoint de listagem', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/turmas/listagem-turmas?AnoLetivo=${Cypress.env('ANO_LETIVO')}&DreCodigo=${Cypress.env('DRE_CODIGO')}&UeCodigo=${Cypress.env('UE_CODIGO')}&Modalidade=${Cypress.env('MODALIDADE_CODIGO')}&TurmaCodigo=${Cypress.env('TURMA_CODIGO')}&Bimestre=${Cypress.env('BIMESTRE_CODIGO')}&Semestre=${Cypress.env('SEMESTRE_CODIGO')}&ConsideraHistorico=false`,
    headers: {
      accept: '*/*',
      Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401) 
  })
})