/// <reference types='cypress' />

describe('API - Lista de supervisores da DRE por tipo de responsável', () => {    
  it('Realiza a busca através do supervisor da DRE e tipo 1', () => {
    cy.buscar_supervisor_id_dre_id_tipo_1().then((response) => {
        expect(response.status).to.eq(200)                                    
    })
  })

  it('Realiza a busca através do supervisor da DRE e tipo 2', () => {
    cy.buscar_supervisor_id_dre_id_tipo_2().then((response) => {
        expect(response.status).to.eq(200)                                    
    })
  })

  it('Realiza a busca através do supervisor da DRE e tipo 3', () => {
    cy.buscar_supervisor_id_dre_id_tipo_3().then((response) => {
        expect(response.status).to.eq(200)                                    
    })
  })

  it('Realiza a busca através do supervisor da DRE e tipo 4', () => {
    cy.buscar_supervisor_id_dre_id_tipo_4().then((response) => {
        expect(response.status).to.eq(200)                                    
    })
  })

  it('Realiza a busca através do supervisor da DRE e tipo 5', () => {
    cy.buscar_supervisor_id_dre_id_tipo_5().then((response) => {
        expect(response.status).to.eq(200)                                    
    })
  })

  it('Tipo deve ser obrigatório', () => {
    cy.buscar_supervisor_id_dre_id_sem_tipo().then((response) => {
        expect(response.status).to.eq(500)                                    
    })
  })

  it('DRE deve ser obrigatório', () => {
    cy.buscar_supervisor_id_dre_id_sem_dre().then((response) => {
        expect(response.status).to.eq(500)                                    
    })
  })
    
  it('Supervisor deve ser obrigatório', () => {
      cy.buscar_supervisor_id_dre_id_sem_responsavel().then((response) => {
        expect(response.status).to.eq(500)                                    
    })
  })

  it('Não retornar dados sem usuário autenticado', () => {
    cy.nao_autorizado_supervisor_id_dre_id_tipo().then((response) => {
      expect(response.status).to.eq(401)
    })
  }) 
})
    
  