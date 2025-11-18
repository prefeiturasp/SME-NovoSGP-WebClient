/// <reference types='cypress' />

describe('API - Fechamento - Acompanhamento por turmas', () => {   
    it('Retorna dados da turma no bimestre', () => {
      cy.buscar_fechamento_acompanhamento_por_turmas().then((response) => {
        expect(response.status).to.eq(601)
      })
    })
  
    it('Não retorna dados sem usuário autenticado', () => {
      cy.nao_autorizado_fechamento_acompanhamento_por_turmas().then((response) => {
        expect(response.status).to.eq(401)
      })
    })
  
    it('Não retorna dados com código da turma inválido', () => {
      cy.nao_buscar_fechamento_acompanhamento_por_turmas().then((response) => {
        expect(response.status).to.eq(500)
      })
   })
})
  