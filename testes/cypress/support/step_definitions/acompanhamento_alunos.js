import { Given, When, Then, Before } from 'cypress-cucumber-preprocessor/steps';

let token;

Before(() => {
  cy.gerar_token().then((token_valido) => {
    token = token_valido;
  });
});

Given('que possuo um token de acesso válido', function () {
  expect(token, 'valido').to.exist;
});

Given('que não possuo um token de acesso válido', function () {
  expect(token, 'valido').to.not.exist;
});

// Retorna a quantidade de alunos acompanhados
When('envio uma requisição GET para o endpoint de acompanhamento de alunos', function () {
  cy.request({
    method: 'GET',
    url:
      Cypress.config('baseUrl') +
      `/api/v1/acompanhamento/alunos?turmaId=${Cypress.env('TURMA_CODIGO_APANHADO_GERAL')}&alunoId=${Cypress.env('ALUNO_ID')}&semestre=${Cypress.env('SEMESTRE_CODIGO')}&componenteCurricularId=${Cypress.env('COMPONENTE_CURRICULAR_CODIGO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`,
    },
    failOnStatusCode: false,
  }).as('response');
});

Then('retorna os acompanhamentos dos alunos com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body).to.have.property('acompanhamentoAlunoId');
    expect(response.body).to.have.property('acompanhamentoAlunoSemestreId');
    expect(response.body).to.have.property('observacoes');
    expect(response.body).to.have.property('percursoIndividual');
    expect(response.body).to.have.property('quantidadeFotos');
    expect(response.body).to.have.property('periodoInicio');
    expect(response.body).to.have.property('periodoFim');
    expect(response.body).to.have.property('podeEditar');
    expect(response.body).to.have.property('textoSugerido');
    expect(response.body).to.have.property('auditoria');
  });
});

When('envio uma requisição GET para o endpoint com id da turma inexistente', function () {
  cy.request({
    method: 'GET',
    url:
      Cypress.config('baseUrl') +
      `/api/v1/acompanhamento/alunos?turmaId=0&alunoId=${Cypress.env('ALUNO_ID')}&semestre=${Cypress.env('SEMESTRE_CODIGO')}&componenteCurricularId=${Cypress.env('COMPONENTE_CURRICULAR_CODIGO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`,
    },
    failOnStatusCode: false,
  }).as('response');
});

Then('retorna o status 601 que o Id da turma deve ser informado', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601);
    expect(response.body).to.have.property('mensagens');
    expect(response.body.mensagens[0]).to.eq('O Id da turma deve ser informado.');
  });
});

When(
  'envio uma requisição GET para o endpoint com id do componente curricular inexistente',
  function () {
    cy.request({
      method: 'GET',
      url:
        Cypress.config('baseUrl') +
        `/api/v1/acompanhamento/alunos?turmaId=${Cypress.env('TURMA_CODIGO_APANHADO_GERAL')}&alunoId=${Cypress.env('ALUNO_ID')}&semestre=${Cypress.env('SEMESTRE_CODIGO')}&componenteCurricularId=0`,
      headers: {
        accept: 'text/plain',
        Authorization: `Bearer ${token}`,
      },
      failOnStatusCode: false,
    }).as('response');
  },
);

Then('retorna o status 601 que o Id do componente curricular deve ser informado', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601);
    expect(response.body).to.have.property('mensagens');
    expect(response.body.mensagens[0]).to.eq(
      'O Código do Componente Curricular deve ser informado para consulta de Registros Individuais do Estudante',
    );
  });
});

When('envio uma requisição GET para o endpoint com id do aluno inexistente', function () {
  cy.request({
    method: 'GET',
    url:
      Cypress.config('baseUrl') +
      `/api/v1/acompanhamento/alunos?turmaId=${Cypress.env('TURMA_CODIGO_APANHADO_GERAL')}&alunoId=0&semestre=${Cypress.env('SEMESTRE_CODIGO')}&componenteCurricularId=${Cypress.env('COMPONENTE_CURRICULAR_CODIGO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`,
    },
    failOnStatusCode: false,
  }).as('response');
});

Then('retorna o status 601 que o Id do aluno deve ser informado', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601);
    expect(response.body).to.have.property('mensagens');
    expect(response.body.mensagens[0]).to.eq(
      'O Código do Aluno deve ser informado para consulta de Registros Individuais do Estudante',
    );
  });
});

When('envio uma requisição GET para o endpoint com semestre inexistente', function () {
  cy.request({
    method: 'GET',
    url:
      Cypress.config('baseUrl') +
      `/api/v1/acompanhamento/alunos?turmaId=${Cypress.env('TURMA_CODIGO_APANHADO_GERAL')}&alunoId=${Cypress.env('ALUNO_ID')}&semestre=0&componenteCurricularId=${Cypress.env('COMPONENTE_CURRICULAR_CODIGO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`,
    },
    failOnStatusCode: false,
  }).as('response');
});

Then('retorna o status 601 que o semestre deve ser informado', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601);
    expect(response.body).to.have.property('mensagens');
    expect(response.body.mensagens[0]).to.eq('O semestre deve ser informado para consulta.');
  });
});

When('envio uma requisição GET para o endpoint sem token de acesso', function () {
  cy.request({
    method: 'GET',
    url:
      Cypress.config('baseUrl') +
      `/api/v1/acompanhamento/alunos?turmaId=${Cypress.env('TURMA_CODIGO_APANHADO_GERAL')}&alunoId=${Cypress.env('ALUNO_ID')}&semestre=${Cypress.env('SEMESTRE_CODIGO')}&componenteCurricularId=${Cypress.env('COMPONENTE_CURRICULAR_CODIGO')}`,
    headers: {
      accept: 'text/plain',
    },
    failOnStatusCode: false,
  }).as('response');
});

Then('retorna o status 401 de acesso não autorizado', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(401);
  });
});

When('envio uma requisição GET para o endpoint de fotos dos alunos acompanhados', function () {
  cy.request({
    method: 'GET',
    url:
      Cypress.config('baseUrl') +
      `/api/v1/acompanhamento/alunos/semestres/${Cypress.env('SEMESTRE_CODIGO')}/fotos`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`,
    },
    failOnStatusCode: false,
  }).as('response');
});

Then('retorna as fotos dos alunos acompanhados com status 200', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200);
    expect(response.body).to.be.an('array');
  });
});

When(
  'envio uma requisição GET para o endpoint de fotos dos alunos acompanhados com semestre inexistente',
  function () {
    cy.request({
      method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/acompanhamento/alunos/semestres/0/fotos`,
      headers: {
        accept: 'text/plain',
        Authorization: `Bearer ${token}`,
      },
      failOnStatusCode: false,
    }).as('response');
  },
);

Then('retorna o status 601 que o Id do acompanhamento no semestre deve ser informado', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601);
    expect(response.body).to.have.property('mensagens');
    expect(response.body.mensagens[0]).to.eq(
      'O id do acompanhamento estudante/criança no semestre deve ser informado para consulta de seu ano',
    );
  });
});

When(
  'envio uma requisição GET para o endpoint de fotos dos alunos acompanhados com semestre não encontrado',
  function () {
    cy.request({
      method: 'GET',
      url: Cypress.config('baseUrl') + `/api/v1/acompanhamento/alunos/semestres/999/fotos`,
      headers: {
        accept: 'text/plain',
        Authorization: `Bearer ${token}`,
      },
      failOnStatusCode: false,
    }).as('response');
  },
);

Then('retorna o status 601 que o ano do acompanhamento não foi localizado', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(601);
    expect(response.body).to.have.property('mensagens');
    expect(response.body.mensagens[0]).to.eq(
      'O ano do acompanhamento do estudante/criança não foi localizado',
    );
  });
});
