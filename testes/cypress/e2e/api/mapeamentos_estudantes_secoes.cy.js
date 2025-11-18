/// <reference types='cypress' />

describe('API - Mapeamentos de estudantes - Seções - ID', () => {    
    it('Retornar os dados do mapeamento do estudante', () => {      
        cy.buscar_mapeamento_estudante_id().then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body[0]).to.have.property('id')
            expect(response.body[0]).to.have.property('nome')
            expect(response.body[0]).to.have.property('concluido')
            expect(response.body[0]).to.have.property('questionarioId')
            expect(response.body[0]).to.have.property('etapa')
            expect(response.body[0]).to.have.property('nomeComponente')
            expect(response.body[0]).to.have.property('ordem')
            expect(response.body[0]).to.have.property('tipoQuestionario')
        })
    })

    it('Não acessa os dados sem autenticação', () => {
        cy.nao_autorizado_mapeamentos_estudante_id().then((response) => {
            expect(response.status).to.eq(401)  
        })
    })    
})
