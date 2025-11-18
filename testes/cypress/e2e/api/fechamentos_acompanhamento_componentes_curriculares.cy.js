/// <reference types='cypress' />

describe('API - Fechamento - Acompanhamento da turma, aluno e componentes curriculares e situação do fechamento', () => {   
    it('Retorna dados através da situação do fechamento, turma e bimestre', () => {
      cy.buscar_fechamento_acompanhamento_fechamento_turma_bimestre().then((response) => {
        expect(response.status).to.eq(500)        
      })
    })
  
    it('Não retorna dados sem usuário autenticado', () => {
      cy.nao_autorizado_fechamento_acompanhamento_fechamento_turma_bimestre().then((response) => {
        expect(response.status).to.eq(401)
      })
    })
  
    it('Não retorna dados com código da turma inválido', () => {
      cy.turma_invalido_fechamento_acompanhamento_fechamento_turma_bimestre().then((response) => {
        expect(response.status).to.eq(422)
      })
    })    
})
  