/// <reference types='cypress' />

describe('API - Dados de atribuições da DRE', () => {    
  it('Retorna dados da DRE', () => {
      cy.buscar_atribuicoes_dre_ue().then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.be.an('array').and.not.be.empty
        response.body.forEach(item => {
        expect(item).to.have.all.keys(
         'codigo',
         'nomeSimples',
         'tipoEscola',
         'id',
         'nome',
         'ehInfantil'
      )
      expect(item.codigo).to.be.a('string')
      expect(item.nomeSimples).to.be.a('string')
      expect(item.tipoEscola).to.be.a('number')
      expect(item.id).to.be.a('number')
      expect(item.nome).to.be.a('string')
      expect(item.ehInfantil).to.be.a('boolean')
      })
    })
  })   
  
  it('Retorna dados da DRE no ano letivo', () => {
      cy.buscar_atribuicoes_dre_ue_ano().then((response) => {
        expect(response.status).to.eq(200)     
    })
  })    

  it('Não retorna dados sem usuário autenticado', () => {
      cy.nao_autorizado_atribuicoes_dre_ue_ano().then((response) => {
        expect(response.status).to.eq(401)
    })
  })

  it('Código da DRE deve ser obrigatório', () => {
      cy.buscar_atribuicoes_ue_ano_dre_vazio().then((response) => {
         expect(response.status).to.eq(500)
      })  
    })  
})
  