import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps'

let token

before(() => {
  cy.gerar_token().then((token_valido) => {
    token = token_valido
  })
})

Given('que possuo um token de acesso válido', function () {
  expect(token, 'valido').to.exist
})

// Retorna dados da DRE
When('envio uma requisição GET do endpoint de atribuições de UEs', function () { 
  cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/dres/${Cypress.env('DRE_CODIGO')}/ues/atribuicoes`,
      headers: {
        accept: 'text/plain',
        'Authorization': `Bearer ${token}`,            
      },        
    failOnStatusCode: false,  
  }).as('response')
})

Then('retorna o status 200 e dados da DRE atribuídas', function () {
  cy.get('@response').then((response) => {
   expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array')
        response.body.forEach(item => {
        expect(item).to.have.all.keys(
         'codigo',
         'nomeSimples',
         'tipoEscola',
         'id',
         'nome',
         'ehInfantil'
      )
      expect(item.codigo).to.be.a('string')
      expect(item.nomeSimples).to.be.a('string')
      expect(item.tipoEscola).to.be.a('number')
      expect(item.id).to.be.a('number')
      expect(item.nome).to.be.a('string')
      expect(item.ehInfantil).to.be.a('boolean')
      })
    })
  })

// Retorna dados da DRE no ano letivo
When('envio a requisição GET de atribuições de UEs no ano letivo', function () { 
  cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/dres/${Cypress.env('DRE_CODIGO')}/ues/atribuicoes?anoLetivo=${Cypress.env('ANO_LETIVO')}`,
      headers: {
        accept: 'text/plain',
        'Authorization': `Bearer ${token}`,            
      },
    failOnStatusCode: false,  
  }).as('response')
})

Then('retorna o status 200 e dados da DRE atribuídas no ano', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
  })
})

// DRE deve ser obrigatório
When('envio uma requisição GET do endpoint de atribuições de UEs sem a DRE', function () { 
  cy.request({
   method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/dres//ues/atribuicoes`,
      headers: {
        accept: 'text/plain',
        'Authorization': `Bearer ${token}`,            
      },
    failOnStatusCode: false, 
  }).as('response')
})

Then('retorna o status 500 que sem dados atribuições que DRE deve ser obrigatório', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)     
  })
})

// Não retorna dados sem usuário autenticado
Given('que não possuo um token de acesso válido', () => {
})

When('tento a requisição GET do endpoint de atribuições de UEs', function () { 
  cy.request({
   method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/ues/${Cypress.env('UE_CODIGO')}/modalidades/${Cypress.env('MODALIDADE_CODIGO')}?ano=${Cypress.env('ANO_LETIVO')}`,
      headers: {
        accept: 'text/plain',
        'Authorization': `Bearer token_invalido`,            
      },   
    failOnStatusCode: false,  
  }).as('response')
})

Then('não retorna dados da DRE atribuídas mostrando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})
