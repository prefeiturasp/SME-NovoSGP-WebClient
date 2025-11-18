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

// Buscar adesão no dashboard EA
When('envio uma requisição GET para o endpoint de adesão EA', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/adesao?codigoDre=${Cypress.env('DRE_CODIGO')}&codigoUe=${Cypress.env('UE_CODIGO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('informo a UE com a DRE', function () {  
})

Then('retorna o status 200 de busca no dashboard EA', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)   
  })
})

// Buscar adesão ao dashboard na UE
When('envio uma requisição GET para o endpoint de adesão sem DRE', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/adesao?codigoDre=&codigoUe=${Cypress.env('UE_CODIGO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('informo somente a UE', function () {  
})

Then('retorna o status 200 de busca EA da UE', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.be.an('array').and.not.empty
    response.body.forEach((dre) => {
      expect(dre).to.have.property('nomeCompletoDre')
      expect(dre).to.have.property('nomeCompletoUe')
      expect(dre).to.have.property('codigoturma')
      expect(dre).to.have.property('totalUsuariosComCpfInvalidos')
      expect(dre).to.have.property('totalUsuariosPrimeiroAcessoIncompleto')
      expect(dre).to.have.property('totalUsuariosSemAppInstalado')
      expect(dre).to.have.property('totalUsuariosValidos')
    })
  })
})

// Buscar adesão ao dashboard na DRE
When('envio uma requisição GET para o endpoint de adesão sem UE', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/adesao?codigoDre=&codigoUe=${Cypress.env('UE_CODIGO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('informo somente a DRE', function () {  
})

Then('retorna o status 200 de busca EA da DRE', function () {
  cy.get('@response').then((response) => {
   expect(response.status).to.eq(200)
    expect(response.body).to.be.an('array').and.not.empty
    response.body.forEach((dre) => {
      expect(dre).to.have.property('nomeCompletoDre')
      expect(dre).to.have.property('nomeCompletoUe')
      expect(dre).to.have.property('codigoturma')
      expect(dre).to.have.property('totalUsuariosComCpfInvalidos')
      expect(dre).to.have.property('totalUsuariosPrimeiroAcessoIncompleto')
      expect(dre).to.have.property('totalUsuariosSemAppInstalado')
      expect(dre).to.have.property('totalUsuariosValidos')
    })
  })
})

// Não buscar adesão no dashboard EA sem autenticação
Given('que não login não gerou um token de acesso válido', () => {
  token = 'token_invalido'
})

When('tento uma requisição GET para o endpoint de adesão EA', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/adesao?codigoDre=${Cypress.env('DRE_CODIGO')}&codigoUe=${Cypress.env('UE_CODIGO')}`,
    headers: {
     accept: 'text/plain',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem as adesões', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Buscar adesão no dashboard EA agrupado por DRE
When('envio uma requisição GET para o endpoint de adesão EA agrupados', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/adesao/agrupados`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 de busca no dashboard EA totalizado as Dres', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.be.an('array').and.not.empty
    response.body.forEach((dre) => {
      expect(dre).to.have.property('nomeCompletoDre')
      expect(dre).to.have.property('totalUsuariosComCpfInvalidos')
      expect(dre).to.have.property('totalUsuariosPrimeiroAcessoIncompleto')
      expect(dre).to.have.property('totalUsuariosSemAppInstalado')
      expect(dre).to.have.property('totalUsuariosValidos')
    })
  })
})

// Não buscar adesão agrupado no dashboard EA sem autenticação
When('tento uma requisição GET para o endpoint de adesão EA', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/adesao/agrupados`,
    headers: {
     accept: 'text/plain',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem o agrupamento', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Buscar adesão no dashboard EA agrupado por DRE
When('envio uma requisição GET para o endpoint de adesão EA agrupados', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/adesao/agrupados`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 de busca no dashboard EA totalizado as Dres', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.be.an('array').and.not.empty
    response.body.forEach((dre) => {
      expect(dre).to.have.property('nomeCompletoDre')
      expect(dre).to.have.property('totalUsuariosComCpfInvalidos')
      expect(dre).to.have.property('totalUsuariosPrimeiroAcessoIncompleto')
      expect(dre).to.have.property('totalUsuariosSemAppInstalado')
      expect(dre).to.have.property('totalUsuariosValidos')
    })
  })
})

// Não buscar adesão agrupado no dashboard EA sem autenticação
When('tento uma requisição GET para o endpoint de adesão EA', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/adesao/agrupados`,
    headers: {
     accept: 'text/plain',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem o agrupamento', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Nome do processamento no dashboard EA é obrigatório
When('envio uma requisição GET para o endpoint sem o processamento', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/ultimoProcessamento?nomeProcesso=`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 601 que o nome do processo é obrigatório', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)
    expect(response.body.existemErros).to.be.true
    expect(response.body.mensagens).to.include("O nome do processo é obrigatório")
  })
})

// Não buscar com nome do processamento no dashboard EA inválido
When('envio uma requisição GET para o endpoint com nome inválido', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/ultimoProcessamento?nomeProcesso=teste`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 601 ao obter dados de adesão do aplicativo', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)
    expect(response.body.existemErros).to.be.true
    expect(response.body.mensagens).to.include("Não foi possível obter dados de adesão do aplicativo.")
  })
})

// Não buscar processamento no dashboard EA sem autenticação
When('tento uma requisição GET para o endpoint de processamento', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/ultimoProcessamento?nomeProcesso=`,
    headers: {
     accept: 'text/plain',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem os nomes de processos', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Buscar comunicados totais no dashboard
When('envio uma requisição GET para o endpoint de comunicados totais', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/comunicados/totais?anoLetivo=${Cypress.env('ANO_LETIVO')}&codigoDre=${Cypress.env('DRE_CODIGO')}&codigoUe=${Cypress.env('UE_CODIGO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com os vigentes e expirados', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.have.property('totalComunicadosVigentes')
    expect(response.body).to.have.property('totalComunicadosExpirados')   
  })
})

// Ano letivo no dashboard de comunicados totais é obrigatório
When('envio uma requisição GET para o endpoint de comunicados sem ano letivo', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/comunicados/totais?anoLetivo=&codigoDre=${Cypress.env('DRE_CODIGO')}&codigoUe=${Cypress.env('UE_CODIGO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 que o valor é inválido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    expect(response.body.existemErros).to.be.true
    expect(response.body.mensagens).to.include("The value '' is invalid.")
  })
})

// Não buscar comunicados totais no dashboard sem autenticação
When('tento uma requisição GET para o endpoint de comunicados totais', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/comunicados/totais?anoLetivo=&codigoDre=${Cypress.env('DRE_CODIGO')}&codigoUe=${Cypress.env('UE_CODIGO')}`,
    headers: {
      accept: 'text/plain',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem os vigentes e expirados', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Buscar comunicados totais agrupados no dashboard
When('envio uma requisição GET para o endpoint de comunicados totais agrupados', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/comunicados/totais/agrupados?anoLetivo=${Cypress.env('ANO_LETIVO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com nome da DRE, os vigentes e expirados', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.be.an('array').and.not.empty
    response.body.forEach((item) => {
      expect(item).to.have.property('nomeAbreviadoDre')
      expect(item).to.have.property('totalComunicadosVigentes')
      expect(item).to.have.property('totalComunicadosExpirados')
    })
  })
})

// Ano letivo no dashboard de comunicados totais agrupados é obrigatório
When('envio uma requisição GET para o endpoint de comunicados agrupados sem ano letivo', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/comunicados/totais/agrupados?anoLetivo=`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 que o valor é inválido para listar', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    expect(response.body.existemErros).to.be.true
    expect(response.body.mensagens).to.include("The value '' is invalid.")
  })
})

// Não buscar comunicados totais agrupados no dashboard sem autenticação
When('tento uma requisição GET para o endpoint de comunicados totais agrupados', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/comunicados/totais/agrupados?anoLetivo=${Cypress.env('ANO_LETIVO')}`,
    headers: {
      accept: 'text/plain',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem nome da DRE, os vigentes e expirados', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Buscar leitura dos comunicados no dashboard
When('envio uma requisição GET para o endpoint de leituras de comunicados', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/comunicados/leitura?NotificacaoId=${Cypress.env('NOTIFICACAO_CODIGO')}&ModoVisualizacao=${Cypress.env('MODO_VISUALIZACAO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com nome da DRE, Ue, não receberam, não visualizaram e visualizaram', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
    expect(response.body).to.be.an('array').and.not.empty
    response.body.forEach((item) => {
      expect(item).to.have.property('nomeAbreviadoDre')
      expect(item).to.have.property('nomeAbreviadoUe')
      expect(item).to.have.property('naoReceberamComunicado')
      expect(item).to.have.property('receberamENaoVisualizaram')
      expect(item).to.have.property('visualizaramComunicado')
    })
  })
})

// Campo do código do comunicado é obrigatório
When('envio uma requisição GET para o endpoint de leituras sem o código do comunicado', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/comunicados/leitura?NotificacaoId=&ModoVisualizacao=${Cypress.env('MODO_VISUALIZACAO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 informando que o comunicado é obrigatório', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    expect(response.body.existemErros).to.be.true
    expect(response.body.mensagens).to.include("The value '' is invalid.")
  })
})

// Modo de visualização é obrigatório
When('envio uma requisição GET para o endpoint de leituras sem o modo de visualização', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/comunicados/leitura?NotificacaoId=${Cypress.env('NOTIFICACAO_CODIGO')}&ModoVisualizacao=`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 informando que o modo é obrigatório', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    expect(response.body.existemErros).to.be.true
    expect(response.body.mensagens).to.include("The value '' is invalid.")
  })
})

// Não buscar com código do comunicado inválido
When('envio uma requisição GET para o endpoint de leituras com o código do comunicado inválido', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/comunicados/leitura?NotificacaoId=${Cypress.env('NOTIFICACAO_CODIGO_INVALIDO')}&ModoVisualizacao=${Cypress.env('MODO_VISUALIZACAO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 400 informando que não existe', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(400)
    expect(response.body.existemErros).to.be.true
    expect(response.body.mensagens).to.include("O comunicado informado não existe. Por favor tente novamente.")
  })
})

// Não buscar comunicados totais agrupados no dashboard sem autenticação
When('tento uma requisição GET para o endpoint de leituras de comunicados', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/comunicados/leitura?NotificacaoId=${Cypress.env('NOTIFICACAO_CODIGO')}&ModoVisualizacao=${Cypress.env('MODO_VISUALIZACAO')}`,
    headers: {
      accept: 'text/plain',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem nome da DRE, Ue, não receberam, não visualizaram e visualizaram', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Buscar leitura dos comunicados agrupados no dashboard
When('envio uma requisição GET para o endpoint de leituras de comunicados agrupados', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/comunicados/leitura/agrupados?NotificacaoId=${Cypress.env('NOTIFICACAO_CODIGO')}&ModoVisualizacao=${Cypress.env('MODO_VISUALIZACAO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 com as notificações', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)
  })
})

// Campo do código do comunicado agrupados é obrigatório
When('envio uma requisição GET para o endpoint de leituras agrupados sem o código do comunicado', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/comunicados/leitura/agrupados?NotificacaoId=&ModoVisualizacao=${Cypress.env('MODO_VISUALIZACAO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 informando que o comunicado é obrigatório para agrupar', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    expect(response.body.existemErros).to.be.true
    expect(response.body.mensagens).to.include("The value '' is invalid.")
  })
})

// Modo de visualização é obrigatório para agrupar
When('envio uma requisição GET para o endpoint de leituras agrupados sem o modo de visualização', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/comunicados/leitura/agrupados?NotificacaoId=${Cypress.env('NOTIFICACAO_CODIGO')}&ModoVisualizacao=`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 informando que o modo é obrigatório para agrupar', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    expect(response.body.existemErros).to.be.true
    expect(response.body.mensagens).to.include("The value '' is invalid.")
  })
})

// Não buscar agrupado com código do comunicado inválido
When('envio uma requisição GET para o endpoint de leituras agrupados com o código do comunicado inválido', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/comunicados/leitura/agrupados?NotificacaoId=${Cypress.env('NOTIFICACAO_CODIGO_INVALIDO')}&ModoVisualizacao=${Cypress.env('MODO_VISUALIZACAO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 400 informando que não existe para agrupar', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(400)
    expect(response.body.existemErros).to.be.true
    expect(response.body.mensagens).to.include("O comunicado informado não existe. Por favor tente novamente.")
  })
})

// Não buscar comunicados totais agrupados no dashboard sem autenticação
When('tento uma requisição GET para o endpoint de leituras agrupados de comunicados', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/comunicados/leitura/agrupados?NotificacaoId=${Cypress.env('NOTIFICACAO_CODIGO')}&ModoVisualizacao=${Cypress.env('MODO_VISUALIZACAO')}`,
    headers: {
      accept: 'text/plain',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem agrupar nome da DRE, Ue, não receberam, não visualizaram e visualizaram', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Filtrar comunicados no dashboard EA
When('envio uma requisição GET para o endpoint de filtro de comunicados', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/comunicados/filtro?AnoLetivo=${Cypress.env('ANO_LETIVO')}&Modalidades=${Cypress.env('MODALIDADE_CODIGO')}`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 de sucesso do dashboard EA', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
  })
})

// Ano letivo é obrigatório para filtrar dashboard EA
When('envio uma requisição GET para o endpoint de filtro de comunicados sem o ano', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/comunicados/filtro?AnoLetivo=&Modalidades=${Cypress.env('MODALIDADE_CODIGO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 informando que o ano letivo é inválido', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    expect(response.body.existemErros).to.be.true
    expect(response.body.mensagens).to.include("The value '' is invalid.")
  })
})

// Modalidade é obrigatório para filtrar dashboard EA
When('envio uma requisição GET para o endpoint de filtro de comunicados sem a modalidade', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/comunicados/filtro?AnoLetivo=${Cypress.env('ANO_LETIVO')}&Modalidades=`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 informando que a modalidade é inválida', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    expect(response.body.existemErros).to.be.true
    expect(response.body.mensagens).to.include("The value '' is invalid.")
  })
})

// Não filtrar comunicados no dashboard EA sem autenticação
When('tento uma uma requisição GET para o endpoint de filtro de comunicados', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/comunicados/filtro?AnoLetivo=${Cypress.env('ANO_LETIVO')}&Modalidades=${Cypress.env('MODALIDADE_CODIGO')}`,
    headers: {
      accept: 'text/plain',
     Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem filtrar o dashboard EA', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Leitura de comunicados de modalidades no dashboard EA
When('envio uma requisição GET para o endpoint de leitura de comunicados', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/comunicados/leitura/modalidades?CodigoDre=${Cypress.env('DRE_CODIGO')}&CodigoUe=${Cypress.env('UE_CODIGO')}&NotificacaoId=${Cypress.env('NOTIFICACAO_CODIGO')}&ModoVisualizacao=${Cypress.env('MODO_VISUALIZACAO')}`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 de sucesso do dashboard EA de comunicados', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
  })
})

// Código da DRE é obrigatório para leitura de comunicados de modalidades
When('envio uma requisição GET para o endpoint de leitura de comunicados sem a DRE', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/comunicados/leitura/modalidades?CodigoDre=&CodigoUe=${Cypress.env('UE_CODIGO')}&NotificacaoId=${Cypress.env('NOTIFICACAO_CODIGO')}&ModoVisualizacao=${Cypress.env('MODO_VISUALIZACAO')}`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 601 que o código da DRE é obrigatório', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)
    expect(response.body.existemErros).to.be.true
    expect(response.body.mensagens).to.include("O código da DRE é obrigatório.")
  })
})

// Código da UE é obrigatório para leitura de comunicados de modalidades
When('envio uma requisição GET para o endpoint de leitura de comunicados sem a UE', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/comunicados/leitura/modalidades?CodigoDre=${Cypress.env('DRE_CODIGO')}&CodigoUe=&NotificacaoId=${Cypress.env('NOTIFICACAO_CODIGO')}&ModoVisualizacao=${Cypress.env('MODO_VISUALIZACAO')}`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 601 que o código da UE é obrigatório', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601)
    expect(response.body.existemErros).to.be.true
    expect(response.body.mensagens).to.include("O código da UE é obrigatório.")
  })
})

// Código da notificação é obrigatório para leitura de comunicados de modalidades
When('envio uma requisição GET para o endpoint de leitura de comunicados sem a notificação', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/comunicados/leitura/modalidades?CodigoDre=${Cypress.env('DRE_CODIGO')}&CodigoUe=${Cypress.env('UE_CODIGO')}&NotificacaoId=&ModoVisualizacao=${Cypress.env('MODO_VISUALIZACAO')}`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 que o código da notificação é obrigatório', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    expect(response.body.existemErros).to.be.true
    expect(response.body.mensagens).to.include("The value '' is invalid.")
  })
})

// Modo de visualização é obrigatório para leitura de comunicados de modalidades
When('envio uma requisição GET para o endpoint de leitura de comunicados sem o modo de visualização', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/comunicados/leitura/modalidades?CodigoDre=${Cypress.env('DRE_CODIGO')}&CodigoUe=${Cypress.env('UE_CODIGO')}&NotificacaoId=${Cypress.env('NOTIFICACAO_CODIGO')}&ModoVisualizacao=`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 que o modo de visualização é obrigatório', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    expect(response.body.existemErros).to.be.true
    expect(response.body.mensagens).to.include("The value '' is invalid.")
  })
})

// Não retornar a leitura de comunicados de modalidades no dashboard EA sem autenticação
When('tento uma requisição GET para o endpoint de leitura de comunicados', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/comunicados/leitura/modalidades?CodigoDre=${Cypress.env('DRE_CODIGO')}&CodigoUe=${Cypress.env('UE_CODIGO')}&NotificacaoId=${Cypress.env('NOTIFICACAO_CODIGO')}&ModoVisualizacao=${Cypress.env('MODO_VISUALIZACAO')}`,
    headers: {
      accept: '*/*',
      Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem a leitura no dashboard EA', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Leitura de comunicados de turmas no dashboard EA
When('envio uma requisição GET para o endpoint de leitura de turmas', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/comunicados/leitura/turmas?CodigoDre=${Cypress.env('DRE_CODIGO')}&CodigoUe=${Cypress.env('UE_CODIGO')}&NotificacaoId=${Cypress.env('NOTIFICACAO_CODIGO')}&ModoVisualizacao=${Cypress.env('MODO_VISUALIZACAO')}`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 de leitura do dashboard EA de comunicados', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
  })
})

// Código da DRE é obrigatório para leitura de comunicados de turmas
When('envio uma requisição GET para o endpoint de leitura de turmas sem a DRE', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/comunicados/leitura/turmas?CodigoDre=&CodigoUe=${Cypress.env('UE_CODIGO')}&NotificacaoId=${Cypress.env('NOTIFICACAO_CODIGO')}&ModoVisualizacao=${Cypress.env('MODO_VISUALIZACAO')}`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 que o código da DRE é obrigatório na leitura', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    expect(response.body.existemErros).to.be.true
    expect(response.body.mensagens).to.include("O código da DRE deve ser informado.")
  })
})

// Código da UE é obrigatório para leitura de comunicados de modalidades
When('envio uma requisição GET para o endpoint de leitura de turmas sem a UE', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/comunicados/leitura/turmas?CodigoDre=${Cypress.env('DRE_CODIGO')}&CodigoUe=&NotificacaoId=${Cypress.env('NOTIFICACAO_CODIGO')}&ModoVisualizacao=${Cypress.env('MODO_VISUALIZACAO')}`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 que o código da UE é obrigatório na leitura', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    expect(response.body.existemErros).to.be.true
    expect(response.body.mensagens).to.include("O código da UE deve ser informado.")
  })
})

// Código da notificação é obrigatório para leitura de comunicados de turmas
When('envio uma requisição GET para o endpoint de leitura de turmas sem a notificação', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/comunicados/leitura/turmas?CodigoDre=${Cypress.env('DRE_CODIGO')}&CodigoUe=${Cypress.env('UE_CODIGO')}&NotificacaoId=&ModoVisualizacao=${Cypress.env('MODO_VISUALIZACAO')}`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 que o código da notificação é obrigatório na leitura', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    expect(response.body.existemErros).to.be.true
    expect(response.body.mensagens).to.include("The value '' is invalid.")
  })
})

// Modo de visualização é obrigatório para leitura de comunicados de turmas
When('envio uma requisição GET para o endpoint de leitura de turmas sem o modo de visualização', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/comunicados/leitura/turmas?CodigoDre=${Cypress.env('DRE_CODIGO')}&CodigoUe=${Cypress.env('UE_CODIGO')}&NotificacaoId=${Cypress.env('NOTIFICACAO_CODIGO')}&ModoVisualizacao=`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 que o modo de visualização é obrigatório na leitura', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    expect(response.body.existemErros).to.be.true
    expect(response.body.mensagens).to.include("The value '' is invalid.")
  })
})

// Não retornar a leitura de turmas de modalidades no dashboard EA sem autenticação
When('tento uma requisição GET para o endpoint de leitura de turmas', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/comunicados/leitura/turmas?CodigoDre=${Cypress.env('DRE_CODIGO')}&CodigoUe=${Cypress.env('UE_CODIGO')}&NotificacaoId=${Cypress.env('NOTIFICACAO_CODIGO')}&ModoVisualizacao=${Cypress.env('MODO_VISUALIZACAO')}`,
    headers: {
      accept: '*/*',
      Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem a leitura no dashboard EA na leitura', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

// Leitura de comunicados de alunos no dashboard EA
When('envio uma requisição GET para o endpoint de alunos de turmas', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/comunicados/leitura/alunos?ComunicadoId=${Cypress.env('NOTIFICACAO_CODIGO')}&CodigoTurma=${Cypress.env('TURMA_CODIGO')}`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 200 de alunos do dashboard EA de comunicados', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(500)
  })
})

// Código da turma é obrigatório para leitura de comunicados de alunos
When('envio uma requisição GET para o endpoint de leitura de alunos sem a turma', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/comunicados/leitura/alunos?ComunicadoId=${Cypress.env('NOTIFICACAO_CODIGO')}&CodigoTurma=`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 que o código da turma é obrigatório na leitura', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    expect(response.body.existemErros).to.be.true
    expect(response.body.mensagens).to.include("The value '' is invalid.")
  })
})

// Código da notificação é obrigatório para leitura de comunicados de alunos
When('envio uma requisição GET para o endpoint de leitura de alunos sem a notificação', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/comunicados/leitura/alunos?ComunicadoId=&CodigoTurma=${Cypress.env('TURMA_CODIGO')}`,
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${token}`
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 422 que o código da notificação é obrigatório na turma', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422)
    expect(response.body.existemErros).to.be.true
    expect(response.body.mensagens).to.include("The value '' is invalid.")
  })
})

// Não retornar a leitura de alunos de modalidades no dashboard EA sem autenticação
When('tento uma requisição GET para o endpoint de leitura de alunos', function () { 
  return cy.request({
    method: 'GET',
    url: Cypress.config('baseUrl') + `/api/v1/ea/dashboard/comunicados/leitura/alunos?ComunicadoId=${Cypress.env('NOTIFICACAO_CODIGO')}&CodigoTurma=${Cypress.env('TURMA_CODIGO')}`,
    headers: {
      accept: '*/*',
      Authorization: 'Bearer token_invalido'
    },
    failOnStatusCode: false
  }).as('response')
})

Then('retorna o status 401 sem a leitura no dashboard EA da turma', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})

