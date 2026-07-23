import { Given, When, Then, Before, And } from 'cypress-cucumber-preprocessor/steps';

let token;
let token_invalido;

Before(() => {
  cy.gerar_token().then((token_valido) => {
    token = token_valido;
  });
});

Given('que possuo um token de acesso válido', function () {
  expect(token, 'valido').to.exist;
});

Given('que possuo um token de acesso inválido', function () {
  token_invalido = 'sdjlaskjdasjdlasjdljasdljasldjasldjasldj';
});

And('vou autenticar no Sondagem', function () {});

When(
  'envio a requisição POST com credenciais válidas para o endpoint de autenticação do Sondagem',
  function () {
    return cy
      .request({
        method: 'POST',
        url: `${Cypress.config('baseUrlSondagem')}/api/Autenticacao`,
        body: `"${token}"`,
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        failOnStatusCode: false,
      })
      .as('response');
  },
);

Then('realiza o acesso com sucesso ao Sondagem', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body).to.exist;
  });
});

// Não autorizar acesso com usuário inválido
When(
  'envio a requisição POST com credenciais inválidas para o endpoint de autenticação do Sondagem',
  function () {
    return cy
      .request({
        method: 'POST',
        url: `${Cypress.config('baseUrlSondagem')}/api/Autenticacao`,
        body: `"${token_invalido}"`,
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        failOnStatusCode: false,
      })
      .as('response');
  },
);

Then('não autoriza acesso ao Sondagem', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401);
    expect(response.statusText).to.eq('Unauthorized');
    expect(response.body).to.exist;
  });
});
