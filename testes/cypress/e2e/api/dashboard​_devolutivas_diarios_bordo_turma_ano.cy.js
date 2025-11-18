/// <reference types='cypress' />

describe('API - Dashboard de devolutivas diarios de bordo por turma e ano', () => {
    it('Retorna dados da turma no ano', () => {
      cy.buscar_dashboard_devolutivas_diarios_bordo_turma_ano().then((response) => {
        expect(response.status).to.eq(200)
      })
    })
  
    it('Não retorna dados sem usuário autenticado', () => {
      cy.nao_autorizado_dashboard_devolutivas_diarios_bordo_turma_ano().then((response) => {
        expect(response.status).to.eq(401)
      })
    })
  
    it('Ano deve ser obrigatório', () => {
      cy.dashboard_devolutivas_diarios_bordo_turma_ano_vazio().then((response) => {
        expect(response.status).to.eq(422)
      })
    })

    it('Modalidade deve ser obrigatório', () => {
      cy.dashboard_devolutivas_diarios_bordo_turma_ano_modalidade_vazio().then((response) => {
        expect(response.status).to.eq(422)
      })
    })
})
  