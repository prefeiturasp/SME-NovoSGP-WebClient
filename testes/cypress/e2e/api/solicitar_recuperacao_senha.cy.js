/// <reference types='cypress' />

describe('API - Recuperação de senha do usuário', () => {
    it('Solicitar recuperação de senha para usuário válido', () => {
      cy.gerar_recuperacao_senha().then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.include('@')
      })
    })

    it('Não solicitar recuperação para usuário inválido', () => {
        cy.nao_gerar_recuperacao_senha().then((response) => {
            expect(response.status).to.eq(601)
            expect(response.body.existemErros).to.be.true
            expect(response.body.mensagens).to.include('"Usuário ou RF não encontrado"')
        })
    })  

    it('Usuário deve ser informado para recuperação de senha', () => {
        cy.nao_gerar_recuperacao_senha_login_vazio().then((response) => {
            expect(response.status).to.eq(500)
        })
    })  
})
  