/// <reference types='cypress' />

describe('API - Dashboard de devolutivas DRE', () => {    
    it('Retorna dados da DRE', () => {
      cy.buscar_dashboard_devolutivas_dre().then((response) => {
        expect(response.status).to.eq(200)
      })
    })
  
    it('Não retorna dados sem usuário autenticado', () => {
      cy.nao_autorizado_dashboard_devolutivas_dre().then((response) => {
        expect(response.status).to.eq(401)
      })
    })
  
    it('Ano deve ser obrigatório', () => {
      cy.dashboard_devolutivas_dre_ano_vazio().then((response) => {
        expect(response.status).to.eq(422)
      })   
    })
})
  