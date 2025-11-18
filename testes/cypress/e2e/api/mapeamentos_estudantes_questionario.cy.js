/// <reference types='cypress' />

describe('API - Mapeamentos de estudantes - Questionários - ID', () => {
    it('Retorna os dados referente ao ID do questionário', () => {
        cy.buscar_mapeamento_estudante_questionario_id().then((response) => {
            expect(response.status).to.eq(601)
            expect(response.body).to.not.be.empty
        })
    })

    it('Não acessa os dados sem autenticação', () => {
        cy.nao_autorizado_mapeamentos_questionario_id().then((response) => {
            expect(response.status).to.eq(401)
        })
    })
})
