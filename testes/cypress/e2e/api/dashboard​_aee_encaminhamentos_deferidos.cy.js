/// <reference types='cypress' />

describe('API - Dashboard AEE de encaminhamentos deferidos', () => {   
    it('Retorna dados AEE de encaminhamentos deferidos', () => {
      cy.buscar_dashboard_aee_encaminhamentos_deferidos().then((response) => {
        expect(response.status).to.eq(200)
      })
    })
  
    it('Não retorna dados sem usuário autenticado', () => {
      cy.nao_autorizado_dashboard_aee_encaminhamentos_deferidos().then((response) => {
        expect(response.status).to.eq(401)
      })
    })
  
    it('Ano letivo deve ser obrigatório', () => {
      cy.dashboard_aee_encaminhamentos_deferidos_ano_vazio().then((response) => {
        expect(response.status).to.eq(422)
      })
    })

    it('DRE deve ser obrigatório', () => {
      cy.dashboard_aee_encaminhamentos_deferidos_dre_vazio().then((response) => {
          expect(response.status).to.eq(422)
      })
    })

    it('UE deve ser obrigatório', () => {
      cy.dashboard_aee_encaminhamentos_deferidos_ue_vazio().then((response) => {
          expect(response.status).to.eq(422)
      })
    })
})
  