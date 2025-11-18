/// <reference types='cypress' />

describe('API - Dashboard compensações de ausência consideradas', () => {   
  it('Retorna dados da turma no bimestre', () => {
    cy.buscar_dashboard_compesacoes_ausencia_consideradas().then((response) => {
      expect(response.status).to.eq(204)  
    })
  })
  
  it('Não retorna dados sem usuário autenticado', () => {
      cy.nao_autorizado_dashboard_compesacoes_ausencia_consideradas().then((response) => {
        expect(response.status).to.eq(401)
      })
    })
  
  it('Ano letivo deve ser obrigatório', () => {
      cy.dashboard_compesacoes_ausencia_consideradas_ano_vazio().then((response) => {
        expect(response.status).to.eq(500)
      })
    })

  it('DRE deve ser obrigatório', () => {
      cy.dashboard_compesacoes_ausencia_anos_turmas_dre_vazio().then((response) => {
        expect(response.status).to.eq(500)
      })
    })

  it('UE deve ser obrigatório', () => {
      cy.dashboard_compesacoes_ausencia_anos_turmas_ue_vazio().then((response) => {
        expect(response.status).to.eq(500)
      })
    })

  it('Modalidade deve ser obrigatório', () => {
      cy.dashboard_compesacoes_ausencia_anos_turmas_modalidade_vazio().then((response) => {
        expect(response.status).to.eq(500)
      })
    })
})
  