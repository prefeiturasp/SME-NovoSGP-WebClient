Cypress.Commands.add('autenticar_login', (usuario, senha) => {
  cy.request({
    method: 'POST',
    url: Cypress.config('baseUrl') + '/api/v1/autenticacao',
    body: {
      login: usuario,
      senha: senha,
    },
    timeout: 60000,
    failOnStatusCode: false,
  }).then((responseUserToken) => {
    globalThis.token = responseUserToken.allRequestResponses[0]['Response Body'].access;
  });
});

Cypress.Commands.add('gerar_token', () => {
  const tokenExistente = Cypress.env('TOKEN');

  if (tokenExistente) {
    return tokenExistente;
  }

  return cy
    .request({
      method: 'POST',
      url: Cypress.config('baseUrl') + '/api/v1/autenticacao',
      body: {
        login: Cypress.env('LOGIN_ADM_COTIC'),
        senha: Cypress.env('SENHA'),
      },
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      timeout: 60000,
      failOnStatusCode: false,
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error(`Authentication failed with status: ${response.status}`);
      }

      const token = response.body.token;
      Cypress.env('TOKEN', token);
      return token;
    });
});

Cypress.Commands.add('gerar_token_cp', () => {
  const tokenExistente = Cypress.env('TOKEN_CP');

  if (tokenExistente) {
    return tokenExistente;
  }

  return cy
    .request({
      method: 'POST',
      url: Cypress.config('baseUrl') + '/api/v1/autenticacao',
      body: {
        login: Cypress.env('LOGIN_CP'),
        senha: Cypress.env('SENHA'),
      },
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      timeout: 60000,
      failOnStatusCode: false,
    })
    .then((response) => {
      if (response.status !== 200) {
        throw new Error(`Authentication failed with status: ${response.status}`);
      }

      const token = response.body.token;
      Cypress.env('TOKEN_CP', token);
      return token;
    });
});

Cypress.Commands.add('gerar_senha', () => {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';
  let senha = '';
  for (let i = 0; i < 10; i++) {
    senha += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return senha;
});

Cypress.Commands.add('gerar_recuperacao_senha', () => {
  return cy.gerar_token().then((token) => {
    return cy.request({
      method: 'POST',
      url:
        Cypress.config('baseUrl') +
        `/api/v1/autenticacao/solicitar-recuperacao-senha?login=${Cypress.env('LOGIN_PRIMEIRO_ACESSO')}`,
      headers: {
        accept: 'text/plain',
        Authorization: `Bearer ${token}`,
      },
      failOnStatusCode: false,
    });
  });
});
