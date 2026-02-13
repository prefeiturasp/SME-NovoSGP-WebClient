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

// Retornar aulas prevista por bimestre
When('envio uma requisição GET para buscar aula no bimestre', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/aula-prevista/modalidades/${Cypress.env('MODALIDADE_CODIGO')}/turmas/${Cypress.env('TURMA_CODIGO')}/disciplinas/${Cypress.env('DISCIPLINA_CODIGO')}/semestres/${Cypress.env('SEMESTRE_CODIGO')}`,
    headers: {
      accept: 'text/plain',
      'Authorization': `Bearer ${token}`
    },
    failOnStatusCode: false,
    timeout: 60000
  }).as('response')
})

Then('retorna o status 200 com as aulas previstas', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.have.property('aulasPrevistasPorBimestre').that.is.an('array').and.not.empty
    response.body.aulasPrevistasPorBimestre.forEach((bimestre) => {
      expect(bimestre).to.have.property('bimestre')
      expect(bimestre).to.have.property('inicio')
      expect(bimestre).to.have.property('fim')
      expect(bimestre).to.have.property('cumpridas')
      expect(bimestre).to.have.property('previstas')
      expect(bimestre.previstas).to.have.property('quantidade')
      expect(bimestre.previstas).to.have.property('mensagens')
      expect(bimestre).to.have.property('criadas')
      expect(bimestre.criadas).to.have.property('quantidadeTitular')
      expect(bimestre.criadas).to.have.property('quantidadeCJ')
      expect(bimestre).to.have.property('reposicoes')
      expect(bimestre).to.have.property('podeEditar')
    })
    expect(response.body).to.have.property('id')
    expect(response.body).to.have.property('alteradoEm')
    expect(response.body).to.have.property('alteradoPor')
    expect(response.body).to.have.property('alteradoRF')
    expect(response.body).to.have.property('criadoEm')
    expect(response.body).to.have.property('criadoPor')
    expect(response.body).to.have.property('criadoRF')
  })
})

// Modalidade deve ser obrigatória
When('envio uma requisição GET sem modalidade', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/aula-prevista/modalidades//turmas/${Cypress.env('TURMA_CODIGO')}/disciplinas/${Cypress.env('DISCIPLINA_CODIGO')}/semestres/${Cypress.env('SEMESTRE_CODIGO')}`,
    headers: {
    accept: 'text/plain',
    'Authorization': `Bearer ${token}`
  },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 500 sem as aulas previstas', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)    
  })
})

// Não retornar aula com modalidade inválida
When('envio uma requisição GET com modalidade inválida', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/aula-prevista/modalidades/${Cypress.env('MODALIDADE_CODIGO_INVALIDO')}/turmas/${Cypress.env('TURMA_CODIGO')}/disciplinas/${Cypress.env('DISCIPLINA_CODIGO')}/semestres/${Cypress.env('SEMESTRE_CODIGO')}`,
    headers: {
    accept: 'text/plain',
    'Authorization': `Bearer ${token}`
  },
  failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 sem as aulas previstas', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    expect(response.body).to.have.property('existemErros', true)
    expect(response.body).to.have.property('mensagens').that.is.an('array').and.not.empty
    expect(response.body.mensagens[0]).to.match(/The value '.*' is invalid\./)    
  })
})

// Turma deve ser obrigatória
When('envio uma requisição GET sem turma', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/aula-prevista/modalidades/${Cypress.env('MODALIDADE_CODIGO')}/turmas//disciplinas/${Cypress.env('DISCIPLINA_CODIGO')}/semestres/${Cypress.env('SEMESTRE_CODIGO')}`,
    headers: {
    accept: 'text/plain',
    'Authorization': `Bearer ${token}`
  },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 500 sem as aulas previstas', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)    
  })
})

// Não retornar aula com turma inválida
When('envio uma requisição GET com turma inválida', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/aula-prevista/modalidades/${Cypress.env('MODALIDADE_CODIGO')}/turmas/${Cypress.env('TURMA_CODIGO_INVALIDO')}/disciplinas/${Cypress.env('DISCIPLINA_CODIGO')}/semestres/${Cypress.env('SEMESTRE_CODIGO')}`,
    headers: {
    accept: 'text/plain',
    'Authorization': `Bearer ${token}`
  },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 601 sem as aulas previstas', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)
    expect(response.body).to.deep.equal({
      mensagens: [
        "Turma não encontrada!"
      ],
      existemErros: true
    })
  })
})

// Disciplina deve ser obrigatória
When('envio uma requisição GET sem disciplina', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/aula-prevista/modalidades/${Cypress.env('MODALIDADE_CODIGO')}/turmas/${Cypress.env('TURMA_CODIGO')}/disciplinas//semestres/${Cypress.env('SEMESTRE_CODIGO')}`,
    headers: {
    accept: 'text/plain',
    'Authorization': `Bearer ${token}`
  },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 500 sem as aulas previstas', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)    
  })
})

// Semestre deve ser obrigatório
When('envio uma requisição GET sem semestre', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/aula-prevista/modalidades/${Cypress.env('MODALIDADE_CODIGO')}/turmas/${Cypress.env('TURMA_CODIGO')}/disciplinas/${Cypress.env('DISCIPLINA_CODIGO')}/semestres/`,
    headers: {
    accept: 'text/plain',
    'Authorization': `Bearer ${token}`
  },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 500 sem as aulas previstas', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)    
  })
})

// Não retornar aula no bimestre quando estiver deslogado
When('tento a requisição GET para buscar aula no bimestre', function () { 
  return cy.request({
   method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/aula-prevista/modalidades/${Cypress.env('MODALIDADE_CODIGO')}/turmas/${Cypress.env('TURMA_CODIGO')}/disciplinas/${Cypress.env('DISCIPLINA_CODIGO')}/semestres/${Cypress.env('SEMESTRE_CODIGO')}`,
      headers: {
        accept: 'text/plain',
        Authorization: 'Bearer token_invalido' },
      failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem as aulas', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
    expect(response.body).to.be.empty
  })
})

// Retornar aulas prevista através do ID
When('envio uma requisição GET para buscar o ID aula', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/aula-prevista/${Cypress.env('AULA_CODIGO')}`,
    headers: {
    accept: 'text/plain',
    'Authorization': `Bearer ${token}`
  },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com a aula prevista', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.have.property('aulasPrevistasPorBimestre').that.is.an('array').and.not.empty
    response.body.aulasPrevistasPorBimestre.forEach((bimestre) => {
      expect(bimestre).to.have.property('bimestre')
      expect(bimestre).to.have.property('inicio')
      expect(bimestre).to.have.property('fim')
      expect(bimestre).to.have.property('cumpridas')
      expect(bimestre).to.have.property('previstas')
      expect(bimestre.previstas).to.have.property('quantidade')
      expect(bimestre.previstas).to.have.property('mensagens')
      expect(bimestre).to.have.property('criadas')
      expect(bimestre.criadas).to.have.property('quantidadeTitular')
      expect(bimestre.criadas).to.have.property('quantidadeCJ')
      expect(bimestre).to.have.property('reposicoes')
      expect(bimestre).to.have.property('podeEditar')
    })
    expect(response.body).to.have.property('id')
    expect(response.body).to.have.property('alteradoEm')
    expect(response.body).to.have.property('alteradoPor')
    expect(response.body).to.have.property('alteradoRF')
    expect(response.body).to.have.property('criadoEm')
    expect(response.body).to.have.property('criadoPor')
    expect(response.body).to.have.property('criadoRF')
  })
})

// Não retornar aula prevista quando estiver deslogado
When('tento a requisição GET para buscar o ID aula', function () { 
  return cy.request({
   method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/aula-prevista/${Cypress.env('AULA_CODIGO')}`,
      headers: {
        accept: 'text/plain',
        Authorization: 'Bearer token_invalido' },
      failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem a aula', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
    expect(response.body).to.be.empty
  })
})

// ID da aulas prevista deve ser obrigatório
When('envio uma requisição GET para buscar sem o ID', function () {   
  return cy.request({
   method: 'GET',
   url: Cypress.config('baseUrl') + `/api/v1/aula-prevista/`,
   headers: {
    accept: 'text/plain',
    'Authorization': `Bearer ${token}`
  },
  failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 405 de método inválido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(405)    
  })
})

// Alterar aulas prevista através do ID
When('envio uma requisição PUT com o ID aula', function () { 
  return cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/aula-prevista/${Cypress.env('AULA_CODIGO')}`,
    headers: {
    accept: 'text/plain',
      'Authorization': `Bearer ${token}`
    },
      body:{
      'disciplinaId': `${Cypress.env('DISCIPLINA_CODIGO')}`,
      'modalidade': `${Cypress.env('MODALIDADE_CODIGO')}`,
      'turmaId': `${Cypress.env('TURMA_CODIGO')}`,
      'id': `${Cypress.env('AULA_CODIGO')}`,
      'bimestresQuantidade': [
    {
      'bimestre': `${Cypress.env('BIMESTRE_CODIGO')}`,
      'quantidade': 999
    }
      ]
  },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com a mensagem de sucesso', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.have.property('mensagens').that.includes("Alteração realizada com sucesso")
  })
})

// Não alterar aulas prevista sem o ID
When('envio uma requisição PUT sem o ID aula', function () { 
  return cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/aula-prevista/`,
    headers: {
    accept: 'text/plain',
    'Authorization': `Bearer ${token}`
      },
    body:{
      'disciplinaId': `${Cypress.env('DISCIPLINA_CODIGO')}`,
      'modalidade': `${Cypress.env('MODALIDADE_CODIGO')}`,
      'turmaId': `${Cypress.env('TURMA_CODIGO')}`,
      'id': `${Cypress.env('AULA_CODIGO')}`,
      'bimestresQuantidade': [
     {
      'bimestre': `${Cypress.env('BIMESTRE_CODIGO')}`,
      'quantidade': 999
  }
    ]
  },
  failOnStatusCode: false
  }).as('response')
})


Then('retorna o status 405 sem realizar a alteração', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(405)     
  })
})

// Corpo da requisição não poderá estar vazio
When('envio uma requisição PUT sem o corpo da requisição', function () { 
  return cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/aula-prevista/${Cypress.env('AULA_CODIGO')}`,
    headers: {
      accept: 'text/plain',
      'Authorization': `Bearer ${token}`
  },       
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 415 com a mensagem de vazio', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(415)
    expect(
      (response.body.title && response.body.title.includes("A non-empty request body is required.")) ||
      (response.body.detail && response.body.detail.includes("A non-empty request body is required.")) ||
      JSON.stringify(response.body).includes("A non-empty request body is required.")
    ).to.be.false
  })
})

// Não alterar aula prevista quando estiver deslogado
When('tento a requisição PUT com o ID aula', function () {   
      return cy.request({
        method: 'PUT',
        url: Cypress.config('baseUrl') + `/api/v1/aula-prevista/${Cypress.env('AULA_CODIGO')}`,
        headers: {
        accept: 'text/plain',
        Authorization: 'Bearer token_invalido' 
      },
        body:{
        'disciplinaId': `${Cypress.env('DISCIPLINA_CODIGO')}`,
        'modalidade': `${Cypress.env('MODALIDADE_CODIGO')}`,
        'turmaId': `${Cypress.env('TURMA_CODIGO')}`,
        'id': `${Cypress.env('AULA_CODIGO')}`,
        'bimestresQuantidade': [
      {
        'bimestre': `${Cypress.env('BIMESTRE_CODIGO')}`,
        'quantidade': 999
    }
      ]
    },
      failOnStatusCode: false
    }).as('response')  
})

Then('retorna o status 401 sem realizar a alteração', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Componente curricular deve ser informado
When('envio uma requisição PUT sem o componente curricular', function () { 
  return cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/aula-prevista/${Cypress.env('AULA_CODIGO')}`,
    headers: {
    accept: 'text/plain',
      'Authorization': `Bearer ${token}`
    },
    body:{
    'modalidade': `${Cypress.env('MODALIDADE_CODIGO')}`,
    'turmaId': `${Cypress.env('TURMA_CODIGO')}`,
    'id': `${Cypress.env('AULA_CODIGO')}`,
    'bimestresQuantidade': [
  {
    'bimestre': `${Cypress.env('BIMESTRE_CODIGO')}`,
    'quantidade': 999
  }
    ]
  },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 com a mensagem que a disciplina deve ser informada para alterar', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    expect(response.body).to.deep.equal({
      mensagens: [
        "O componente curricular deve ser informado"
      ],
      existemErros: true
    })
  })
})

// Modalidade deve ser informada
When('envio uma requisição PUT sem a modalidade', function () { 
  return cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/aula-prevista/${Cypress.env('AULA_CODIGO')}`,
    headers: {
    accept: 'text/plain',
      'Authorization': `Bearer ${token}`
    },
      body:{
        'disciplinaId': `${Cypress.env('DISCIPLINA_CODIGO')}`,
        'turmaId': `${Cypress.env('TURMA_CODIGO')}`,
        'id': `${Cypress.env('AULA_CODIGO')}`,
        'bimestresQuantidade': [
      {
        'bimestre': `${Cypress.env('BIMESTRE_CODIGO')}`,
        'quantidade': 999
  }
    ]
  },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 com a mensagem que deve ser informada para alterar', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    expect(response.body).to.deep.equal({
      mensagens: [
        "A modalidade deve ser informada"
      ],
      existemErros: true
    })
  })
})

// Turma deve ser informada
When('envio uma requisição PUT sem a turma', function () { 
  return cy.request({
    method: 'PUT',
    url: Cypress.config('baseUrl') + `/api/v1/aula-prevista/${Cypress.env('AULA_CODIGO')}`,
    headers: {
    accept: 'text/plain',
    'Authorization': `Bearer ${token}`
  },
    body:{
      'disciplinaId': `${Cypress.env('DISCIPLINA_CODIGO')}`,
      'modalidade': `${Cypress.env('MODALIDADE_CODIGO')}`,
      'id': `${Cypress.env('AULA_CODIGO')}`,
      'bimestresQuantidade': [
    {
      'bimestre': `${Cypress.env('BIMESTRE_CODIGO')}`,
      'quantidade': 999
    }
  ]
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 com a mensagem que a turma deve ser informada para alterar', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    expect(response.body).to.deep.equal({
      mensagens: [
        "A turma deve ser informada"
      ],
      existemErros: true
    })
  })
})

// Criar aulas prevista
When('envio uma requisição POST', function () { 
  return cy.request({
        method: 'POST',
        url: Cypress.config('baseUrl') + `/api/v1/aula-prevista`,
        headers: {
        accept: 'text/plain',
        'Authorization': `Bearer ${token}`
      },
        body:{
        'disciplinaId': `${Cypress.env('DISCIPLINA_CODIGO')}`,
        'modalidade': `${Cypress.env('MODALIDADE_CODIGO')}`,
        'turmaId': `${Cypress.env('TURMA_CODIGO')}`,
        'id': `${Cypress.env('AULA_CODIGO')}`,
        'bimestresQuantidade': [
      {
        'bimestre': `${Cypress.env('BIMESTRE_CODIGO')}`,
        'quantidade': 999
    }
      ]
    },
      failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com a mensagem de aulas previstas no bimestre', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
expect(response.status).to.eq(200)
    expect(response.body).to.have.property('aulasPrevistasPorBimestre').that.is.an('array').and.not.empty
    response.body.aulasPrevistasPorBimestre.forEach((bimestre) => {
      expect(bimestre).to.have.property('bimestre')
      expect(bimestre).to.have.property('inicio')
      expect(bimestre).to.have.property('fim')
      expect(bimestre).to.have.property('cumpridas')
      expect(bimestre).to.have.property('previstas')
      expect(bimestre.previstas).to.have.property('quantidade')
      expect(bimestre.previstas).to.have.property('mensagens')
      expect(bimestre).to.have.property('criadas')
      expect(bimestre.criadas).to.have.property('quantidadeTitular')
      expect(bimestre.criadas).to.have.property('quantidadeCJ')
      expect(bimestre).to.have.property('reposicoes')
      expect(bimestre).to.have.property('podeEditar')
    })
    expect(response.body).to.have.property('id')
    expect(response.body).to.have.property('alteradoEm')
    expect(response.body).to.have.property('alteradoPor')
    expect(response.body).to.have.property('alteradoRF')
    expect(response.body).to.have.property('criadoEm')
    expect(response.body).to.have.property('criadoPor')
    expect(response.body).to.have.property('criadoRF')
  })
})

// Não criar aulas sem componente curricular informado
When('envio uma requisição POST sem o componente curricular', function () { 
  return cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/aula-prevista`,
    headers: {
    accept: 'text/plain',
    'Authorization': `Bearer ${token}`
  },
    body:{
      'modalidade': `${Cypress.env('MODALIDADE_CODIGO')}`,
      'turmaId': `${Cypress.env('TURMA_CODIGO')}`,
      'id': `${Cypress.env('AULA_CODIGO')}`,
      'bimestresQuantidade': [
    {
      'bimestre': `${Cypress.env('BIMESTRE_CODIGO')}`,
      'quantidade': 999
    }
  ]
  },
  failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 com a mensagem que a disciplina deve ser informada para criar', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    if (response.body) {
      expect(response.body).to.have.property('mensagens').that.includes("O componente curricular deve ser informado")
      expect(response.body).to.have.property('existemErros', true)
    }
  })
})

// Não criar aulas sem modalidade informada
When('envio uma requisição POST sem a modalidade', function () { 
  return cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/aula-prevista`,
    headers: {
    accept: 'text/plain',
    'Authorization': `Bearer ${token}`
  },
    body:{
      'disciplinaId': `${Cypress.env('DISCIPLINA_CODIGO')}`,
      'turmaId': `${Cypress.env('TURMA_CODIGO')}`,
      'id': `${Cypress.env('AULA_CODIGO')}`,
      'bimestresQuantidade': [
    {
      'bimestre': `${Cypress.env('BIMESTRE_CODIGO')}`,
      'quantidade': 999
    }
      ]
    },
      failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 com a mensagem que deve ser informada para criar', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    if (response.body) {
      expect(response.body).to.have.property('mensagens').that.includes("A modalidade deve ser informada")
      expect(response.body).to.have.property('existemErros', true)
    }
  })
})

// Não criar aulas sem turma informada
When('envio uma requisição POST sem a turma', function () { 
  return cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/aula-prevista`,
    headers: {
    accept: 'text/plain',
    'Authorization': `Bearer ${token}`
  },
    body:{
      'disciplinaId': `${Cypress.env('DISCIPLINA_CODIGO')}`,
      'modalidade': `${Cypress.env('MODALIDADE_CODIGO')}`,
      'id': `${Cypress.env('AULA_CODIGO')}`,
      'bimestresQuantidade': [
    {
      'bimestre': `${Cypress.env('BIMESTRE_CODIGO')}`,
      'quantidade': 999
    }
      ]
  },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 com a mensagem que a turma deve ser informada para criar', function () {
  cy.get('@response').then((response) => {
     expect(response.status).to.eq(422)
    if (response.body) {
      expect(response.body).to.have.property('mensagens').that.includes("A turma deve ser informada")
      expect(response.body).to.have.property('existemErros', true)
    }
  })
})

// Corpo da requisição  para criar aula não poderá estar vazio
When('envio uma requisição POST sem o corpo da requisição', function () { 
  return cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/aula-prevista`,
    headers: {
    accept: 'text/plain',
    'Authorization': `Bearer ${token}`
   },       
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 415 com a mensagem de vazio ao criar', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(415)
    expect(
      (response.body.title && response.body.title.includes("A non-empty request body is required.")) ||
      (response.body.detail && response.body.detail.includes("A non-empty request body is required.")) ||
      JSON.stringify(response.body).includes("A non-empty request body is required.")
    ).to.be.false
  })
})

// Não criar aula prevista quando estiver deslogado
When('tento a requisição POST', function () {   
      return cy.request({
        method: 'POST',
        url: Cypress.config('baseUrl') + `/api/v1/aula-prevista`,
        headers: {
        accept: 'text/plain',
        Authorization: 'Bearer token_invalido' 
      },
        body:{
        'disciplinaId': `${Cypress.env('DISCIPLINA_CODIGO')}`,
        'modalidade': `${Cypress.env('MODALIDADE_CODIGO')}`,
        'turmaId': `${Cypress.env('TURMA_CODIGO')}`,
        'id': `${Cypress.env('AULA_CODIGO')}`,
        'bimestresQuantidade': [
      {
        'bimestre': `${Cypress.env('BIMESTRE_CODIGO')}`,
        'quantidade': 999
    }
      ]
    },
      failOnStatusCode: false
  }).as('response')  
})

Then('retorna o status 401 sem realizar a alteração ao criar', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})
