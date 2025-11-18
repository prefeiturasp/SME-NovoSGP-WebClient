/// <reference types='cypress' />

describe('API - Dashboard de fechamentos - Conselhos de classes - Situações', () => {    
    it('Retorna situações do dashboard de fechamento do conselho de classe', () => {
      cy.buscar_dashboard_fechamentos_conselhos_classes_situacoes().then((response) => {
        expect(response.status).to.eq(204)
      })
    })
  
    it('Não retorna situações de fechamento sem usuário autenticado', () => {
      cy.nao_autorizado_dashboard_fechamentos_conselhos_classes_situacoes().then((response) => {
        expect(response.status).to.eq(401)
      })
    })     
})
  