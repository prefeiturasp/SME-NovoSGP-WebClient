/// <reference types='cypress' />

describe('API - Fechamento - Acompanhamento de turmas, conselho de classe e bimestre', () => { 
    it('Retorna dados através da situação do conselho de classe', () => {
      cy.buscar_fechamento_acompanhamento_conselho_classe().then((response) => {
        expect(response.status).to.eq(601)
      })
    })
  
    it('Não retorna dados sem usuário autenticado', () => {
      cy.nao_autorizado_buscar_fechamento_acompanhamento_conselho_classe().then((response) => {
        expect(response.status).to.eq(401)
      })
    })
  
    it('Não retorna dados com código da turma inválido', () => {
      cy.turma_invalido_buscar_fechamento_acompanhamento_conselho_classe().then((response) => {
        expect(response.status).to.eq(422)
      })
    })

    it('Não retorna dados com código do bimestre inválido', () => {
      cy.bimestre_invalido_buscar_fechamento_acompanhamento_conselho_classe().then((response) => {
        expect(response.status).to.eq(601)
      })
    })

    it('Não retorna dados com conselho de classe inválido', () => {
      cy.conselho_classe_invalido_buscar_fechamento_acompanhamento_conselho_classe().then((response) => {
        expect(response.status).to.eq(422)
      })
    })
})
  