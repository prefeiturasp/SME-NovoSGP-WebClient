/// <reference types='cypress' />

describe('API - Dashboard de acompanhamento aprendizagem por aluno', () => {    
    it('Retornar dashboard de acompanhamento do aluno', () => {
      cy.buscar_dashboard_acompanhamento_aluno().then((response) => {
        expect(response.status).to.eq(200)
      })
    })
  
    it('Não retorna dados sem usuário autenticado', () => {
      cy.nao_autorizado_dashboard_acompanhamento_aluno().then((response) => {
        expect(response.status).to.eq(401)
      })
    })
  
    it('Ano letivo deve ser informado', () => {
      cy.dashboard_acompanhamento_aluno_ano_vazio().then((response) => {
        expect(response.status).to.eq(422)
      })
    })

    it('Semestre deve ser informado', () => {
      cy.dashboard_acompanhamento_aluno_semestre_vazio().then((response) => {
        expect(response.status).to.eq(422)
      })
    })
})
  