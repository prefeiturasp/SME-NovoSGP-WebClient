/// <reference types='cypress' />

describe('API - Dashboard AEE de planos vigentes', () => {    
    it('Retorna dados AEE planos vigentes', () => {
      cy.buscar_dashboard_aee_planos_vigentes().then((response) => {
        expect(response.status).to.eq(200)
      })
    })
  
    it('Não retorna dados sem usuário autenticado', () => {
      cy.nao_autorizado_dashboard_aee_planos_vigentes().then((response) => {
        expect(response.status).to.eq(401)
      })
    })
  
    it('Ano letivo deve ser obrigatório', () => {
      cy.dashboard_aee_planos_vigentes_ano_vazio().then((response) => {
        expect(response.status).to.eq(422)
      })
    })

    it('DRE deve ser obrigatório', () => {
        cy.dashboard_aee_planos_vigentes_dre_vazio().then((response) => {
          expect(response.status).to.eq(422)
        })
    })

    it('UE deve ser obrigatório', () => {
        cy.dashboard_aee_planos_vigentes_ue_vazio().then((response) => {
          expect(response.status).to.eq(422)
        })
    })
})
  