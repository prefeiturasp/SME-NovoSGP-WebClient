/// <reference types='cypress' />

describe('API - Dashboard compensações de ausência por ano e turma', () => {      
    it('Retorna dados do ano e turma', () => {
      cy.buscar_dashboard_compesacoes_ausencia_anos_turmas().then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.all.keys(
        'tagTotalCompensacaoAusencia',
        'dadosCompensacaoAusenciaDashboard'
      )
      })
    })
  
    it('Não retorna dados sem usuário autenticado', () => {
      cy.nao_autorizado_dashboard_compesacoes_ausencia_anos_turmas().then((response) => {
        expect(response.status).to.eq(401)
      })
    })
  
    it('Ano letivo deve ser obrigatório', () => {
      cy.dashboard_compesacoes_ausencia_anos_turmas_ano_vazio().then((response) => {
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
  