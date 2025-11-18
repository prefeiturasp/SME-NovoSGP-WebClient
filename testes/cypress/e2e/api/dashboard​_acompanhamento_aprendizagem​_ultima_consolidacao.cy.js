/// <reference types='cypress' />

describe('API - Dashboard de acompanhamento aprendizagem por última consolidação', () => {    
    it('Retorna dashboard do ano letivo', () => {
      cy.buscar_dashboard_acompanhamento_ultima_consolidacacao().then((response) => {
        expect(response.status).to.eq(200)
      })
    })
  
    it('Não busca dashboard sem usuário autenticado', () => {
      cy.nao_autorizado_dashboard_acompanhamento_ultima_consolidacacao().then((response) => {
        expect(response.status).to.eq(401)
      })
    })
  
    it('Ano letivo deve ser informado', () => {
      cy.dashboard_acompanhamento_ultima_consolidacacao_ano_vazio().then((response) => {
        expect(response.status).to.eq(422)
      })
    })

    it('Ano letivo deve ser inválido', () => {
      cy.dashboard_acompanhamento_ultima_consolidacacao_ano_invalido().then((response) => {
        expect(response.status).to.eq(500)
      })
    })
})
  