/// <reference types='cypress' />

describe('API - Fechamento - Pendências de turma e bimestre através do componentes curriculares  ', () => { 
    it('Retorna dados de pendência do componente curricular', () => {
      cy.buscar_fechamento_acompanhamento_componente_curricular_pendencia().then((response) => {
        expect(response.status).to.eq(200)        
      })
    })
  
    it('Não retorna dados sem usuário autenticado', () => {
      cy.nao_autorizado_fechamento_acompanhamento_componente_curricular_pendencia().then((response) => {
        expect(response.status).to.eq(401)
      })
    })       
})
  