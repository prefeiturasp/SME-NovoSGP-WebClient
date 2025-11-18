/// <reference types='cypress' />

describe('API - Dashboard AEE de planos acessibilidades', () => {    
    it('Retorna os dados AEE planos acessibilidades', () => {
      cy.buscar_dashboard_aee_planos_acessibilidades().then((response) => {
        expect(response.status).to.eq(204)
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
  