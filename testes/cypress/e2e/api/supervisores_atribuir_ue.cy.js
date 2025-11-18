/// <reference types='cypress' />

describe('API - Atribuir supervisor responsável a UE', () => {   
  it('Realizar a atribuição do supervisor a UE', () => {
  cy.atribuir_supervisor_ue().then((response) => {
       expect(response.status).to.eq(601)       
  })
 })

  it('DRE deve ser obrigatório', () => {
    cy.atribuir_supervisor_ue_sem_dre().then((response) => {
        expect(response.status).to.eq(422)  
        expect(response.body).to.have.property('mensagens')
        expect(response.body.mensagens).to.include("A Dre deve ser informada")
        expect(response.body).to.have.property('existemErros', true)                            
    })
  })

  it('Responsável deve ser obrigatório', () => {
      cy.atribuir_supervisor_ue_sem_responsavel().then((response) => {
        expect(response.status).to.eq(422)  
        expect(response.body).to.have.property('mensagens')
        expect(response.body.mensagens).to.include("O Responsavel deve ser informado")
        expect(response.body).to.have.property('existemErros', true)                   
    })
  })

  it('UE deve ser obrigatório', () => {
      cy.atribuir_supervisor_sem_ue().then((response) => {
        expect(response.status).to.eq(601)  
        expect(response.body).to.have.property('atribuidoComSucesso', false)
        expect(response.body).to.have.property('mensagem').that.match(/erro ao atribuir responsável/i)                  
    })
  })

  it('Tipo de responsável deve ser obrigatório', () => {
    cy.atribuir_supervisor_ue_sem_tipo().then((response) => {
        expect(response.status).to.eq(422)  
        expect(response.body).to.have.property('mensagens')
        expect(response.body).to.have.property('existemErros', true)                            
    })
  })
    
  it('Não atribuir sem usuário autenticado', () => {
    cy.nao_autorizado_atribuir_supervisor_ue().then((response) => {
        expect(response.status).to.eq(401)
    })
  })       
})
  