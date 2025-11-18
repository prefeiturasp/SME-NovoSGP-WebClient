import Login_SGP_Localizadores from '../locators/login_locators'

const loginLocalizadores = new Login_SGP_Localizadores()

Cypress.Commands.add('login_sgp', (device) => {
    cy.configurar_visualizacao(device)
    cy.visit('/')
})

Cypress.Commands.add('dados_de_login', (usuario, senha) => {
    if (usuario) cy.get(loginLocalizadores.campo_usuario()).type(usuario)
    if (senha) cy.get(loginLocalizadores.campo_senha()).type(senha)
})

Cypress.Commands.add('clicar_botao', () => {
    if (Cypress.$('#usuario').val().trim() !== "" && Cypress.$('#senha').val().trim() !== "") {
        cy.intercept('POST', '/api/v1/autenticacao').as('loginRequest')
    }
    cy.get(loginLocalizadores.botao_acessar())
        .should('be.visible')     
        .click()
})

Cypress.Commands.add('validar_mensagem', (mensagem) => {
    const usuario = Cypress.$('#usuario').val() || ''
    const senha = Cypress.$('#senha').val() || ''
    
    if (usuario.trim() !== "" && senha.trim() !== "") {
        if (usuario.length < 5) {
            cy.get(loginLocalizadores.mensagem_erro_usuario_senha()).should('be.visible').and('contain', 'O usuário deve conter no mínimo 5 caracteres.')
        } else if (senha.length < 4) {
            cy.get(loginLocalizadores.mensagem_erro_usuario_senha()).should('be.visible').and('contain', 'A senha deve conter no mínimo 4 caracteres.')
        } else {
            cy.wait('@loginRequest', { timeout: 60000 }).then((interception) => {
                const statusCodes = [200, 401, 422]
                expect(statusCodes).to.include(interception.response.statusCode)
            })
        }
    } else {
        if (mensagem === 'Usuário e/ou senha inválida') {
            cy.get(loginLocalizadores.mensagem_erro()).contains(mensagem)
        } else if (mensagem === 'Você precisa informar um usuário e senha para acessar o sistema.') {
            cy.get(loginLocalizadores.logo_sgp_login()).click()
            cy.get(loginLocalizadores.mensagem_erro_campo_em_branco()).contains(mensagem)
        } else {
            cy.get(loginLocalizadores.mensagem())
                .should('be.visible')
                .and('contain', mensagem)
        }
    }
})

Cypress.Commands.add('validar_perfil', (perfil) => {
    cy.get(loginLocalizadores.botao_perfil(), { timeout: 60000 }).should('be.visible')
    cy.contains(loginLocalizadores.botao_perfil(), perfil).should('be.visible')
})

Cypress.Commands.add('carregandoMenus', () => {
    const apiUrl = Cypress.config('baseUrl') + '/api/v1/menus'
    
    cy.intercept('GET', apiUrl).as('menus')
    cy.wait('@menus', { timeout: 60000 }).its('response.statusCode').should('eq', 200)
})
  