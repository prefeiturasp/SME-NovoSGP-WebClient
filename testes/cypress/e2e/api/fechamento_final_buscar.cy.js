/// <reference types='cypress' />

describe('API - Buscar o fechamento final através da disciplina, turma e semestre', () => {  
    it('Necessário realizar o fechamento do bimestre', () => {
      cy.buscar_fechamento_final_bimestre_aberto().then((response) => {
        expect(response.status).to.eq(601)
        expect(response.body).to.include({
          existemErros: true,
        })
      })
    })
  
    it('Não retornar dados sem usuário autenticado', () => {
      cy.nao_autorizado_buscar_fechamento_final().then((response) => {
        expect(response.status).to.eq(401)
      })
    })
  
    it('Não retornar dados com código da turma inválido', () => {
      cy.buscar_fechamento_final_turma_invalida().then((response) => {
        expect(response.status).to.eq(601)
      })
   })
})
  