/// <reference types='cypress' />

describe('API - Dashboard de devolutivas consolidação por turma e ano', () => {    
    it('Retorna dados da turma no ano', () => {
      cy.buscar_dashboard_devolutivas_consolidacao_turma_ano().then((response) => {
        expect(response.status).to.eq(200)
      })
    })
  
    it('Não retorna dados sem usuário autenticado', () => {
      cy.nao_autorizado_dashboard_devolutivas_consolidacao_turma_ano().then((response) => {
        expect(response.status).to.eq(401)
      })
    })
  
    it('Ano deve ser obrigatório', () => {
      cy.dashboard_devolutivas_consolidacao_turma_ano_vazio().then((response) => {
        expect(response.status).to.eq(422)
      })
    })

    it('Modalidade deve ser obrigatório', () => {
      cy.dashboard_devolutivas_consolidacao_turma_modalidade_vazio().then((response) => {
        expect(response.status).to.eq(422)
      })
    })
})
  