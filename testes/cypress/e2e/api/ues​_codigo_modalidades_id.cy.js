/// <reference types='cypress' />

describe('API - Modalidades na UE através do ID no ano letivo', () => {    
    it('Retorna dados da modalidade no ano letivo', () => {
      cy.buscar_modalidade_ano_letivo_ue().then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array').and.not.be.empty
        response.body.forEach(item => {
         expect(item).to.have.all.keys('codigo', 'nome')
         expect(item.codigo).to.be.a('string').and.not.be.empty
         expect(item.nome).to.be.a('string').and.not.be.empty
        })
      })
    })

    it('Retorna dados das modalidades da UE no ano letivo', () => {
      cy.buscar_dados_modalide_ue().then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array').and.not.be.empty
        response.body.forEach(item => {
         expect(item).to.have.all.keys('id', 'nome')
         expect(item.id).to.be.a('number')
         expect(item.nome).to.be.a('string').and.not.be.empty
        })
      })
    })    

    it('Não retorna dados sem usuário autenticado', () => {
      cy.nao_autorizado_modalidade_ano_letivo_ue().then((response) => {
        expect(response.status).to.eq(401)
      })
    })

    it('UE deve ser obrigatório', () => {
      cy.buscar_dados_modalide_ue_vazio().then((response) => {
         expect(response.status).to.eq(500)
        })  
    })  

    it('Ano letivo deve ser obrigatório', () => {
      cy.buscar_dados_modalide_ano_vazio().then((response) => {
         expect(response.status).to.eq(422)
         expect(response.body).to.have.property('existemErros', true)
         expect(response.body.mensagens).to.be.an('array').that.includes("The value '' is invalid.")
    
        })  
    }) 
})
  