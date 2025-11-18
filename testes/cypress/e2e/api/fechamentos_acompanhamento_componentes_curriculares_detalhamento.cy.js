/// <reference types='cypress' />

describe('API - Fechamento - Detalhamento da turma através do conselho de classe, bimestre, aluno e componentes curriculares', () => {   
    it('Retorna dados através da situação do conselho de classe e alunos', () => {
      cy.buscar_fechamento_acompanhamento_por_conselho_classe_alunos().then((response) => {
        expect(response.status).to.eq(500)
      })
    })
  
    it('Não retorna dados sem usuário autenticado', () => {
      cy.nao_autorizado_fechamento_acompanhamento_por_conselho_classe_alunos().then((response) => {
        expect(response.status).to.eq(401)
      })
    })
  
    it('Não retorna dados com código da turma inválido', () => {
      cy.turma_invalido_fechamento_acompanhamento_por_conselho_classe_alunos().then((response) => {
        expect(response.status).to.eq(422)
      })
    })

    it('Não retorna dados com código do bimestre inválido', () => {
      cy.bimestre_invalido_fechamento_acompanhamento_por_conselho_classe_alunos().then((response) => {
        expect(response.status).to.eq(500)
      })
    })         
})
  