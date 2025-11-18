/// <reference types='cypress' />

describe('API - Dashboard de fechamentos - Estudantes', () => {    
    it('Carrega estudantes do dashboard de fechamentos', () => {
      cy.buscar_dashboard_fechamentos_estudantes().then((response) => {
        expect(response.status).to.eq(200)
      })
    })
  
    it('Não retorna estudantes sem usuário autenticado', () => {
      cy.nao_autorizado_dashboard_fechamentos_estudantes().then((response) => {
        expect(response.status).to.eq(401)
      })
    })     
})
  