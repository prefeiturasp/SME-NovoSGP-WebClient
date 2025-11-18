/// <reference types='cypress' />

describe('API - Lista de supervisores da DRE', () => {    
  it('Realiza a busca através do código da DRE', () => {
    cy.buscar_supervisor_dre().then((response) => {
      expect(response.status).to.eq(200)                                    
    })
  })
    
  it('Não retornar dados sem usuário autenticado', () => {
    cy.nao_autorizado_buscar_supervisor_dre().then((response) => {
      expect(response.status).to.eq(401)
    })
  })  
    
  it('Realiza a busca através do código da DRE e tipo de responsável 1', () => {
    cy.buscar_supervisor_dre_tipo_1().then((response) => {
      expect(response.status).to.eq(200) 
      expect(response.body[0]).to.have.property('supervisorNome')
      expect(response.body[0]).to.have.property('supervisorId')                                     
    })
  })

  it('Realiza a busca através do código da DRE e tipo de responsável 2', () => {
    cy.buscar_supervisor_dre_tipo_2().then((response) => {
      expect(response.status).to.eq(200) 
      expect(response.body[0]).to.have.property('supervisorNome')
      expect(response.body[0]).to.have.property('supervisorId')                                     
    })
  })

  it('Realiza a busca através do código da DRE e tipo de responsável 3', () => {
    cy.buscar_supervisor_dre_tipo_3().then((response) => {
      expect(response.status).to.eq(200) 
      expect(response.body[0]).to.have.property('supervisorNome')
      expect(response.body[0]).to.have.property('supervisorId')                                     
    })
  })

  it('Realiza a busca através do código da DRE e tipo de responsável 4', () => {
    cy.buscar_supervisor_dre_tipo_4().then((response) => {
      expect(response.status).to.eq(200) 
      expect(response.body[0]).to.have.property('supervisorNome')
      expect(response.body[0]).to.have.property('supervisorId')                                     
    })
  })

  it('Realiza a busca através do código da DRE e tipo de responsável 5', () => {
    cy.buscar_supervisor_dre_tipo_5().then((response) => {
      expect(response.status).to.eq(200) 
      expect(response.body[0]).to.have.property('supervisorNome')
      expect(response.body[0]).to.have.property('supervisorId')                                     
    })
  })
})
  