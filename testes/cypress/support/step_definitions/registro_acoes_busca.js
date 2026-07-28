import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

const Dado = Given
const Quando = When
const Entao = Then

Dado('que eu acesso o sistema com a visualização {string} para registro de ações', function (device) {
    cy.login_sgp(device)
})

Quando('informo os dados nos campos {string} e {string} para registro de ações', function (usuario, senha) {
    cy.dados_de_login(usuario, senha)
})

Quando('clico no botão de acessar para registro de ações', function () {
    cy.clicar_botao()
})

Quando('acesso a tela de registro de ações', function () {
    cy.acessar_registro_acoes_busca()
})

Quando('seleciono {string} no campo de turma do registro de ações', function (turma) {
    cy.inserir_turma_registro_acoes_busca(turma)
})

Quando('escolho o período', function () {
    cy.inserir_periodo_registro_acoes_busca()
})

Quando('meio de contato', function () {
    cy.selecionar_contato_registro_acoes_busca()
})
  
Entao('o sistema realiza a validação para o cenario {string}', function (cenario) {
    cy.dados_carregados_registro_acoes_busca(cenario)
})