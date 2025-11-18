/// <reference types='cypress' />

describe('API - Fechamento - Acompanhamento por turmas e bimestre', () => {   
    it('Retorna dados da turma no bimestre', () => {
      cy.buscar_fechamento_acompanhamento_turma_bimestre().then((response) => {
        expect(response.status).to.eq(200)
      })
    })
  
    it('Não retorna dados sem usuário autenticado', () => {
      cy.nao_autorizado_buscar_fechamento_acompanhamento_turma_bimestre().then((response) => {
        expect(response.status).to.eq(401)
      })
    })   
})
  