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

Quando('acesso a tela de registro de ações', function () {
  cy.acessar_registro_acoes_busca();
});

Quando('seleciono {string} no campo de turma', function (turma) {
  cy.inserir_turma_registro_acoes_busca(turma);
});

Quando('escolho o período', function () {
  cy.inserir_periodo_registro_acoes_busca();
});

Quando('meio de contato', function () {
  cy.selecionar_contato_registro_acoes_busca();
});

Entao('o sistema realiza a validação para o cenario {string}', function (cenario) {
  cy.dados_carregados_registro_acoes_busca(cenario);
});
