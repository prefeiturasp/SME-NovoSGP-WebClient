import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps'

let token_cp

Before(() => {
  return cy.gerar_token_cp().then((token_valido) => {
    token_cp = token_valido
  })
})

Given('que possuo um token de acesso válido de CP', function () {
  expect(token_cp, 'valido').to.exist
})

Given('que não possuo um token de acesso válido de CP', () => {
})

// Alterar anotações através do id aluno
When('envio uma requisição PUT para o endpoint de alterar anotações', function () { 
  cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/anotacoes/alunos/${Cypress.env('ANOTACAO_FREQUENCIA_ALUNO_ID')}`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token_cp}`
    },
    body: {        
      motivoAusenciaId: `${Cypress.env('MOTIVO_AUSENCIA_ID')}`,
      anotacao: `${Cypress.env('ANOTACAO_ALUNO')}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 que foi alterado para o aluno', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
  })
})

// Aluno é obrigatório para alterar anotações 
When('envio uma requisição PUT para o endpoint de alterar anotações sem id aluno', function () { 
  cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/anotacoes/alunos/`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token_cp}`
    },
    body: {        
      motivoAusenciaId: `${Cypress.env('MOTIVO_AUSENCIA_ID')}`,
      anotacao: `${Cypress.env('ANOTACAO_ALUNO')}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 405 que o metódo não foi aceito', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(405)
  })
})

// Motivo é obrigatório para alterar anotações
When('envio uma requisição PUT para o endpoint de alterar anotações sem motivo', function () { 
  cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/anotacoes/alunos/${Cypress.env('ANOTACAO_FREQUENCIA_ALUNO_ID')}`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token_cp}`
    },
    body: {        
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 500 que não foi processado', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)
  })
})

// Anotação é obrigatório para alteração 
When('envio uma requisição PUT para o endpoint de alterar sem anotação', function () { 
  cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/anotacoes/alunos/${Cypress.env('ANOTACAO_FREQUENCIA_ALUNO_ID')}`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token_cp}`
    },
    body: {        
      motivoAusenciaId: `${Cypress.env('MOTIVO_AUSENCIA_ID')}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 500 sem alterar devido anotação', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)
  })
})

// Não altera anotações através do id aluno sem autenticação
When('tento uma requisição PUT para o endpoint de alterar anotações', function () { 
  cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/anotacoes/alunos/${Cypress.env('ANOTACAO_FREQUENCIA_ALUNO_ID')}`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer token_invalido`
    },
    body: {        
      motivoAusenciaId: `${Cypress.env('MOTIVO_AUSENCIA_ID')}`,
      anotacao: `${Cypress.env('ANOTACAO_ALUNO')}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem alteração para o aluno', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Cadastra anotações através do aluno
When('envio uma requisição POST para o endpoint de cadastro de anotações', function () { 
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/anotacoes/alunos`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token_cp}`
    },
    body: {        
      motivoAusenciaId: `${Cypress.env('MOTIVO_AUSENCIA_ID')}`,
      aulaId: `${Cypress.env('AULA_ANOTACAO_CODIGO')}`,
      componenteCurricularId: `${Cypress.env('COMPONENTE_CURRICULAR_ANOTACAO_CODIGO')}`,
      anotacao:"",
      codigoAluno: `${Cypress.env('ANOTACAO_ALUNO_ID')}`,
      ehInfantil:false
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 que foi salvo com sucesso', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
  })
})

// Id do motivo de ausência é obrigatório
When('envio uma requisição POST para o endpoint de cadastro sem id do motivo', function () { 
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/anotacoes/alunos`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token_cp}`
    },
    body: {        
      motivoAusenciaId:"",
      aulaId: `${Cypress.env('AULA_ANOTACAO_CODIGO')}`,
      componenteCurricularId: `${Cypress.env('COMPONENTE_CURRICULAR_ANOTACAO_CODIGO')}`,
      anotacao:"",
      codigoAluno: `${Cypress.env('ANOTACAO_ALUNO_ID')}`,
      ehInfantil:false
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 que o id da ausência é obrigatório', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    expect(response.body).to.have.property('existemErros', true)
    expect(response.body).to.have.property('mensagens').that.is.an('array').and.not.empty
    expect(response.body.mensagens[0]).to.eq("A anotação ou o motivo da ausência devem ser informados.")
  })
})

// Id da aula é obrigatório
When('envio uma requisição POST para o endpoint de cadastro sem o id aula', function () { 
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/anotacoes/alunos`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token_cp}`
    },
    body: {        
      motivoAusenciaId: `${Cypress.env('MOTIVO_AUSENCIA_ID')}`,   
      componenteCurricularId: `${Cypress.env('COMPONENTE_CURRICULAR_ANOTACAO_CODIGO')}`,
      anotacao:"",
      codigoAluno: `${Cypress.env('ANOTACAO_ALUNO_ID')}`,
      ehInfantil:false
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 que deve informar a aula', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    expect(response.body).to.have.property('existemErros', true)
    expect(response.body).to.have.property('mensagens').that.is.an('array').and.not.empty
    expect(response.body.mensagens[0]).to.eq("O id da aula deve ser informado.")
  })
})

// Id do componente curricular é obrigatório
When('envio uma requisição POST para o endpoint de cadastro sem id do componente', function () { 
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/anotacoes/alunos`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token_cp}`
    },
    body: {        
      motivoAusenciaId: `${Cypress.env('MOTIVO_AUSENCIA_ID')}`,   
      componenteCurricularId:"",
      anotacao:"",
      codigoAluno: `${Cypress.env('ANOTACAO_ALUNO_ID')}`,
      ehInfantil:false
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 que deve informar o componente', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    expect(response.body).to.have.property('existemErros', true)
  })
})

// Código do aluno é obrigatório
When('envio uma requisição POST para o endpoint de cadastro sem código aluno', function () { 
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/anotacoes/alunos`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token_cp}`
    },
    body: {        
      motivoAusenciaId: `${Cypress.env('MOTIVO_AUSENCIA_ID')}`,   
      componenteCurricularId: `${Cypress.env('COMPONENTE_CURRICULAR_ANOTACAO_CODIGO')}`,
      anotacao:"",
      codigoAluno:"",
      ehInfantil:false
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 que o valor do código deve ser informado', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    expect(response.body).to.have.property('existemErros', true)
  })
})

// Se turma é infantil deve estar preenchido 
When('envio uma requisição POST para o endpoint de cadastro o infantil', function () { 
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/anotacoes/alunos`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token_cp}`
    },
    body: {        
      motivoAusenciaId: `${Cypress.env('MOTIVO_AUSENCIA_ID')}`,   
      componenteCurricularId: `${Cypress.env('COMPONENTE_CURRICULAR_ANOTACAO_CODIGO')}`,
      anotacao:"",
      codigoAluno: `${Cypress.env('ANOTACAO_ALUNO_ID')}`,
      ehInfantil:false
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 que o valor é esperado', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    expect(response.body).to.have.property('existemErros', true)
  })
})

// Não cadastra anotações através do id aluno sem autenticação
When('tento uma requisição POST para o endpoint de cadastro de anotações', function () { 
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/anotacoes/alunos`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer token_invalido`
    },
    body: {        
      motivoAusenciaId: `${Cypress.env('MOTIVO_AUSENCIA_ID')}`,
      aulaId: `${Cypress.env('AULA_ANOTACAO_CODIGO')}`,
      componenteCurricularId: `${Cypress.env('COMPONENTE_CURRICULAR_ANOTACAO_CODIGO')}`,
      anotacao:"",
      codigoAluno: `${Cypress.env('ANOTACAO_ALUNO_ID')}`,
      ehInfantil:false
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem cadastrar anotação para o aluno', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})