import { Given, When, Then, Before, And } from 'cypress-cucumber-preprocessor/steps';

let token;

Before(() => {
  cy.gerar_token().then((token_valido) => {
    token = token_valido;
  });
});

// GIVEN

Given('que possuo um token de acesso válido', function () {
  expect(token, 'valido').to.exist;
});

Given('que não possuo um token de acesso válido', function () {
  expect(token, 'valido').to.not.exist;
});

// WHEN

When('envio uma requisição GET para o endpoint de boletim com id da turma existente', function () {
  cy.request({
    method: 'GET',
    url: '/api/v1/boletim/alunos?turmaCodigo=' + Cypress.env('TURMA_CODIGO'),
    headers: {
      Authorization: `Bearer ${token}`,
    },
    failOnStatusCode: false,
  }).as('response');
});

When(
  'envio uma requisição GET para o endpoint de boletim com id da turma inexistente',
  function () {
    cy.request({
      method: 'GET',
      url: '/api/v1/boletim/alunos?turmaCodigo=' + Cypress.env('TURMA_CODIGO_INVALIDO'),
      headers: {
        Authorization: `Bearer ${token}`,
      },
      failOnStatusCode: false,
    }).as('response');
  },
);
When('envio uma requisição GET para o endpoint sem id da turma', function () {
  cy.request({
    method: 'GET',
    url: '/api/v1/boletim/alunos?turmaCodigo=',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    failOnStatusCode: false,
  }).as('response');
});

When('Não retorna o boletim sem autenticação', function () {
  cy.request({
    method: 'GET',
    url: '/api/v1/boletim/alunos?turmaCodigo=' + Cypress.env('TURMA_CODIGO'),
    failOnStatusCode: false,
  }).as('response');
});

When(
  'envio uma requisição GET para o endpoint de boletim por turma de alunos observações com id da turma existente',
  function () {
    cy.request({
      method: 'GET',
      url: '/api/v1/boletim/alunos-obsevacoes?turmaCodigo=' + Cypress.env('TURMA_CODIGO'),
      headers: {
        Authorization: `Bearer ${token}`,
      },
      failOnStatusCode: false,
    }).as('response');
  },
);

When(
  'envio uma requisição GET para o endpoint de boletim por turma de alunos observações com id da turma inexistente',
  function () {
    cy.request({
      method: 'GET',
      url: '/api/v1/boletim/alunos-obsevacoes?turmaCodigo=' + Cypress.env('TURMA_CODIGO_INVALIDO'),
      headers: {
        Authorization: `Bearer ${token}`,
      },
      failOnStatusCode: false,
    }).as('response');
  },
);

When('envio uma requisição GET para o endpoint alunos observações sem id da turma', function () {
  cy.request({
    method: 'GET',
    url: '/api/v1/boletim/alunos-obsevacoes?turmaCodigo=',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    failOnStatusCode: false,
  }).as('response');
});

When(
  'envio uma requisição GET para o endpoint alunos observações sem token de acesso',
  function () {
    cy.request({
      method: 'GET',
      url: '/api/v1/boletim/alunos-obsevacoes?turmaCodigo=' + Cypress.env('TURMA_CODIGO'),
      failOnStatusCode: false,
    }).as('response');
  },
);

// THEN

Then('retorna sucesso com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200);
  });
});

Then('retorna o status 601', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601);
  });
});

Then('retorna o status 401 de acesso não autorizado', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401);
  });
});

// AND

And('as informações do boletim dos alunos da turma', function () {
  cy.get('@response').then((response) => {
    expect(response.body).to.have.property('items');
    expect(response.body.items).to.be.an('array');
    expect(response.body.items[0]).to.have.property('codigo');
    expect(response.body.items[0]).to.have.property('numeroChamada');
    expect(response.body.items[0]).to.have.property('nome');
    expect(response.body.items[0]).to.have.property('codigoTurma');
    expect(response.body.items[0]).to.have.property('turmaId');
    expect(response.body.items[0]).to.have.property('nomeComModalidadeTurma');
    expect(response.body.items[0]).to.have.property('modalidadeCodigo');
    expect(response.body.items[0]).to.have.property('semestre');
    expect(response.body).to.have.property('totalPaginas');
    expect(response.body).to.have.property('totalRegistros');
  });
});

And('as informações do boletim dos alunos observações da turma', function () {
  cy.get('@response').then((response) => {
    expect(response.body).to.have.property('items');
    expect(response.body.items).to.be.an('array');
    expect(response.body.items[0]).to.have.property('codigo');
    expect(response.body.items[0]).to.have.property('numeroChamada');
    expect(response.body.items[0]).to.have.property('nome');
    expect(response.body.items[0]).to.have.property('observacao');
    expect(response.body).to.have.property('totalPaginas');
    expect(response.body).to.have.property('totalRegistros');
  });
});

And('as informações do boletim dos alunos da turma vazias', function () {
  cy.get('@response').then((response) => {
    expect(response.body).to.have.property('items');
    expect(response.body.items).to.be.an('array');
    expect(response.body.items).to.be.empty;
    expect(response.body).to.have.property('totalPaginas');
    expect(response.body).to.have.property('totalRegistros');
  });
});

And('a mensagem de ID é obrigatório', function () {
  cy.get('@response').then((response) => {
    expect(response.body).to.have.property('mensagens');
    expect(response.body.mensagens[0]).to.eq('Os Códigos dos Alunos devem ser informados.');
  });
});

And('a mensagem de ID da turma é obrigatório', function () {
  cy.get('@response').then((response) => {
    expect(response.body).to.have.property('mensagens');
    expect(response.body.mensagens[0]).to.eq('O código da turma deve ser informado.');
  });
});
