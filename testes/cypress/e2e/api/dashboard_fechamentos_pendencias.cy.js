/// <reference types='cypress' />

describe('API - Dashboard de fechamentos - Pendências', () => {    
    it('Carrega pendências do dashboard de fechamentos', () => {
      cy.buscar_dashboard_fechamentos_pendencias().then((response) => {
        expect(response.status).to.eq(200)
      })
    })
  
    it('Não retorna pendências sem usuário autenticado', () => {
      cy.nao_autorizado_dashboard_fechamentos_pendencias().then((response) => {
        expect(response.status).to.eq(401)
      })
    })     
})
  