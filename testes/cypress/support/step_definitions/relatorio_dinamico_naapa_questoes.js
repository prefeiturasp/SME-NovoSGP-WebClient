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

// Retorna os grupos de questões
When('envio uma requisição GET ao NAAPA dinâmico', function () { 
  cy.request({
   method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/relatorio-dinamico-naapa/questoes`,
        headers: {
          accept: 'text/plain',
          'Authorization': `Bearer ${token}`,
       },
    failOnStatusCode: false,      
  }).as('response')
})

Then('retorna o status 200 com os grupos de questões', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200)
      expect(response.body).to.be.an('array')

      response.body.forEach((grupo) => {
        expect(grupo).to.include.all.keys(
          'id',
          'nome',
          'questionarioId',
          'nomeComponente',
          'ordem',
          'tipoQuestionario',
          'modalidadesCodigo',
          'questoes'
        )

        expect(grupo.questoes).to.be.an('array')

        grupo.questoes.forEach((questao) => {
          expect(questao).to.include.all.keys(
            'id',
            'ordem',
            'nome',
            'observacao',
            'obrigatorio',
            'somenteLeitura',
            'tipoQuestao',
            'opcionais',
            'opcaoResposta',
            'resposta',
            'dimensao',
            'tamanho',
            'mascara',
            'placeHolder',
            'nomeComponente'
          )
        })
      })
    })
  })

// Não retorna dados sem usuário autenticado
Given('que não possuo um token de acesso válido', () => {
})

When('tento a requisição GET ao NAAPA dinâmico', function () { 
  cy.request({
    method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/relatorio-dinamico-naapa/questoes`,
      headers: {
        accept: 'text/plain',
        'Authorization': 'Bearer token_invalido' 
    },
  failOnStatusCode: false
  }).as('response')
})

Then('não retorna os dados mostrando o status 401', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401)
  })
})
