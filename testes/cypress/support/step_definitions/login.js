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

Entao(
  'o sistema realiza validacao necessaria {string} para o cenario {string}',
  function (mensagem) {
    cy.validar_mensagem(mensagem);
  },
);
