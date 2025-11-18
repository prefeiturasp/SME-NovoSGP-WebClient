/// <reference types='cypress' />

describe('API - Dashboard de fechamentos - Conselhos de classes - Pareceres conclusivos', () => {  
    it('Carrega dashboard de fechamento do conselho de classe de pareceres conclusivos', () => {
      cy.buscar_dashboard_fechamentos_conselhos_classes_pareceres_conclusivos().then((response) => {
        expect(response.status).to.eq(204)
      })
    })
  
    it('Não retorna pareceres conclusivos de fechamento sem usuário autenticado', () => {
      cy.nao_autorizado_dashboard_fechamentos_conselhos_classes_pareceres_conclusivos().then((response) => {
        expect(response.status).to.eq(401)
      })
    })     
})
  