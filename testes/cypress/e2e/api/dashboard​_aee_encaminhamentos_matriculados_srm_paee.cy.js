/// <reference types='cypress' />

describe('API - Dashboard AEE de planos acessibilidades', () => {   
    it('Retorna dados AEE planos acessibilidades', () => {
      cy.buscar_dashboard_aee_encaminhamentos_matriculados_srm_paee().then((response) => {
        expect(response.status).to.eq(204)
      })
    })
  
    it('Não retorna dados sem usuário autenticado', () => {
      cy.nao_autorizado_dashboard_aee_encaminhamentos_matriculados_srm_paee().then((response) => {
        expect(response.status).to.eq(401)
      })
    })
  
    it('Ano letivo deve ser obrigatório', () => {
      cy.dashboard_aee_encaminhamentos_matriculados_srm_paee_ano_vazio().then((response) => {
        expect(response.status).to.eq(422)
      })
    })    
})
  