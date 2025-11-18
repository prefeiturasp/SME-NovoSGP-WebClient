/// <reference types='cypress' />

describe('API - Lista o código e tipo de responsável', () => {    
  it('Listar todos os códigos e tipos', () => {
      cy.buscar_supervisor_tipo_responsavel().then((response) => {
        expect(response.status).to.eq(200)   
        expect(response.body[0]).to.have.property('codigo')
        expect(response.body[0]).to.have.property('descricao')                        
    })
  })
    
  it('Não retornar dados sem usuário autenticado', () => {
      cy.nao_autorizado_supervisor_tipo_responsavel().then((response) => {
        expect(response.status).to.eq(401)
    })
  })       
})
  