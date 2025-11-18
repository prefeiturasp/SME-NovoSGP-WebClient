/// <reference types='cypress' />

describe('API - Lista UEs com vínculos a DRE', () => {
  it('Listar todos os códigos e nomes das UEs', () => {
    cy.buscar_supervisor_dre_vinculo_escolas().then((response) => {
        expect(response.status).to.eq(200)   
        response.body.forEach(item => {
        expect(item).to.have.property('escolas')
        expect(item.escolas).to.be.an('array')
        item.escolas.forEach(escola => {
        expect(escola).to.have.property('codigo')
        expect(escola).to.have.property('nome')
        expect(escola.codigo).to.be.a('string').and.not.be.empty
        expect(escola.nome).to.be.a('string').and.not.be.empty
        })                      
      })
    })
  })
    
  it('Não retornar dados sem usuário autenticado', () => {
    cy.nao_autorizado_supervisor_dre_vinculo_escolas().then((response) => {
      expect(response.status).to.eq(401)
    })
  })       
})
  