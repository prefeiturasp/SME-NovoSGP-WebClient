import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps';

const Dado = Given;
const Quando = When;
const Entao = Then;

Dado('que estou acessando o sistema com a visualização {string}', function (device) {
  cy.login_sgp(device);
});

Quando('digito os dados nos campos {string} e {string}', function (usuario, senha) {
  // Resolver variáveis de ambiente se a senha for uma chave
  const senhaResolvida = senha && Cypress.env(senha) ? Cypress.env(senha) : senha;
  cy.dados_de_login(usuario, senhaResolvida);
});

Quando('clico para acessar', function () {
  cy.clicar_botao();
});

Entao('devo ter acesso do perfil {string} para o cenario {string}', function (perfil) {
  cy.validar_perfil(perfil);
});
