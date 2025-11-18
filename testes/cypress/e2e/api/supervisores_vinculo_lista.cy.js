/// <reference types='cypress' />

describe('API - Lista de vínculo de supervisores', () => {    
  it('Listar os vínculos através da DRE', () => {
    cy.buscar_supervisor_dre_lista_vinculo_responsavel().then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body[0]).to.have.property('escolas')
        expect(response.body[0]).to.have.property('responsavelId')
        expect(response.body[0]).to.have.property('responsavel')
        expect(response.body[0]).to.have.property('tipoResponsavel')
        expect(response.body[0]).to.have.property('tipoResponsavelId')
        expect(response.body[0]).to.have.property('ueNome')
        expect(response.body[0]).to.have.property('ueId')
        expect(response.body[0]).to.have.property('dreNome')
        expect(response.body[0]).to.have.property('dreId')
        expect(response.body[0]).to.have.property('id')
        expect(response.body[0]).to.have.property('alteradoEm')
        expect(response.body[0]).to.have.property('alteradoPor')
        expect(response.body[0]).to.have.property('alteradoRF')
        expect(response.body[0]).to.have.property('criadoEm')
        expect(response.body[0]).to.have.property('criadoPor')
        expect(response.body[0]).to.have.property('criadoRF')        
    })
  })

  it('Listar os vínculos através da DRE e UE', () => {
    cy.buscar_supervisor_dre_ue_lista_vinculo_responsavel().then((response) => {
        expect(response.status).to.eq(200)    
        expect(response.body[0]).to.have.property('escolas')
        expect(response.body[0]).to.have.property('responsavelId')
        expect(response.body[0]).to.have.property('responsavel')
        expect(response.body[0]).to.have.property('tipoResponsavel')
        expect(response.body[0]).to.have.property('tipoResponsavelId')
        expect(response.body[0]).to.have.property('ueNome')
        expect(response.body[0]).to.have.property('ueId')
        expect(response.body[0]).to.have.property('dreNome')
        expect(response.body[0]).to.have.property('dreId')
        expect(response.body[0]).to.have.property('id')
        expect(response.body[0]).to.have.property('alteradoEm')
        expect(response.body[0]).to.have.property('alteradoPor')
        expect(response.body[0]).to.have.property('alteradoRF')
        expect(response.body[0]).to.have.property('criadoEm')
        expect(response.body[0]).to.have.property('criadoPor')
        expect(response.body[0]).to.have.property('criadoRF')   
    })
  })

  it('Listar os vínculos através da DRE, UE e supervisor', () => {
    cy.buscar_supervisor_dre_ue_responsavel_lista_vinculo().then((response) => {
        expect(response.status).to.eq(200)        
    })
  })
  
  it('Não retornar dados sem usuário autenticado', () => {
    cy.nao_autorizado_buscar_supervisor_lista_vinculo_responsavel().then((response) => {
        expect(response.status).to.eq(401)
    })
  })

  it('UE não deve ter supervisor responsável', () => {
    cy.buscar_supervisor_dre_ue_lista_vinculo_sem_responsavel().then((response) => {
        expect(response.status).to.eq(200)
    })
  })
  
  it('Código da DRE deve ser obrigatório', () => {
    cy.buscar_supervisor_sem_dre_ue_lista_vinculo().then((response) => {
        expect(response.status).to.eq(601)
    })
  })        
})
  