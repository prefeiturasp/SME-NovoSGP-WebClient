Cypress.Commands.add('buscar_mural_atividades_infantil', () => {
    return cy.gerar_token().then((token) => {        
        return cy.request({
          method: 'GET',
          url: Cypress.config('baseUrl') + `/api/v1/mural/atividades/infantil?aulaId=${Cypress.env('AULA_CODIGO')}`,
          headers: {
            'Accept': 'text/plain',
            'Authorization': `Bearer ${token}`,            
          },
          failOnStatusCode: false,
        })
    })
})
  
Cypress.Commands.add('nao_autorizado_mural_atividades_infantil', () => {
    return cy.request({
        method: 'GET',
        url: `${Cypress.config('baseUrl')}/api/v1/mural/atividades/infantil?aulaId=${Cypress.env('AULA_CODIGO')}`,
        headers: {
             'Accept': '*/*',
             'Authorization': 'Bearer token_invalido' 
            },
        failOnStatusCode: false
    })
})

Cypress.Commands.add('mural_atividades_infantil_aula_invalida', () => {
    return cy.gerar_token().then((token) => { 
        return cy.request({
            method: 'GET',
            url: `${Cypress.config('baseUrl')}/api/v1/mural/atividades/infantil?aulaId=${Cypress.env('AULA_CODIGO_INVALIDO')}`,
            headers: {
             'Accept': '*/*',
             'Authorization': `Bearer ${token}`,
            },
        failOnStatusCode: false
      })
    })
})  

