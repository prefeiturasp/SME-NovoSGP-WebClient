import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

const Dado = Given
const Quando = When
const Entao = Then

Dado('que eu acesso o sistema com a visualização {string}', function (device) {
    cy.login_sgp(device)
})

Quando('informo os dados nos campos {string} e {string}', function (usuario, senha) {
    cy.dados_de_login(usuario, senha)
})

Quando('clico no botão de acessar', function () {
    cy.clicar_botao()
})

Quando('acesso a tela de consulta de ausentes', function () {
    cy.acessar_consulta_ausencias()
})

Quando('seleciono as ausências {string}', function (ausencia) {
    cy.inserir_ausencias(ausencia)    
})

Entao('realiza a validação para o cenário {string}', function (cenario) {  
    cy.dados_carregados_ausentes(cenario)  
})
