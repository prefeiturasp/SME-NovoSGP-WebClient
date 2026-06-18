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

When('envio uma requisição GET para o endpoint de aulas com id da aula existente', function () {
  cy.request({
    method: 'GET',
    url:
      Cypress.config('baseUrl') + `/api/v1/calendarios/professores/aulas/${Cypress.env('AULA_ID')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`,
    },
    failOnStatusCode: false,
  }).as('response');
});

When('envio uma requisição GET para o endpoint com id da aula inexistente', function () {
  cy.request({
    method: 'GET',
    url:
      Cypress.config('baseUrl') +
      `/api/v1/calendarios/professores/aulas/${Cypress.env('AULA_CODIGO_INVALIDO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: `Bearer ${token}`,
    },
    failOnStatusCode: false,
  }).as('response');
});

When('envio uma requisição GET para o endpoint sem token de acesso', function () {
  cy.request({
    method: 'GET',
    url:
      Cypress.config('baseUrl') +
      `/api/v1/calendarios/professores/aulas/${Cypress.env('AULA_ID_INVALIDO')}`,
    headers: {
      accept: 'text/plain',
      Authorization: 'Bearer token-invalido',
    },
    failOnStatusCode: false,
  }).as('response');
});

When(
  'envio uma requisição GET para o endpoint de recorrência da aula com id da aula existente',
  function () {
    cy.request({
      method: 'GET',
      url:
        Cypress.config('baseUrl') +
        `/api/v1/calendarios/professores/aulas/${Cypress.env('AULA_ID')}/recorrencias/serie/${Cypress.env('AULA_RECORRENCIA_ID')}`,
      headers: {
        accept: 'text/plain',
        Authorization: `Bearer ${token}`,
      },
      failOnStatusCode: false,
    }).as('response');
  },
);

When(
  'envio uma requisição GET para o endpoint de recorrência da aula sem token de acesso',
  function () {
    cy.request({
      method: 'GET',
      url:
        Cypress.config('baseUrl') +
        `/api/v1/calendarios/professores/aulas/${Cypress.env('AULA_ID')}/recorrencias/serie/${Cypress.env('AULA_RECORRENCIA_ID')}`,
      headers: {
        accept: 'text/plain',
        Authorization: 'Bearer token-invalido',
      },
      failOnStatusCode: false,
    }).as('response');
  },
);

When(
  'envio uma requisição GET para o endpoint de recorrência da aula com id da aula inexistente',
  function () {
    cy.request({
      method: 'GET',
      url:
        Cypress.config('baseUrl') +
        `/api/v1/calendarios/professores/aulas/${Cypress.env('AULA_ID_INVALIDO')}/recorrencias/serie/${Cypress.env('AULA_RECORRENCIA_ID')}`,
      headers: {
        accept: 'text/plain',
        Authorization: `Bearer ${token}`,
      },
      failOnStatusCode: false,
    }).as('response');
  },
);

When(
  'envio uma requisição GET para o endpoint de aula por data e componente curricular para cadastro com dados válidos',
  function () {
    const dataAula = new Date().toISOString().split('T')[0];
    const componenteCurricularId = 139;

    cy.request({
      method: 'GET',
      url:
        Cypress.config('baseUrl') +
        `/api/v1/calendarios/professores/aulas/${Cypress.env('AULA_ID')}/turmas/3019147/componente-curricular/${componenteCurricularId}?dataAula=${dataAula}&tipoAula=1`,
      headers: {
        accept: 'text/plain',
        Authorization: `Bearer ${token}`,
      },
      failOnStatusCode: false,
    }).as('response');
  },
);

When(
  'envio uma requisição GET para o endpoint de aula por data e componente curricular para cadastro sem token de acesso',
  function () {
    const dataAula = new Date().toISOString().split('T')[0];
    const componenteCurricularId = 139;

    cy.request({
      method: 'GET',
      url:
        Cypress.config('baseUrl') +
        `/api/v1/calendarios/professores/aulas/${Cypress.env('AULA_ID')}/turmas/3019147/componente-curricular/${componenteCurricularId}?dataAula=${dataAula}&tipoAula=1`,
      headers: {
        accept: 'text/plain',
        Authorization: 'Bearer token-invalido',
      },
      failOnStatusCode: false,
    }).as('response');
  },
);

When(
  'envio uma requisição GET para o endpoint de aula por data e componente curricular para cadastro sem a data',
  function () {
    const componenteCurricularId = 139;

    cy.request({
      method: 'GET',
      url:
        Cypress.config('baseUrl') +
        `/api/v1/calendarios/professores/aulas/${Cypress.env('AULA_ID')}/turmas/3019147/componente-curricular/${componenteCurricularId}?tipoAula=1`,
      headers: {
        accept: 'text/plain',
        Authorization: `Bearer ${token}`,
      },
      failOnStatusCode: false,
    }).as('response');
  },
);

When(
  'envio uma requisição GET para o endpoint de aula por data e componente curricular para cadastro com data inválida',
  function () {
    const dataInvalida = '2026-13-32';
    const componenteCurricularId = 139;

    cy.request({
      method: 'GET',
      url:
        Cypress.config('baseUrl') +
        `/api/v1/calendarios/professores/aulas/${Cypress.env('AULA_ID')}/turmas/3019147/componente-curricular/${componenteCurricularId}?dataAula=${dataInvalida}&tipoAula=1`,
      headers: {
        accept: 'text/plain',
        Authorization: `Bearer ${token}`,
      },
      failOnStatusCode: false,
    }).as('response');
  },
);

When(
  'envio uma requisição GET para o endpoint de aula por data e componente curricular para cadastro com tipo aula inválida',
  function () {
    const dataAula = new Date().toISOString().split('T')[0];
    const componenteCurricularId = 139;
    const tipoAulaInvalido = 0;

    cy.request({
      method: 'GET',
      url:
        Cypress.config('baseUrl') +
        `/api/v1/calendarios/professores/aulas/${Cypress.env('AULA_ID')}/turmas/3019147/componente-curricular/${componenteCurricularId}?dataAula=${dataAula}&tipoAula=${tipoAulaInvalido}`,
      headers: {
        accept: 'text/plain',
        Authorization: `Bearer ${token}`,
      },
      failOnStatusCode: false,
    }).as('response');
  },
);

When(
  'envio uma requisição GET para o endpoint de aula por data e componente curricular para cadastro com aula do tipo Normal com dia selecionado inválido',
  function () {
    const dataAula = '2024-12-25';
    const componenteCurricularId = 139;

    cy.request({
      method: 'GET',
      url:
        Cypress.config('baseUrl') +
        `/api/v1/calendarios/professores/aulas/${Cypress.env('AULA_ID')}/turmas/3019147/componente-curricular/${componenteCurricularId}?dataAula=${dataAula}&tipoAula=1`,
      headers: {
        accept: 'text/plain',
        Authorization: `Bearer ${token}`,
      },
      failOnStatusCode: false,
    }).as('response');
  },
);

When(
  'envio uma requisição GET para o endpoint de aula por data e componente curricular para cadastro com aula do tipo Reposição com dia selecionado inválido',
  function () {
    const dataAula = '2024-12-25';
    const componenteCurricularId = 139;

    cy.request({
      method: 'GET',
      url:
        Cypress.config('baseUrl') +
        `/api/v1/calendarios/professores/aulas/${Cypress.env('AULA_ID')}/turmas/3019147/componente-curricular/${componenteCurricularId}?dataAula=${dataAula}&tipoAula=2`,
      headers: {
        accept: 'text/plain',
        Authorization: `Bearer ${token}`,
      },
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

Then('retorna o status 422', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(422);
  });
});

// AND

And('as informações da aula', function () {
  cy.get('@response').then((response) => {
    const aula = response.body;
    expect(aula).to.have.property('alteradoEm');
    expect(aula).to.have.property('alteradoPor');
    expect(aula).to.have.property('alteradoRF');
    expect(aula).to.have.property('aulaCJ');
    expect(aula).to.have.property('podeEditar');
    expect(aula).to.have.property('criadoEm');
    expect(aula).to.have.property('criadoPor');
    expect(aula).to.have.property('criadoRF');
    expect(aula).to.have.property('dataAula');
    expect(aula).to.have.property('disciplinaCompartilhadaId');
    expect(aula).to.have.property('disciplinaId');
    expect(aula).to.have.property('id');
    expect(aula).to.have.property('professorRf');
    expect(aula).to.have.property('quantidade');
    expect(aula).to.have.property('recorrenciaAula');
    expect(aula).to.have.property('recorrenciaAulaPai');
    expect(aula).to.have.property('somenteLeitura');
    expect(aula).to.have.property('tipoAula');
    expect(aula).to.have.property('tipoCalendarioId');
    expect(aula).to.have.property('turmaId');
    expect(aula).to.have.property('ueId');
    expect(aula).to.have.property('dentroPeriodo');
    expect(aula).to.have.property('migrado');
    expect(aula).to.have.property('emManutencao');
    expect(aula).to.have.property('possuiCompensacao');
  });
});

And('a mensagem de aula ID não encontrada', function () {
  cy.get('@response').then((response) => {
    expect(response.body).to.have.property('mensagens');
    expect(response.body.mensagens[0]).to.eq(
      `Aula de id ${Cypress.env('AULA_CODIGO_INVALIDO')} não encontrada`,
    );
  });
});

And('a recorrência da aula', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200);
    const recorrenciaAula = response.body;
    expect(recorrenciaAula).to.have.property('aulaId');
    expect(recorrenciaAula).to.have.property('recorrenciaAula');
    expect(recorrenciaAula).to.have.property('quantidadeAulasRecorrentes');
    expect(recorrenciaAula).to.have.property('existeFrequenciaOuPlanoAula');
  });
});

And('a mensagem de aula não encontrada', function () {
  cy.get('@response').then((response) => {
    expect(response.body).to.have.property('mensagens');
    expect(response.body.mensagens[0]).to.eq(`Aula não encontrada`);
  });
});

And('as informações da aula para cadastro', function () {
  cy.get('@response').then((response) => {
    expect(response.status).to.eq(200);
    const aula = response.body;
    expect(aula).to.have.property('podeCadastrarAula');
    expect(aula).to.have.property('grade');
    expect(aula.grade).to.have.property('quantidadeAulasGrade');
    expect(aula.grade).to.have.property('quantidadeAulasRestante');
    expect(aula.grade).to.have.property('podeEditar');
  });
});

And('a mensagem de data da aula é obrigatória', function () {
  cy.get('@response').then((response) => {
    expect(response.body).to.have.property('mensagens');
    expect(response.body.mensagens[0]).to.eq(
      `A data da aula deve ser informada para consulta de existência de aulas`,
    );
  });
});

And('a mensagem de data inválida', function () {
  cy.get('@response').then((response) => {
    expect(response.body).to.have.property('mensagens');
    expect(response.body.mensagens[0]).to.eq(`The value '2026-13-32' is not valid.`);
  });
});

And('a mensagem de tipo aula inválida', function () {
  cy.get('@response').then((response) => {
    expect(response.body).to.have.property('mensagens');
    expect(response.body.mensagens[0]).to.eq(`The value '0' is invalid.`);
  });
});

And('a mensagem de dia selecionado inválido para aula do tipo Normal', function () {
  cy.get('@response').then((response) => {
    expect(response.body).to.have.property('mensagens');
    expect(response.body.mensagens[0]).to.eq(
      `Não é possível cadastrar aula do tipo 'Normal' para o dia selecionado!`,
    );
  });
});

And('a mensagem de dia selecionado inválido para aula do tipo Reposição', function () {
  cy.get('@response').then((response) => {
    expect(response.body).to.have.property('mensagens');
    expect(response.body.mensagens[0]).to.eq(
      `Não é possível cadastrar aula do tipo 'Reposição' para o dia selecionado!`,
    );
  });
});
