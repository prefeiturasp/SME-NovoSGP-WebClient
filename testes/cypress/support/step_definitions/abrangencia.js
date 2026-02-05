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

// Filtra a abrangência sem considerar histórico
When('envio uma requisição GET de filtro da abrangência', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('COM_FILTRO')}/${Cypress.env('SEM_HISTORICO')}?consideraAnosTurmasInfantil=false`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna os dados com status 204 sem considerar histórico', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(204)    
  })
})

// Não filtra a abrangência sem considerar histórico
When('envio uma requisição GET sem filtro da abrangência', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('SEM_FILTRO')}/${Cypress.env('SEM_HISTORICO')}?consideraAnosTurmasInfantil=false`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna os dados com status 204 e sem considerar histórico', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(204)    
  })
})

// Filtra a abrangência considerando histórico
When('envio uma requisição GET com filtro da abrangência', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('COM_FILTRO')}/${Cypress.env('COM_HISTORICO')}?consideraAnosTurmasInfantil=false`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna os dados com status 204 considerando histórico', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(204)    
  })
})

// Não filtra a abrangência considerando histórico
When('envio uma requisição GET não filtrando a abrangência', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('SEM_FILTRO')}/${Cypress.env('COM_HISTORICO')}?consideraAnosTurmasInfantil=false`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna os dados com status 204 mas considerando histórico', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(204)    
  })
})

// Campo de filtro é obrigatório ao filtrar abrangência
When('envio uma requisição GET sem o campo de filtro', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias//${Cypress.env('COM_HISTORICO')}?consideraAnosTurmasInfantil=false`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 500 que o filtro é inválido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500) 
  })
})

// Campo de considerar histórico é obrigatório ao filtrar abrangência
When('envio uma requisição GET sem o campo de histórico', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('COM_FILTRO')}/?consideraAnosTurmasInfantil=false`,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 500 que o considerar o histórico é inválido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)    
  })
})

// Não retorna quantidade do apanhado geral sem autenticação
When('tento a requisição GET de filtro da abrangência', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('SEM_FILTRO')}/${Cypress.env('COM_HISTORICO')}?consideraAnosTurmasInfantil=false`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('não os dados de filtro de abrangência mostrando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Filtra considerando histórico da UE por modalidade no ano letivo
When('envio uma requisição GET de filtro da abrangência da UE por modalidade', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('COM_HISTORICO')}/ues/${Cypress.env('UE_CODIGO')}/modalidades/${Cypress.env('MODALIDADE_CODIGO')}/turmas/anos/${Cypress.env('ANO_LETIVO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna os dados da UE com status 204 considerando histórico', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(204)    
  })
})    

// Filtra sem histórico da UE por modalidade no ano letivo
When('envio uma requisição GET de filtro de abrangência da UE por modalidade', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('SEM_HISTORICO')}/ues/${Cypress.env('UE_CODIGO')}/modalidades/${Cypress.env('MODALIDADE_CODIGO')}/turmas/anos/${Cypress.env('ANO_LETIVO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna os dados da UE com status 200 sem histórico', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(204)    
  })
})

// UE deve ser obrigatório no filtro por modalidade no ano letivo
When('envio uma requisição GET de filtro de abrangência sem UE por modalidade', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('SEM_HISTORICO')}/ues//modalidades/${Cypress.env('MODALIDADE_CODIGO')}/turmas/anos/${Cypress.env('ANO_LETIVO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('não retorna os dados da UE com status 500 sem histórico', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)  
  })
})

// Modalidade deve ser obrigatório no filtro por UE no ano letivo
When('envio uma requisição GET de filtro de abrangência sem modalidade por UE', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('SEM_HISTORICO')}/ues/${Cypress.env('UE_CODIGO')}/modalidades//turmas/anos/${Cypress.env('ANO_LETIVO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('não retorna os dados da UE com status 500 sem modalidade', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)  
  })
})

// Ano letivo deve ser obrigatório no filtro por UE da abrangência
When('envio uma requisição GET de filtro de abrangência sem ano letivo', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('SEM_HISTORICO')}/ues/${Cypress.env('UE_CODIGO')}/modalidades/${Cypress.env('MODALIDADE_CODIGO')}/turmas/anos/`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('não retorna os dados da UE com status 500 filtrada', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)  
  })
})

// Histórico deve ser obrigatório no filtro por UE da abrangência
When('envio uma requisição GET de filtro de abrangência sem o histórico', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias//ues/${Cypress.env('UE_CODIGO')}/modalidades/${Cypress.env('MODALIDADE_CODIGO')}/turmas/anos/${Cypress.env('ANO_LETIVO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('não retorna os dados da UE com status 500', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500) 
  })
})

// Não filtrar abrangência da UE por modalidade no ano letivo sem autenticação
When('tento o envio uma requisição GET de filtro da abrangência da UE por modalidade', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('COM_HISTORICO')}/ues/${Cypress.env('UE_CODIGO')}/modalidades/${Cypress.env('MODALIDADE_CODIGO')}/turmas/anos/${Cypress.env('ANO_LETIVO')}`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('não retorna os dados da UE com status 401 no ano letivo', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Retorna as abrangências dos anos letivos com histórico
When('envio uma requisição GET de abrangências dos anos letivos', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('COM_HISTORICO')}/anos-letivos`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com histórico do ano', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200) 
  })
})

// Retorna as abrangências dos anos letivos sem histórico
When('envio uma requisição GET de abrangências de anos letivos', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('SEM_HISTORICO')}/anos-letivos`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 sem histórico do ano', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200) 
  })
})

// Não retorna as abrangências dos anos letivos sem autenticação
When('tento uma requisição GET de abrangências dos anos letivos', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('COM_HISTORICO')}/anos-letivos`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem histórico do ano', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Retorna as abrangências de todos anos letivos com histórico
When('envio uma requisição GET de abrangências de todos anos letivos', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('COM_HISTORICO')}/anos-letivos-todos`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com histórico dos anos', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200) 
  })
})

// Retorna as abrangências de todos anos letivos sem histórico
When('envio uma requisição GET de abrangências todos anos letivos', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('SEM_HISTORICO')}/anos-letivos-todos`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 sem histórico dos anos', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200) 
  })
})

// Não retorna as abrangências de todos anos letivos sem autenticação
When('tento uma requisição GET de abrangências de todos anos letivos', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('COM_HISTORICO')}/anos-letivos-todos`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem histórico dos anos', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Retorna as abrangências de DREs com histórico
When('envio uma requisição GET de abrangências de DREs', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('COM_HISTORICO')}/dres`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com histórico de DREs', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(204) 
  })
})

// Retorna as abrangências de DREs sem histórico
When('envio uma requisição GET de abrangências das DREs', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('SEM_HISTORICO')}/dres`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 sem histórico de DREs', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(204) 
  })
})

// Não retorna as abrangências de DREs sem autenticação
When('tento uma requisição GET de abrangências de DREs', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('COM_HISTORICO')}/dres`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem histórico de DREs', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Retorna modalidades das abrangências com histórico
When('envio uma requisição GET de abrangências de modalidades', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('COM_HISTORICO')}/modalidades?anoLetivo=${Cypress.env('ANO_LETIVO')}&consideraNovasModalidades=false`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com histórico de modalidades', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(204) 
  })
})

// Retorna modalidades das abrangências de DREs sem histórico
When('envio uma requisição GET de abrangências das modalidades', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('SEM_HISTORICO')}/modalidades?anoLetivo=${Cypress.env('ANO_LETIVO')}&consideraNovasModalidades=false`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 sem histórico de modalidades', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(204) 
  })
})

// Não retorna as modalidades de abrangência sem autenticação
When('tento uma requisição GET de abrangências de modalidades', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('COM_HISTORICO')}/modalidades?anoLetivo=${Cypress.env('ANO_LETIVO')}&consideraNovasModalidades=false`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem histórico modalidades', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Retorna semestres das abrangências com histórico
When('envio uma requisição GET de abrangências de semestres', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('COM_HISTORICO')}/semestres`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com histórico de semestres', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(204) 
  })
})

// Retorna semestres das abrangências de DREs sem histórico
When('envio uma requisição GET de abrangências das semestres', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('SEM_HISTORICO')}/semestres`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 sem histórico de semestres', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(204) 
  })
})

// Não retorna as semestres de abrangência sem autenticação
When('tento uma requisição GET de abrangências de semestres', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('COM_HISTORICO')}/semestres`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem histórico semestres', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Retorna abrangências da turma com histórico
When('envio uma requisição GET de abrangências da turma', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('COM_HISTORICO')}/dres/ues/${Cypress.env('UE_CODIGO')}/turmas?periodo=0&anoLetivo=${Cypress.env('ANO_LETIVO')}&consideraNovosAnosInfantil=false`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com histórico da turma', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(204) 
  })
})

// Retorna abrangências da turma sem histórico
When('envio uma requisição GET de abrangências de turma', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('SEM_HISTORICO')}/dres/ues/${Cypress.env('UE_CODIGO')}/turmas?periodo=0&anoLetivo=${Cypress.env('ANO_LETIVO')}&consideraNovosAnosInfantil=false`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 sem histórico de turma', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(204) 
  })
})

// Não retorna as turmas de abrangência sem autenticação
When('tento uma requisição GET de abrangências da turma', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('COM_HISTORICO')}/dres/ues/${Cypress.env('UE_CODIGO')}/turmas?periodo=0&anoLetivo=${Cypress.env('ANO_LETIVO')}&consideraNovosAnosInfantil=false`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem histórico de turmas', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Retorna abrangências da turma vigente
When('envio uma requisição GET de abrangências das turmas', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/turmas/vigentes`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com as vigentes', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200) 
  })
})

// Não retorna abrangências da turma vigente sem autenticação
When('tento uma requisição GET de abrangências das turmas', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/turmas/vigentes`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem vigentes', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Retorna abrangências de adm com histórico
When('envio uma requisição GET de abrangências do adm', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('COM_HISTORICO')}/adm`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com histórico de adm', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200) 
  })
})

// Retorna abrangências de adm sem histórico
When('envio uma requisição GET de abrangências de adm', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('SEM_HISTORICO')}/adm`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 sem histórico de adm', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200) 
  })
})

// Não retorna as turmas de adm sem autenticação
When('tento uma requisição GET de abrangências de adm', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('COM_HISTORICO')}/adm`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem histórico de adm', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Retorna abrangências do perfil do usuário
When('envio uma requisição GET de abrangências de perfil', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/usuarios/${Cypress.env('LOGIN_PROFESSOR')}/perfis/${Cypress.env('PERFIL_VALIDO')}/carregar`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 da consulta do usuário', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200) 
  })
})

// Não retorna abrangências do perfil do usuário
When('tento uma requisição GET de abrangências de perfil', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/usuarios/${Cypress.env('LOGIN_PROFESSOR')}/perfis/${Cypress.env('PERFIL_VALIDO')}/carregar`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem consulta do usuário', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Sincronizar abrangências do perfil no ano letivo
When('envio uma requisição POST de sincronizar abrangências do professor', function () { 
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/sincronizar-abrangencia/${Cypress.env('LOGIN_PROFESSOR')}/${Cypress.env('ANO_LETIVO')}/turmas-historicas`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 do ano letivo sincronizado', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200) 
  })
})

// Não sincronizar abrangências do perfil no ano letivo
When('tento uma requisição POST de sincronizar abrangências do professor', function () { 
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/sincronizar-abrangencia/${Cypress.env('LOGIN_PROFESSOR')}/${Cypress.env('ANO_LETIVO')}/turmas-historicas`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem ano letivo sincronizado', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Considera histórico de abrangências da DRE
When('envio uma requisição GET abrangências da DRE', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('COM_HISTORICO')}/dres/${Cypress.env('DRE_CODIGO')}/ues`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com histórico da DRE na UE', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(204) 
  })
})

// Não considera histórico de abrangências da DRE
When('envio uma requisição GET abrangências de DRE', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('SEM_HISTORICO')}/dres/${Cypress.env('DRE_CODIGO')}/ues`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 sem histórico da DRE na UE', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(204) 
  })
})

// Não busca histórico de abrangências da DRE sem autenticação
When('tento uma requisição GET abrangências da DRE', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('COM_HISTORICO')}/dres/${Cypress.env('DRE_CODIGO')}/ues`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 histórico da DRE na UE', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Considera histórico de abrangências das turmas regulares
When('envio uma requisição GET abrangências das turmas regulares', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('COM_HISTORICO')}/dres/ues/${Cypress.env('UE_CODIGO')}/turmas-regulares`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 204 com histórico da turma na UE', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(204) 
  })
})

// Não considera histórico de abrangências das turmas regulares
When('envio uma requisição GET abrangências das turmas regulares', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('SEM_HISTORICO')}/dres/ues/${Cypress.env('UE_CODIGO')}/turmas-regulares`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 204 sem histórico da turma na UE', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(204) 
  })
})

// Histórico é obrigatório na abrangências nas turmas regulares
When('envio uma requisição GET abrangências sem histórico da UE', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias//dres/ues/${Cypress.env('UE_CODIGO')}/turmas-regulares`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 500 histórico é obrigatório nas regulares', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500) 
  })
})

// UE é obrigatório na abrangências das turmas regulares
When('envio uma requisição GET abrangências sem UE', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('SEM_HISTORICO')}/dres/ues//turmas-regulares`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 500 a UE é obrigatório', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500) 
  })
})

// Não busca histórico de abrangências das turmas regulares sem autenticação
When('tento uma requisição GET abrangências das turmas regulares', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('COM_HISTORICO')}/dres/ues/${Cypress.env('UE_CODIGO')}/turmas-regulares`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 histórico da turmas na UE', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Considera histórico de abrangências da disciplina na UE
When('envio uma requisição GET abrangências da disciplina na UE', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('COM_HISTORICO')}/dres/ues/${Cypress.env('UE_CODIGO')}/turmas/disciplina/${Cypress.env('DISCIPLINA_CODIGO')}/?periodo=0&anoLetivo=${Cypress.env('ANO_LETIVO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 204 com histórico da disciplina na UE', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(204) 
  })
})

// Não considera histórico de abrangências da disciplina na UE
When('envio uma requisição GET abrangências de disciplina na UE', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('SEM_HISTORICO')}/dres/ues/${Cypress.env('UE_CODIGO')}/turmas/disciplina/${Cypress.env('DISCIPLINA_CODIGO')}/?periodo=0&anoLetivo=${Cypress.env('ANO_LETIVO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 sem histórico da disciplina na UE', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(204) 
  })
})

// Histórico é obrigatório na abrangências da disciplina na UE
When('envio uma requisição GET abrangências sem histórico da disciplina na UE', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias//dres/ues/${Cypress.env('UE_CODIGO')}/turmas/disciplina/${Cypress.env('DISCIPLINA_CODIGO')}/?periodo=0&anoLetivo=${Cypress.env('ANO_LETIVO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 500 histórico é obrigatório disciplina', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500) 
  })
})

// UE é obrigatório na abrangências da disciplina na UE
When('envio uma requisição GET abrangências da disciplina na UE', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('SEM_HISTORICO')}/dres/ues//turmas/disciplina/${Cypress.env('DISCIPLINA_CODIGO')}/?periodo=0&anoLetivo=${Cypress.env('ANO_LETIVO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 204 a UE é obrigatório na disciplina', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(204) 
  })
})

// Disciplina é obrigatória na abrangências da UE
When('envio uma requisição GET abrangências sem disciplina da UE', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('COM_HISTORICO')}/dres/ues/${Cypress.env('UE_CODIGO')}/turmas/disciplina//?periodo=0&anoLetivo=${Cypress.env('ANO_LETIVO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 500 que a disciplina é obrigatória', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500) 
  })
})

// Ano letivo é obrigatório na abrangências da disciplina na
When('envio uma requisição GET abrangências sem ano letivo da UE', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('COM_HISTORICO')}/dres/ues/${Cypress.env('UE_CODIGO')}/turmas/disciplina/${Cypress.env('DISCIPLINA_CODIGO')}/?periodo=0&anoLetivo=`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 o ano é obrigatório na disciplina', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422) 
  })
})

// Não busca histórico de abrangências das turmas regulares sem autenticação
When('tento uma requisição GET abrangências das turmas regulares', function () { 
  cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/abrangencias/${Cypress.env('COM_HISTORICO')}/dres/ues/${Cypress.env('UE_CODIGO')}/turmas-regulares`,
    headers: {
     accept: 'application/json',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 histórico da turmas na UE', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})