/// <reference types='cypress' />

describe('API - Autenticação do acesso de usuário', () => {
    it('Permitir realizar login com credenciais válidas', () => {
        const usuarioValido = Cypress.env('LOGIN_ADM_COTIC')
        const senhaValida = Cypress.env('SENHA')

        cy.autenticar_login(usuarioValido, senhaValida).then((response) => {
            cy.log(JSON.stringify(response.body))
            expect(response.status).to.eq(200)
            expect(response.statusText).to.eq('OK')
            expect(response.body).to.exist
        })
    })

    it('Não autorizar acesso com usuário inválido', () => {
        const usuarioInValido = Cypress.env('USUARIO_INVALIDO')
        const senhaValida = Cypress.env('SENHA')

        cy.autenticar_login(usuarioInValido, senhaValida).then((response) => {
            cy.log(JSON.stringify(response.body))
            expect(response.status).to.eq(401)
            expect(response.statusText).to.eq('Unauthorized')
            expect(response.body).to.exist
        })
    })

    it('Não autorizar acesso com senha inválida', () => {
        const usuarioValido = Cypress.env('LOGIN_ADM_COTIC')
        const senhaInValida = Cypress.env('SENHA_INVALIDA')

        cy.autenticar_login(usuarioValido, senhaInValida).then((response) => {
            cy.log(JSON.stringify(response.body))
            expect(response.status).to.eq(401)
            expect(response.statusText).to.eq('Unauthorized')
            expect(response.body).to.exist
        })
    })

    it('Não autorizar acesso com usuário inexistente', () => {
        const usuarioInexistente = Cypress.env('USUARIO_INEXISTENTE')
        const senhaInValida = Cypress.env('SENHA_INVALIDA')

        cy.autenticar_login(usuarioInexistente, senhaInValida).then((response) => {
            cy.log(JSON.stringify(response.body))
            expect(response.status).to.eq(401)
            expect(response.statusText).to.eq('Unauthorized')
            expect(response.body).to.exist
        })
    })

    it('Usuário deve ser inserido para acesso', () => {
        const usuarioBranco = ' ' 
        const senhaInValida = Cypress.env('SENHA_INVALIDA')

        cy.autenticar_login(usuarioBranco, senhaInValida).then((response) => {
            cy.log(JSON.stringify(response.body))
            expect(response.status).to.eq(422)
            expect(response.statusText).to.eq('Unprocessable Entity')
            expect(response.body).to.exist
        })
    })

    it('Não permitir acesso sem inserir a senha', () => {
        const usuarioValido = Cypress.env('LOGIN_ADM_COTIC')
        const senhaBranco = ' '

        cy.autenticar_login(usuarioValido, senhaBranco).then((response) => {
            cy.log(JSON.stringify(response.body))
            expect(response.status).to.eq(422)
            expect(response.statusText).to.eq('Unprocessable Entity')
            expect(response.body).to.exist
        })
    })
})
