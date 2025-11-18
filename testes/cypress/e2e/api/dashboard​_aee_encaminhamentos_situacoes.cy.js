/// <reference types='cypress' />

describe('API - Dashboard AEE de encaminhamentos situações', () => {    
    it('Retorna dados AEE das situações', () => {
      cy.buscar_dashboard_aee_encaminhamentos_situacoes().then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.all.keys(
            'qtdeEncaminhamentosSituacao',
            'totalEncaminhamentosAnalise',
            'situacoesEncaminhamentoAEE'
          )
          expect(response.body.qtdeEncaminhamentosSituacao).to.be.a('number')
          expect(response.body.totalEncaminhamentosAnalise).to.be.a('number')
          expect(response.body.situacoesEncaminhamentoAEE).to.be.an('array')
         })
    })
  
    it('Não retorna dados sem usuário autenticado', () => {
      cy.nao_autorizado_dashboard_aee_encaminhamentos_situacoes().then((response) => {
        expect(response.status).to.eq(401)
      })
    })
  
    it('Ano letivo deve ser obrigatório', () => {
      cy.dashboard_aee_encaminhamentos_situacoes_ano_vazio().then((response) => {
        expect(response.status).to.eq(422)
      })
    })

    it('DRE deve ser obrigatório', () => {
        cy.dashboard_aee_encaminhamentos_situacoes_dre_vazio().then((response) => {
          expect(response.status).to.eq(422)
        })
    })

    it('UE deve ser obrigatório', () => {
        cy.dashboard_aee_encaminhamentos_situacoes_ue_vazio().then((response) => {
          expect(response.status).to.eq(422)
        })
    })
})
  