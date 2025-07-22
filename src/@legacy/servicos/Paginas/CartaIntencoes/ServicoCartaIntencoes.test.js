// Mock API first
jest.mock('~/servicos/api', () => ({
  __esModule: true,
  default: {
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() }
    },
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  }
}));

import api from '~/servicos/api';
import ServicoCartaIntencoes from '~/servicos/Paginas/CartaIntencoes/ServicoCartaIntencoes';

// your describe and tests continue


const urlPadrao = '/v1/carta-intencoes';

describe('ServicoCartaIntencoes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve buscar bimestres corretamente', async () => {
    await ServicoCartaIntencoes.obterBimestres(10, 20);
    expect(api.get).toHaveBeenCalledWith('/v1/carta-intencoes/turmas/10/componente-curricular/20');
  });

  /*it('deve salvar ou editar carta de intenções', async () => {
    const dados = { teste: 'valor' };
    await ServicoCartaIntencoes.salvarEditarCartaIntencoes(dados);
    expect(api.post).toHaveBeenCalledWith('/v1/carta-intencoes', dados);
  });*/

  it('deve buscar observações corretamente', async () => {
    await ServicoCartaIntencoes.obterDadosObservacoes(11, 22);
    expect(api.get).toHaveBeenCalledWith('/v1/carta-intencoes/turmas/11/componente-curricular/22/observacoes');
  });

  it('deve buscar usuários para notificação corretamente', async () => {
    await ServicoCartaIntencoes.obterNotificarUsuarios({
      turmaId: 'turma1',
      componenteCurricular: 'comp1',
    });
    expect(api.get).toHaveBeenCalledWith('/v1/carta-intencoes/notificacoes/usuarios?turmaId=turma1&componenteCurricular=comp1');
  });

  /*it('deve editar observação existente', async () => {
    const dados = { id: 99, observacao: 'Teste observação' };
    await ServicoCartaIntencoes.salvarEditarObservacao(dados, 1, 2);
    expect(api.put).toHaveBeenCalledWith(
      '/v1/carta-intencoes/observacoes/99',
      { observacao: 'Teste observação' }
    );
  });

  it('deve criar nova observação quando não há id', async () => {
    const dados = { observacao: 'Nova observação' };
    await ServicoCartaIntencoes.salvarEditarObservacao(dados, 5, 6);
    expect(api.post).toHaveBeenCalledWith(
      '/v1/carta-intencoes/turmas/5/componente-curricular/6/observacoes',
      { observacao: 'Nova observação' }
    );
  });

  it('deve excluir observação corretamente', async () => {
    const dados = { id: 77 };
    await ServicoCartaIntencoes.excluirObservacao(dados);
    expect(api.delete).toHaveBeenCalledWith('/v1/carta-intencoes/observacoes/77');
  });*/
});