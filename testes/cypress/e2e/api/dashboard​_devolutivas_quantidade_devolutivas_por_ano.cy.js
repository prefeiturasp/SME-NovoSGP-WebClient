/// <reference types='cypress' />

describe('API - Dashboard de quantidade de devolutivas por ano', () => {    
    it('Retorna quantidade de devolutivas', () => {
      cy.buscar_dashboard_devolutivas_quantidade_devolutivas_por_ano().then((response) => {
        expect(response.status).to.eq(200)
      })
    })
  
    it('Não retorna sem usuário autenticado', () => {
      cy.nao_autorizado_dashboard_devolutivas_quantidade_devolutivas_por_ano().then((response) => {
        expect(response.status).to.eq(401)
      })
    })
  
    it('Ano deve ser obrigatório', () => {
      cy.dashboard_devolutivas_quantidade_devolutivas_por_ano_vazio().then((response) => {
        expect(response.status).to.eq(422)
      })   
    })
})
  