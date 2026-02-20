Cypress.Commands.add('buscar_supervisor_dre', () => {
    return cy.gerar_token().then((token) => {        
        return cy.request({
          method: 'GET',
          url: Cypress.config('baseUrl') + `/api/v1/supervisores/dre/${Cypress.env('DRE_CODIGO')}`,
          headers: {
            'Accept': 'text/plain',
            'Authorization': `Bearer ${token}`,            
          },
          failOnStatusCode: false,
      })
    })
})

Cypress.Commands.add('nao_autorizado_buscar_supervisor_dre', () => {
    return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/supervisores/dre/${Cypress.env('DRE_CODIGO')}`,
        headers: {
             'Accept': 'text/plain',
             'Authorization': 'Bearer token_invalido' 
        },
    failOnStatusCode: false
  })
})



