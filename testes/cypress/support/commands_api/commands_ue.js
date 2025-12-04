Cypress.Commands.add('buscar_atribuicoes_dre_ue', () => {
    return cy.gerar_token().then((token) => {        
        return cy.request({
          method: 'GET',
          url: Cypress.config('baseUrl') + `/api/v1/dres/${Cypress.env('DRE_CODIGO')}/ues/atribuicoes`,
          headers: {
            'Accept': 'text/plain',
            'Authorization': `Bearer ${token}`,            
          },
          failOnStatusCode: false,
        })
    })
})

Cypress.Commands.add('buscar_atribuicoes_dre_ue_ano', () => {
    return cy.gerar_token().then((token) => {        
        return cy.request({
          method: 'GET',
          url: Cypress.config('baseUrl') + `/api/v1/dres/${Cypress.env('DRE_CODIGO')}/ues/atribuicoes?anoLetivo=${Cypress.env('ANO_LETIVO')}`,
          headers: {
            'Accept': 'text/plain',
            'Authorization': `Bearer ${token}`,            
          },
          failOnStatusCode: false,
        })
    })
})
  
Cypress.Commands.add('nao_autorizado_atribuicoes_dre_ue_ano', () => {
    return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/ues/${Cypress.env('UE_CODIGO')}/modalidades/${Cypress.env('MODALIDADE_CODIGO')}?ano=${Cypress.env('ANO_LETIVO')}`,
        headers: {
             'Accept': 'text/plain',
             'Authorization': 'Bearer token_invalido' 
            },
        failOnStatusCode: false
    })
})

Cypress.Commands.add('buscar_atribuicoes_ue_ano_dre_vazio', () => {
    return cy.gerar_token().then((token) => {        
        return cy.request({
          method: 'GET',
          url: Cypress.config('baseUrl') + `/api/v1/dres//ues/atribuicoes`,
          headers: {
            'Accept': 'text/plain',
            'Authorization': `Bearer ${token}`,            
          },
          failOnStatusCode: false,
        })
    })
})
