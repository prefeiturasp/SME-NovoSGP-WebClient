Cypress.Commands.add('buscar_relatorio_dinamico_naapa_questoes', () => {
    return cy.gerar_token().then((token) => {        
        return cy.request({
          method: 'GET',
          url: Cypress.config('baseUrl') + `/api/v1/relatorio-dinamico-naapa/questoes`,
          headers: {
            'Accept': 'text/plain',
            'Authorization': `Bearer ${token}`,
          },
          failOnStatusCode: false,
        })
    })
})
  
  Cypress.Commands.add('nao_autorizado_relatorio_dinamico_naapa_questoes', () => {
    return cy.request({
        method: 'GET',
        url: Cypress.config('baseUrl') + `/api/v1/relatorio-dinamico-naapa/questoes`,
        headers: {
             'Accept': 'text/plain',
             'Authorization': 'Bearer token_invalido' 
            },
        failOnStatusCode: false
    })
})

Cypress.Commands.add('filtrar_relatorio_dinamico_naapa', () => {
    return cy.gerar_token().then((token) => {        
        return cy.request({
          method: 'POST',
          url: Cypress.config('baseUrl') + `/api/v1/relatorio-dinamico-naapa`,
          headers: {
            'Accept': 'text/plain',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json-patch+json'
          },
          body: {
            historico: Cypress.env('HISTORICO') === 'false', 
            anoLetivo: Number(Cypress.env('ANO_LETIVO')),
            dreId: Cypress.env('DRE_CODIGO'),
            ueId: Cypress.env('UE_CODIGO'),
            modalidades: Array.isArray(Cypress.env('MODALIDADE_CODIGO'))
             ? Cypress.env('MODALIDADE_CODIGO')
             : Cypress.env('MODALIDADE_CODIGO')
             ? [Number(Cypress.env('MODALIDADE_CODIGO'))]
             : [],
            anos: Array.isArray(Cypress.env('ANOS'))
             ? Cypress.env('ANOS')
             : Cypress.env('ANOS')
             ? [String(Cypress.env('ANOS'))]
             : [],
            filtroAvancado: Array.isArray(Cypress.env('FILTRO_AVANCADO'))
             ? Cypress.env('FILTRO_AVANCADO')
             : [],
            },
        failOnStatusCode: false
        })
    })
})
  
  Cypress.Commands.add('nao_autorizado_filtrar_relatorio_dinamico_naapa', () => {
    return cy.request({
        method: 'POST',
        url: Cypress.config('baseUrl') + `/api/v1/relatorio-dinamico-naapa`,
        headers: {
             'Accept': 'text/plain',
             'Authorization': 'Bearer token_invalido',
             'Content-Type': 'application/json-patch+json'
            },
          body: {
            historico: false,
            anoLetivo: 2025,
            dreId: '',
            ueId: '',
            modalidades: [],
            anos: [],
            filtroAvancado: []
          },
        failOnStatusCode: false
    })
})