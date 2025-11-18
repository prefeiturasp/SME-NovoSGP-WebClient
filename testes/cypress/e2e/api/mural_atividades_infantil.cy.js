/// <reference types='cypress' />

describe('API - Mural de atividades infantis', () => {    
    it('Retorna mural de atividades da turma', () => {
      cy.buscar_mural_atividades_infantil().then((response) => {
        expect(response.status).to.eq(200)
      })
    })
  
    it('Não retorna dados sem usuário autenticado', () => {
      cy.nao_autorizado_mural_atividades_infantil().then((response) => {
        expect(response.status).to.eq(401)
      })
    })
  
    it('Não retorna dados com código da turma inválido', () => {
      cy.mural_atividades_infantil_aula_invalida().then((response) => {
        expect(response.status).to.eq(601)
        expect(response.body).to.include({
            existemErros: true,
          })
          expect(response.body.mensagens).to.be.an('array').that.includes('É necessário informar o identificador da aula para consulta as Atividades do Infantil')
        })
    })
  })
  