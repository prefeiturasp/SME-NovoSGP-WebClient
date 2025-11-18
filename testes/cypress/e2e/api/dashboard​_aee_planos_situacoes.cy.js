/// <reference types='cypress' />

describe('API - Dashboard AEE de planos situações', () => {  
    it('Retorna dados AEE de situações de planos', () => {
      cy.buscar_dashboard_aee_planos_situacoes().then((response) => {
        expect(response.status).to.eq(200)
      })
    })
  
    it('Não retorna dados sem usuário autenticado', () => {
      cy.nao_autorizado_dashboard_aee_planos_situacoes().then((response) => {
        expect(response.status).to.eq(401)
      })
    })
  
    it('Ano letivo deve ser obrigatório', () => {
      cy.dashboard_aee_planos_situacoes_ano_vazio().then((response) => {
        expect(response.status).to.eq(422)
      })
    })

    it('DRE deve ser obrigatório', () => {
        cy.dashboard_aee_planos_situacoes_dre_vazio().then((response) => {
          expect(response.status).to.eq(422)
        })
    })

    it('UE deve ser obrigatório', () => {
        cy.dashboard_aee_planos_situacoes_ue_vazio().then((response) => {
          expect(response.status).to.eq(422)
        })
    })
})
  