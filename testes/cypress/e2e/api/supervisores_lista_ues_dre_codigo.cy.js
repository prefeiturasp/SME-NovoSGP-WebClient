/// <reference types='cypress' />

describe('API - Lista UEs através do código da DRE', () => {    
  it('Listar todas UEs através da DRE', () => {
    cy.buscar_supervisor_ue_dre().then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body[0]).to.have.property('id')
      expect(response.body[0]).to.have.property('codigo')
      expect(response.body[0]).to.have.property('nomeSimples')
      expect(response.body[0]).to.have.property('tipoEscola')
      expect(response.body[0]).to.have.property('nome')           
    })
  })
    
  it('Não retornar dados sem usuário autenticado', () => {
    cy.nao_autorizado_buscar_supervisor_ue_dre().then((response) => {
      expect(response.status).to.eq(401)
    })
  })    
  
  it('Código da DRE deve ser obrigatório', () => {
    cy.buscar_supervisor_ue_sem_dre().then((response) => {
      expect(response.status).to.eq(500)
    })
  })        
})
  