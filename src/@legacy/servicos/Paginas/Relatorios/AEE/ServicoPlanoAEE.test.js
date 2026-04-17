import ServicoPlanoAEE from './ServicoPlanoAEE';
import situacaoPlanoAEE from '~/dtos/situacaoPlanoAEE';
import api from '~/servicos/api';
import { store } from '@/core/redux';
import { confirmar, sucesso, erros } from '~/servicos/alertas';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
  put: jest.fn(),
  interceptors: {
    request: { use: jest.fn() },
    response: { use: jest.fn() },
  },
}));

jest.mock('~/servicos/alertas', () => ({
  confirmar: jest.fn(),
  sucesso: jest.fn(),
  erros: jest.fn(),
}));

jest.mock('@/core/redux', () => ({
  store: {
    getState: jest.fn(),
    dispatch: jest.fn(),
  },
}));

describe('ServicoPlanoAEE - Métodos básicos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('obterSituacoes', async () => {
    const mockData = { data: ['Ativo', 'Inativo'] };
    api.get.mockResolvedValue(mockData);

    const res = await ServicoPlanoAEE.obterSituacoes();
    expect(api.get).toHaveBeenCalledWith('v1/plano-aee/situacoes');
    expect(res).toEqual(mockData);
  });

  it('obterVersoes', async () => {
    await ServicoPlanoAEE.obterVersoes(10, 20);
    expect(api.get).toHaveBeenCalledWith(
      'v1/plano-aee/10/versoes/reestruturacao/20'
    );
  });

  it('obterReestruturacoes', async () => {
    await ServicoPlanoAEE.obterReestruturacoes(11);
    expect(api.get).toHaveBeenCalledWith('v1/plano-aee/11/reestruturacoes');
  });

  it('salvarReestruturacoes', async () => {
    const params = { planoAEEId: 1, nome: 'teste' };
    await ServicoPlanoAEE.salvarReestruturacoes(params);
    expect(api.post).toHaveBeenCalledWith(
      'v1/plano-aee/1/reestruturacoes',
      params
    );
  });

  it('obterParecer', async () => {
    await ServicoPlanoAEE.obterParecer(15);
    expect(api.get).toHaveBeenCalledWith('v1/plano-aee/15/parecer');
  });

  it('encerrarPlano', async () => {
    await ServicoPlanoAEE.encerrarPlano(22);
    expect(api.post).toHaveBeenCalledWith(
      'v1/plano-aee/encerrar-plano?planoAeeId=22'
    );
  });

  it('excluirPlano', async () => {
    await ServicoPlanoAEE.excluirPlano(99);
    expect(api.delete).toHaveBeenCalledWith('v1/plano-aee/99');
  });

  it('excluirObservacao', async () => {
    await ServicoPlanoAEE.excluirObservacao(77);
    expect(api.delete).toHaveBeenCalledWith('v1/plano-aee/observacoes/77');
  });

  it('devolverPlanoAEE', async () => {
    const params = { motivo: 'motivo', planoAEEId: 5 };
    await ServicoPlanoAEE.devolverPlanoAEE(params);
    expect(api.post).toHaveBeenCalledWith('v1/plano-aee/devolver', params);
  });

  it('obterResponsavelPlanoPAAI', async () => {
    await ServicoPlanoAEE.obterResponsavelPlanoPAAI(8);
    expect(api.get).toHaveBeenCalledWith('v1/plano-aee/paai-ue?codigoUe=8');
  });

  it('existePlanoAEEEstudante com estudante e ue', async () => {
    api.get.mockResolvedValue({ data: true });

    const retorno = await ServicoPlanoAEE.existePlanoAEEEstudante({
      estudanteCodigo: '7719808',
      ueCodigo: '099058',
    });

    expect(api.get).toHaveBeenCalledWith(
      'v1/plano-aee/estudante/7719808/existe/099058/ue'
    );
    expect(retorno).toBe(true);
  });

  it('imprimirVersoes', async () => {
    await ServicoPlanoAEE.imprimirVersoes([1, 2, 3]);
    expect(api.post).toHaveBeenCalledWith('v1/plano-aee/imprimir', {
      versoesIds: [1, 2, 3],
    });
  });

  it('removerReponsavelPAAI', async () => {
    await ServicoPlanoAEE.removerReponsavelPAAI(44);
    expect(api.post).toHaveBeenCalledWith(
      'v1/plano-aee/remover-responsavel/44'
    );
  });

  it('gerarRelatorioPlanosAEE', async () => {
    const params = { filtro: 'ativo' };
    await ServicoPlanoAEE.gerarRelatorioPlanosAEE(params);
    expect(api.post).toHaveBeenCalledWith('v1/relatorios/planos-aee', params);
  });

  it('obterResponsaveis com todos os parâmetros', async () => {
    await ServicoPlanoAEE.obterResponsaveis(1, 2, 3, 4, 'ATIVO', true);
    expect(api.get).toHaveBeenCalledWith(
      'v1/plano-aee/responsaveis?dreId=1&ueId=2&exibirEncerrados=true&turmaId=3&alunoCodigo=4&situacao=ATIVO'
    );
  });
});

describe('ServicoPlanoAEE.escolherAcao', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    store.getState.mockReturnValue({
      planoAEE: {
        parecerEmEdicao: true,
        planoAEEDados: {
          situacao: 'ParecerCP',
        },
        dadosAtribuicaoResponsavel: {},
        dadosParecer: {},
      },
      collapseLocalizarEstudante: {
        dadosCollapseLocalizarEstudante: {}, // <- importante
      },
      questionarioDinamico: {
        formsQuestionarioDinamico: [], // <- importante
      },
    });
  });

  it('deve salvar parecer CP quando situacao for ParecerCP e não houver RF', async () => {
    confirmar.mockResolvedValue(true);
    sucesso.mockImplementation(() => {});
    // Garante que o valor de situacaoPlanoAEE.ParecerCP seja igual ao usado no método
    store.getState.mockReturnValue({
      planoAEE: {
        parecerEmEdicao: true,
        planoAEEDados: {
          situacao: situacaoPlanoAEE.ParecerCP,
        },
        dadosAtribuicaoResponsavel: {},
        dadosParecer: {},
      },
      collapseLocalizarEstudante: {
        dadosCollapseLocalizarEstudante: {},
      },
      questionarioDinamico: {
        formsQuestionarioDinamico: [],
      },
    });
    const resultado = await ServicoPlanoAEE.escolherAcao();
    expect(resultado).toBe(true);
  });

  it('deve retornar false se usuário cancelar o confirmar', async () => {
    confirmar.mockResolvedValue(false);

    const resultado = await ServicoPlanoAEE.escolherAcao();

    expect(resultado).toBe(false);
  });
});

describe('ServicoPlanoAEE.cliqueTabPlanoAEE', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    store.getState.mockReturnValue({
      planoAEE: {
        parecerEmEdicao: true,
        planoAEEDados: {
          situacao: 'ParecerCP',
        },
        dadosAtribuicaoResponsavel: {},
        dadosParecer: {},
      },
      collapseLocalizarEstudante: {
        dadosCollapseLocalizarEstudante: {},
      },
      questionarioDinamico: {
        formsQuestionarioDinamico: [],
      },
    });
  });

  it('deve salvar e atualizar quando for questionario em edição', async () => {
    confirmar.mockResolvedValue(true);
    sucesso.mockImplementation(() => {});
    await ServicoPlanoAEE.cliqueTabPlanoAEE('2', false);
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: expect.any(String) })
    );
  });

  it('deve chamar escolherAcao quando não estiver em edição', async () => {
    store.getState.mockReturnValueOnce({
      questionarioDinamico: {
        questionarioDinamicoEmEdicao: false,
        planoAEEDados: { situacao: 'AtribuicaoPAAI' },
      },
    });
    await ServicoPlanoAEE.cliqueTabPlanoAEE('2');
    expect(store.dispatch).toHaveBeenCalled();
  });
});

//teste com defeito, ainda está sendo corrigido para incluir testes mais complexos
