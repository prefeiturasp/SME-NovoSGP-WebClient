import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

const Dado = Given;
const Quando = When;
const Entao = Then;

Dado('que eu acesso o sistema com a visualização {string}', function (device) {
  cy.login_sgp(device);
});

Quando('informo os dados nos campos {string} e {string}', function (usuario, senha) {
  // Resolver variáveis de ambiente se a senha for uma chave
  const senhaResolvida = senha && Cypress.env(senha) ? Cypress.env(senha) : senha;
  cy.dados_de_login(usuario, senhaResolvida);
});

Quando('clico no botão de acessar', function () {
  cy.clicar_botao();
});

Quando('acesso a tela de busca ativa', function () {
  cy.acessar_busca_ativa();
});

Quando('seleciono {string} no campo de turma', function (turmas) {
  cy.inserir_turmas_busca_ativa(turmas);
});

Quando('gero o relatório', function () {
  cy.gerar_relatorio_busca_ativa();
});

Entao('o sistema confirma o relatório para o cenario {string}', function (cenario) {
  cy.validar_gerar_relatorio_busca_ativa();
});
