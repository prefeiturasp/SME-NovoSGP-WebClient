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

// Retornar versão atual do sistema
When('envio uma requisição GET para o endpoint relatórios filtros DRE', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/dres`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com dados da DRE', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body[0]).to.have.property('abreviacao')
    expect(response.body[0]).to.have.property('codigo')
    expect(response.body[0]).to.have.property('nome')
  })
})

// Não acessar a versão sem autenticação sem autenticação
When('tento a requisição GET para o endpoint relatórios filtros DRE', function () { 
  cy.request({
   method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/dres`,
      headers: {
        accept: 'text/plain',
        Authorization: 'Bearer token_invalido'
      },
      failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem dados da DRE', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Filtra o código da DRE no relatório
When('envio uma requisição GET para o endpoint relatórios filtros o código DRE', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/dres/${Cypress.env('DRE_CODIGO')}/ues?anoLetivo=${Cypress.env('ANO_LETIVO')}`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com dados de DRE no ano', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.be.an('array')
    response.body.forEach((item) => {
      expect(item).to.have.property('codigo')
      expect(item).to.have.property('nomeSimples')
      expect(item).to.have.property('tipoEscola')
      expect(item).to.have.property('id') 
      expect(item).to.have.property('nome')
      expect(item).to.have.property('ehInfantil') 
    })
  })
})

// Ano letivo é obrigatório ao filtrar o código da DRE no relatório
When('envio uma requisição GET para o endpoint relatórios filtros código DRE', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/dres/${Cypress.env('DRE_CODIGO')}/ues?anoLetivo=`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})

Then('não insiro o ano letivo', function () {  
})

Then('retorna o status 422 sem dados de DRE pois o ano é inválido', function () {
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

// DRE é obrigatória ao filtrar por código no relatório
When('envio uma requisição GET para o endpoint relatórios filtros código de DRE', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/dres//ues?anoLetivo=${Cypress.env('ANO_LETIVO')}`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})

Then('não insiro a DRE', function () {  
})

Then('retorna o status 500 sem dados de DRE pois o código é vazio', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)    
  })
})

// Não filtra o código da DRE no relatório sem autenticação
When('tento a requisição GET para o endpoint relatórios filtros o código DRE', function () { 
  cy.request({
   method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/dres/${Cypress.env('DRE_CODIGO')}/ues?anoLetivo=${Cypress.env('ANO_LETIVO')}`,
      headers: {
        accept: 'text/plain',
        Authorization: 'Bearer token_invalido'
      },
      failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem dados da DRE no ano', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Filtra as UEs no relatório
When('envio uma requisição GET para o endpoint relatórios filtros com UE', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/ues/${Cypress.env('UE_CODIGO')}/modalidades?anoLetivo=${Cypress.env('ANO_LETIVO')}`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com dados de UE no ano', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.be.an('array')
    response.body.forEach((item) => {
      expect(item).to.have.property('valor')
      expect(item).to.have.property('descricao')
    })
  })
})

// Ano letivo é obrigatório ao filtrar a UE no relatório
When('envio uma requisição GET para o endpoint relatórios filtros UE', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/ues/${Cypress.env('UE_CODIGO')}/modalidades?anoLetivo=`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})

Then('não insiro ano letivo', function () {  
})

Then('retorna o status 422 sem dados de UE pois o ano é inválido', function () {
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

// UE é obrigatória ao filtrar por código no relatório
When('envio uma requisição GET para o endpoint relatórios dos filtros UE', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/ues//modalidades?anoLetivo=${Cypress.env('ANO_LETIVO')}`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})

Then('não insiro a UE', function () {  
})

Then('retorna o status 500 sem dados de UE pois o código é vazio', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)    
  })
})

// Não filtra o código da UE no relatório sem autenticação
When('tento uma requisição GET para o endpoint relatórios filtros com UE', function () { 
  cy.request({
   method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/ues/${Cypress.env('UE_CODIGO')}/modalidades?anoLetivo=${Cypress.env('ANO_LETIVO')}`,
      headers: {
        accept: 'text/plain',
        Authorization: 'Bearer token_invalido'
      },
      failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem dados da UE no ano', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Filtra modalidade das UEs no relatório
When('envio uma requisição GET para o endpoint relatórios modalidade filtros com UE', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/ues/${Cypress.env('UE_CODIGO')}/${Cypress.env('ANO_LETIVO')}/${Cypress.env('SEM_HISTORICO')}/modalidades`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com dados de UE das modalidades no ano', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.be.an('array')
    response.body.forEach((item) => {
      expect(item).to.have.property('valor')
      expect(item).to.have.property('descricao')
    })
  })
})

// Ano letivo é obrigatório ao filtrar a UE no relatório de modalidade
When('envio uma requisição GET para o endpoint relatórios filtros UE modalidades', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/ues/${Cypress.env('UE_CODIGO')}//${Cypress.env('SEM_HISTORICO')}/modalidades`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})

Then('não insire ano letivo', function () {  
})

Then('retorna o status 500 sem dados de UE no ano inválido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)    
  })
})

// UE é obrigatória ao filtrar por código no relatório de modalidade
When('envio uma requisição GET para o endpoint relatórios dos filtros UE modalidades', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/ues//${Cypress.env('ANO_LETIVO')}/${Cypress.env('SEM_HISTORICO')}/modalidades`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})

Then('não insire a UE', function () {  
})

Then('retorna o status 500 sem dados de UE do código é vazio', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)    
  })
})

// Histórico é obrigatório ao filtrar por código no relatório de modalidade
When('envio uma requisição GET para o endpoint relatórios dos filtros modalidades', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/ues/${Cypress.env('UE_CODIGO')}/${Cypress.env('ANO_LETIVO')}//modalidades`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})

Then('não insiro histórico', function () {  
})

Then('retorna o status 500 sem dados de UE do histórico vazio', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)    
  })
})

// Não filtra o código da UE no relatório modalidade sem autenticação
When('tento requisição GET para o endpoint relatórios modalidade filtros com UE', function () { 
  cy.request({
   method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/ues/${Cypress.env('UE_CODIGO')}/${Cypress.env('ANO_LETIVO')}/${Cypress.env('SEM_HISTORICO')}/modalidades`,
      headers: {
        accept: 'text/plain',
        Authorization: 'Bearer token_invalido'
      },
      failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem dados da UE do ano', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Filtra modalidade e abrangencias das UEs no relatório
When('envio uma requisição GET para o endpoint relatórios modalidade e abrangencias de filtros da UE', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/ues/${Cypress.env('UE_CODIGO')}/modalidades/abrangencias`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com dados de abrangencias da UE', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.be.an('array')
    response.body.forEach((item) => {
      expect(item).to.have.property('valor')
      expect(item).to.have.property('descricao')
    })
  })
})

// UE é obrigatória ao filtrar relatório de modalidade com abrangencia
When('envio requisição GET para endpoint relatórios dos filtros de abrangencias da modalidade', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/ues//modalidades/abrangencias`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})

Then('não insiro ano letivo no filtro', function () {  
})

Then('retorna o status 500 sem dados de abrangencias da UE', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)    
  })
})

// Não filtra modalidade e abrangencias das UEs no relatório
When('tento requisição GET para endpoint relatórios modalidade e abrangencias de filtros da UE', function () { 
  cy.request({
   method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/ues/${Cypress.env('UE_CODIGO')}/modalidades/abrangencias`,
      headers: {
        accept: 'text/plain',
        Authorization: 'Bearer token_invalido'
      },
      failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem dados de abrangencias da UE', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Filtra modalidade dos anos escolares no relatório
When('envio uma requisição GET para o endpoint relatórios modalidade no ano escolar', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/ues/${Cypress.env('UE_CODIGO')}/modalidades/${Cypress.env('MODALIDADE_CODIGO')}/anos-escolares`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com valor e descrição da modalidade', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.be.an('array')
    response.body.forEach((item) => {
      expect(item).to.have.property('valor')
      expect(item).to.have.property('descricao')
    })
  })
})

// UE é obrigatória ao filtrar modalidade dos anos escolares
When('envio uma requisição GET para o endpoint relatórios modalidade do ano escolar', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/ues//modalidades/${Cypress.env('MODALIDADE_CODIGO')}/anos-escolares`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})

Then('não insiro a UE ao filtrar', function () {  
})

Then('retorna o status 500 sem dados de modalidade da UE', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)    
  })
})

// Modalidade é obrigatória ao filtrar anos escolares
When('envio uma requisição GET para o endpoint relatórios modalidade ano escolar', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/ues/${Cypress.env('UE_CODIGO')}/modalidades//anos-escolares`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})

Then('não seleciono o código ao filtrar', function () {  
})

Then('retorna o status 500 sem dados de modalidade no ano', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)    
  })
})

// Não filtra modalidade dos anos escolares no relatório sem autenticação
When('tento a requisição GET para o endpoint relatórios modalidade no ano escolar', function () { 
  cy.request({
   method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/ues/${Cypress.env('UE_CODIGO')}/modalidades/${Cypress.env('MODALIDADE_CODIGO')}/anos-escolares`,
      headers: {
        accept: 'text/plain',
        Authorization: 'Bearer token_invalido'
      },
      failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem valor e descrição da modalidade', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Filtra turmas do ano letivo no relatório
When('envio uma requisição GET para o endpoint relatórios filtrar turmas', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/ues/${Cypress.env('UE_CODIGO')}/anoletivo/${Cypress.env('ANO_LETIVO')}/turmas`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com turmas no ano letivo', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.be.an('array')
    response.body.forEach((item) => {
      expect(item).to.have.property('valor')
      expect(item).to.have.property('descricao')
    })
  })
})

// UE é obrigatória ao filtrar turmas do ano letivo no relatório
When('envio uma requisição GET para o endpoint relatórios turmas do ano letivo', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/ues//anoletivo/${Cypress.env('ANO_LETIVO')}/turmas`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})

Then('não insiro UE ao enviar', function () {  
})

Then('retorna o status 500 sem dados de UE das turmas', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)    
  })
})

// Ano letivo é obrigatória ao filtrar turmas no relatório
When('envio requisição GET para o endpoint relatórios turmas do ano letivo', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/ues/${Cypress.env('UE_CODIGO')}/anoletivo//turmas`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})

Then('não seleciono o ano ao filtrar', function () {  
})

Then('retorna o status 500 sem dados de turmas no ano', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)    
  })
})

// Não filtra turmas do ano letivo no relatório sem autenticação
When('tento requisição GET para o endpoint relatórios filtrar turmas', function () { 
  cy.request({
   method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/ues/${Cypress.env('UE_CODIGO')}/anoletivo/${Cypress.env('ANO_LETIVO')}/turmas`,
      headers: {
        accept: 'text/plain',
        Authorization: 'Bearer token_invalido'
      },
      failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem turmas no ano letivo', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Filtra turmas do ano atual no relatório
When('envio uma requisição GET para o endpoint filtrar turmas no ano', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/turmas/ues/${Cypress.env('UE_CODIGO')}/anoletivo/${Cypress.env('ANO_LETIVO')}`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com turmas do ano atual', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.be.an('array')
    response.body.forEach((item) => {
      expect(item).to.have.property('valor')
      expect(item).to.have.property('descricao')
    })
  })
})

// UE é obrigatória ao filtrar turmas do ano atual no relatório
When('envio uma requisição GET para o endpoint relatórios turmas do ano', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/turmas/ues//anoletivo/${Cypress.env('ANO_LETIVO')}`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})

Then('sem UE', function () {  
})

Then('retorna o status 500 sem dados de UE das turmas no atual', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)    
  })
})

// Ano atual é obrigatória ao filtrar turmas no relatório
When('envio requisição GET para o endpoint relatórios turmas atual', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/turmas/ues/${Cypress.env('UE_CODIGO')}/anoletivo/`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})

Then('sem selecionar o ano', function () {  
})

Then('retorna o status 500 sem dados devido ao ano', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)    
  })
})

// Não filtra turmas do ano atual no relatório
When('tento requisição GET para o endpoint filtrar turmas no ano', function () { 
  cy.request({
   method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/turmas/ues/${Cypress.env('UE_CODIGO')}/anoletivo/${Cypress.env('ANO_LETIVO')}`,
      headers: {
        accept: 'text/plain',
        Authorization: 'Bearer token_invalido'
      },
      failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem turmas no ano atual', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Filtra ciclos da modalidade na UE
When('envio a requisição GET para o endpoint de filtrar ciclos', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/ues/${Cypress.env('UE_CODIGO')}/modalidades/${Cypress.env('MODALIDADE_CODIGO')}/ciclos`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com as modalidades da UE', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.be.an('array')
    response.body.forEach((item) => {
      expect(item).to.have.property('id')
      expect(item).to.have.property('descricao')
    })
  })
})

// UE é obrigatória ao filtrar ciclos da modalidade
When('envio uma requisição GET para o endpoint de filtrar ciclos da modalidade', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/ues//modalidades/${Cypress.env('MODALIDADE_CODIGO')}/ciclos`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})

Then('sem UE selecionada', function () {  
})

Then('retorna o status 500 sem dados de UE neste ciclo', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)    
  })
})

// Modalidade é obrigatória ao filtrar ciclos da turma
When('envio requisição GET para o endpoint de filtrar ciclos modalidade', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/ues/${Cypress.env('UE_CODIGO')}/modalidades//ciclos`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})

Then('sem selecionar modalidade', function () {  
})

Then('retorna o status 500 sem dados de ciclos da UE', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)    
  })
})

// Não filtra turmas do ano atual no relatório
When('tento requisição GET para o endpoint filtrar turmas no ano', function () { 
  cy.request({
   method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/ues/${Cypress.env('UE_CODIGO')}/modalidades/${Cypress.env('MODALIDADE_CODIGO')}/ciclos`,
      headers: {
        accept: 'text/plain',
        Authorization: 'Bearer token_invalido'
      },
      failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem turmas no ano atual', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Filtra componentes curriculares da modalidade na UE
When('envio a requisição GET para o endpoint de filtrar modalidade', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/componentes-curriculares/anos-letivos/${Cypress.env('ANO_LETIVO')}/ues/${Cypress.env('UE_CODIGO')}/modalidades/${Cypress.env('MODALIDADE_CODIGO')}`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 e componentes curriculares da UE', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.be.an('array')
    response.body.forEach((item) => {
      expect(item).to.have.property('codigo')
      expect(item).to.have.property('descricao')
    })
  })
})

// UE é obrigatória ao filtrar componentes curriculares da modalidade
When('envio uma requisição GET para o endpoint de filtrar componentes curriculares', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/componentes-curriculares/anos-letivos/${Cypress.env('ANO_LETIVO')}/ues//modalidades/${Cypress.env('MODALIDADE_CODIGO')}`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})

Then('sem UE selecionada da modalidade', function () {  
})

Then('retorna o status 500 sem dados de UE neste componentes', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)    
  })
})

// Modalidade é obrigatória ao filtrar componentes curriculares
When('envio requisição GET para endpoint de filtrar componentes curriculares', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/componentes-curriculares/anos-letivos/${Cypress.env('ANO_LETIVO')}/ues/${Cypress.env('UE_CODIGO')}/modalidades/`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})

Then('sem selecionar o código da modalidade', function () {  
})

Then('retorna o status 500 sem dados de componentes da UE', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)    
  })
})

// Ano letivo é obrigatório ao filtrar componentes curriculares da modalidade
When('envio requisição GET para o endpoint filtrar componentes curriculares', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/componentes-curriculares/anos-letivos//ues/${Cypress.env('UE_CODIGO')}/modalidades/${Cypress.env('MODALIDADE_CODIGO')}`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})

Then('sem selecionar o ano letivo', function () {  
})

Then('retorna o status 500 sem dados da modalidade no ano', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)    
  })
})

// Não filtra componentes curriculares da modalidade na UE
When('tento a requisição GET para o endpoint de filtrar modalidade', function () { 
  cy.request({
   method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/componentes-curriculares/anos-letivos/${Cypress.env('ANO_LETIVO')}/ues/${Cypress.env('UE_CODIGO')}/modalidades/${Cypress.env('MODALIDADE_CODIGO')}`,
      headers: {
        accept: 'text/plain',
        Authorization: 'Bearer token_invalido'
      },
      failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem componentes curriculares da modalidade', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Filtra tipos de visualização da ata final
When('envio a requisição GET para o endpoint de filtrar a ata final', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/ata-final/tipos-visualizacao`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com os tipos de visualização', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.be.an('array')
    response.body.forEach((item) => {
      expect(item).to.have.property('valor')
      expect(item).to.have.property('desc')
    })
  })
})

// Não filtra tipos de visualização da ata final sem autenticação
When('tento a requisição GET para o endpoint de filtrar a ata final', function () { 
  cy.request({
   method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/ata-final/tipos-visualizacao`,
      headers: {
        accept: 'text/plain',
        Authorization: 'Bearer token_invalido'
      },
      failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem os tipos de visualização', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Filtra modalidade dos bimestres
When('envio a requisição GET para o endpoint de filtrar a modalidade', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/bimestres/modalidades/${Cypress.env('MODALIDADE_CODIGO')}`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com as modalidades dos bimestres', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.be.an('array')
    response.body.forEach((item) => {
      expect(item).to.have.property('valor')
      expect(item).to.have.property('descricao')
    })
  })
})

// Modalidade é obrigatória ao filtrar componentes curriculares
When('envio requisição GET para o endpoint de filtrar a modalidade', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/bimestres/modalidades/`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})

Then('sem o código da modalidade', function () {  
})

Then('retorna o status 500 sem dados dos bimestres', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)    
  })
})

// Não filtra modalidade dos bimestres sem autenticação
When('tento a requisição GET para o endpoint de filtrar a modalidade', function () { 
  cy.request({
   method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/bimestres/modalidades/${Cypress.env('MODALIDADE_CODIGO')}`,
      headers: {
        accept: 'text/plain',
        Authorization: 'Bearer token_invalido'
      },
      failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem as modalidades dos bimestres', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Filtra as situações de acompanhamento do fechamento
When('envio a requisição GET para o endpoint de filtrar situações do fechamento', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/acompanhamento-fechamento/fechamentos/situacoes`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 do acompanhamento', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
  })
})

// Não filtra as situações de acompanhamento do fechamento
When('tento a requisição GET para o endpoint de filtrar situações do fechamento', function () { 
  cy.request({
   method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/acompanhamento-fechamento/fechamentos/situacoes`,
      headers: {
        accept: 'text/plain',
        Authorization: 'Bearer token_invalido'
      },
      failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem acompanhamento', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Filtra as situações de acompanhamento do conselho de classe
When('envio a requisição GET para endpoint de filtrar situações do fechamento', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/acompanhamento-fechamento/conselho-de-classe/situacoes`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
      },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 do conselho de classe', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
  })
})

// Não filtra as situações de acompanhamento do conselho de classe sem autenticação
When('tento a requisição GET para endpoint de filtrar situações do fechamento', function () { 
  cy.request({
   method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/relatorios/filtros/acompanhamento-fechamento/conselho-de-classe/situacoes`,
      headers: {
        accept: 'text/plain',
        Authorization: 'Bearer token_invalido'
      },
      failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem conselho de classe', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})