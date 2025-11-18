/// <reference types='cypress' />

describe('API - Dashboard de fechamentos - Conselhos de classes - Notas finais', () => {  
    it('Carrega dashboard de fechamento do conselho de classe com notas finais', () => {
      cy.buscar_dashboard_fechamentos_conselhos_classes_notas_finais().then((response) => {
        expect(response.status).to.eq(200)
      })
    })
  
    it('Não retorna notas finais de fechamento sem usuário autenticado', () => {
      cy.nao_autorizado_dashboard_fechamentos_conselhos_classes_notas_finais().then((response) => {
        expect(response.status).to.eq(401)
      })
    })     
})
  