/// <reference types='cypress' />

describe('API - Dashboard de devolutivas consolidação', () => {    
    it('Retorna dados da consolidação', () => {
      cy.buscar_dashboard_devolutivas_consolidacao().then((response) => {
        expect(response.status).to.eq(200)
      })
    })
  
    it('Não retorna dados sem usuário autenticado', () => {
      cy.nao_autorizado_dashboard_devolutivas_consolidacao().then((response) => {
        expect(response.status).to.eq(401)
      })
    })
  
    it('Ano deve ser obrigatório', () => {
      cy.dashboard_devolutivas_consolidacao_ano_vazio().then((response) => {
        expect(response.status).to.eq(422)
      })   
    })
})
  