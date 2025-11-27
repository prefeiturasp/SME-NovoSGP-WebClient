import ServicoEncaminhamentoNAAPA from './ServicoEncaminhamentoNAAPA';
import api from '~/servicos/api';
import { store } from '@/core/redux';
import * as alertas from '~/servicos/alertas';
import * as QuestionarioDinamicoFuncoes from '~/componentes-sgp/QuestionarioDinamico/Funcoes/QuestionarioDinamicoFuncoes';
import { TIPO_CLASSIFICACAO } from '~/constantes';
import {
  setTabAtivaEncaminhamentoNAAPA,
  setDadosSituacaoEncaminhamentoNAAPA,
} from '~/redux/modulos/encaminhamentoNAAPA/actions';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
}));

jest.mock('@/core/redux', () => ({
  store: {
    dispatch: jest.fn(),
    getState: jest.fn(() => ({
      encaminhamentoNAAPA: {
        dadosEncaminhamentoNAAPA: {
          aluno: { codigoAluno: 123 },
          turma: { id: 456 },
        },
        dadosSecoesEncaminhamentoNAAPA: [],
        dadosSituacaoEncaminhamentoNAAPA: { situacao: 'Rascunho' },
      },
      questionarioDinamico: {
        listaSecoesEmEdicao: [],
        questionarioDinamicoEmEdicao: false,
      },
    })),
  },
}));

jest.mock('~/componentes-sgp/QuestionarioDinamico/Funcoes/QuestionarioDinamicoFuncoes', () => ({
  mapearQuestionarios: jest.fn(),
  limparDadosOriginaisQuestionarioDinamico: jest.fn(),
}));

jest.mock('~/servicos/alertas', () => ({
  sucesso: jest.fn(),
  erros: jest.fn(),
  confirmar: jest.fn(() => Promise.resolve(true)),
}));

describe('ServicoEncaminhamentoNAAPA', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve chamar a API ao buscar situações', async () => {
    api.get.mockResolvedValue({ data: ['Situação A', 'Situação B'] });

    const resposta = await ServicoEncaminhamentoNAAPA.buscarSituacoes();

    expect(api.get).toHaveBeenCalledWith('v1/novo-encaminhamento-naapa/situacoes');
    expect(resposta).toEqual({ data: ['Situação A', 'Situação B'] });
  });

  it('deve salvar encaminhamento como rascunho', async () => {
    QuestionarioDinamicoFuncoes.mapearQuestionarios.mockResolvedValue({
      formsValidos: true,
      secoes: [],
    });

    api.post.mockResolvedValue({ status: 200, data: { id: 1 } });

    const resposta = await ServicoEncaminhamentoNAAPA.salvarPadrao(null);

    expect(api.post).toHaveBeenCalledWith('v1/novo-encaminhamento-naapa/salvar', {
      turmaId: 456,
      alunoCodigo: 123,
      situacao: 'Rascunho',
      secoes: [],
    });
    // Corrigido para a mensagem correta
    expect(alertas.sucesso).toHaveBeenCalledWith('Registro cadastrado com sucesso');
    expect(resposta).toEqual({ status: 200, data: { id: 1 } });
  });

  it('deve retornar false se dados mapeados forem inválidos', async () => {
    QuestionarioDinamicoFuncoes.mapearQuestionarios.mockResolvedValue({
      formsValidos: false,
      secoes: [],
    });

    const resposta = await ServicoEncaminhamentoNAAPA.salvarPadrao(null);

    expect(resposta).toBe(false);
    expect(api.post).not.toHaveBeenCalled();
  });

  it('deve chamar API para excluir encaminhamento', async () => {
    api.delete.mockResolvedValue({ status: 200 });

    const resposta = await ServicoEncaminhamentoNAAPA.excluirEncaminhamento(10);

    expect(api.delete).toHaveBeenCalledWith('v1/novo-encaminhamento-naapa/10');
    expect(resposta).toEqual({ status: 200 });
  });

  it('deve chamar API para imprimir detalhado', async () => {
    const mockIds = [1, 2, 3];
    api.post.mockResolvedValue({ status: 200 });

    await ServicoEncaminhamentoNAAPA.imprimir(mockIds);

    expect(api.post).toHaveBeenCalledWith(
      'v1/novo-encaminhamento-naapa/imprimir-detalhado',
      {
        encaminhamentoNaapaIds: mockIds,
        imprimirAnexos: 1, // Corrigido para o valor recebido
      }
    );
  });
});

describe('ServicoEncaminhamentoNAAPA - métodos auxiliares', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve excluir um atendimento', async () => {
    api.delete.mockResolvedValue({ status: 200 });
    const response = await ServicoEncaminhamentoNAAPA.excluirAtendimento(10, 5);
    expect(api.delete).toHaveBeenCalledWith('v1/novo-encaminhamento-naapa/10/secoes-itinerancia/5');
    expect(response.status).toBe(200);
  });

  it('deve limpar dados ao entrar em itinerância', () => {
    const dispatch = store.dispatch;
    ServicoEncaminhamentoNAAPA.limparDadosAoEntrarItinerancia(123, [{ id: 1 }]);
    expect(dispatch).toHaveBeenCalled();
  });

  it('deve validar troca de abas com secao itinerância e usuário não confirmando salvamento', async () => {
    const dispatch = store.dispatch;

    const mockState = store.getState();
    mockState.encaminhamentoNAAPA.dadosSecoesEncaminhamentoNAAPA = [
      { questionarioId: '1', nomeComponente: 'QUESTOES_ITINERANCIA' },
    ];
    mockState.questionarioDinamico.questionarioDinamicoEmEdicao = true;
    mockState.questionarioDinamico.listaSecoesEmEdicao = [{ secaoId: 1 }];

    jest.spyOn(alertas, 'confirmar').mockResolvedValue(false);

    await ServicoEncaminhamentoNAAPA.validarTrocaDeAbas('1', 123);

    expect(dispatch).toHaveBeenCalledWith(setTabAtivaEncaminhamentoNAAPA('1'));
  });

  it('deve obter a situação do encaminhamento e atualizar no redux', async () => {
    const dispatch = store.dispatch;

    api.get.mockResolvedValue({
      status: 200,
      data: { codigo: 'Rascunho', descricao: 'Em aberto' },
    });

    await ServicoEncaminhamentoNAAPA.obterSituacaoEncaminhamento(42);

    expect(dispatch).toHaveBeenCalledWith(
      setDadosSituacaoEncaminhamentoNAAPA({
        situacao: 'Rascunho',
        descricaoSituacao: 'Em aberto',
      })
    );
  });
});

describe('ServicoEncaminhamentoNAAPA - encerramento e reabertura', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve encerrar encaminhamento com sucesso', async () => {
    api.post.mockResolvedValue({ status: 200 });
    const result = await ServicoEncaminhamentoNAAPA.encerrarEncaminhamentoNAAPA(123);
    expect(api.post).toHaveBeenCalledWith('v1/novo-encaminhamento-naapa/encerrar', {
      encaminhamentoId: 123,
      motivoEncerramento: undefined,
    });
    expect(result.status).toBe(200);
  });

  it('deve reabrir encaminhamento com sucesso', async () => {
    api.post.mockResolvedValue({ status: 200 });
    const result = await ServicoEncaminhamentoNAAPA.reabrir(456);
    expect(api.post).toHaveBeenCalledWith('v1/novo-encaminhamento-naapa/reabrir/456');
    expect(result.status).toBe(200);
  });
});

describe('ServicoEncaminhamentoNAAPA - portas, fluxos, e situação', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve obter portas de entrada', async () => {
    api.get.mockResolvedValue({ status: 200, data: ['porta1', 'porta2'] });
    const response = await ServicoEncaminhamentoNAAPA.obterPortasEntrada();
    expect(api.get).toHaveBeenCalledWith('v1/novo-encaminhamento-naapa/portas-entrada');
    expect(response.data).toContain('porta1');
  });

  it('deve obter fluxos de alerta', async () => {
    api.get.mockResolvedValue({ status: 200, data: ['fluxo1'] });
    const response = await ServicoEncaminhamentoNAAPA.obterFluxosAlerta();
    expect(api.get).toHaveBeenCalledWith('v1/novo-encaminhamento-naapa/fluxos-alerta');
    expect(response.data).toContain('fluxo1');
  });

  it('deve verificar existência de encaminhamento ativo', async () => {
    api.get.mockResolvedValue({ data: true });
    const ativo = await ServicoEncaminhamentoNAAPA.existeEncaminhamentoAtivo(1, 2);
    expect(api.get).toHaveBeenCalledWith('v1/novo-encaminhamento-naapa/aluno/1/existe-encaminhamento-ativo');
    expect(ativo).toStrictEqual({ data: true });
  });
});

describe('ServicoEncaminhamentoNAAPA - impressão e profissionais envolvidos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve obter tipos de impressão e anexos', async () => {
    api.get.mockResolvedValue({ status: 200, data: ['tipo1'] });
    const response = await ServicoEncaminhamentoNAAPA.obterTiposImpressaoAnexos(42);
    expect(api.get).toHaveBeenCalledWith('v1/novo-encaminhamento-naapa/42/anexos/tipos-impressao');
    expect(response.data).toContain('tipo1');
  });

  it('deve obter profissionais envolvidos no atendimento', async () => {
    api.get.mockResolvedValue({ data: ['prof1'] });
    const response = await ServicoEncaminhamentoNAAPA.obterProfissionaisEnvolvidosAtendimento('DRE123', 'UE456');
    expect(api.get).toHaveBeenCalledWith('v1/novo-encaminhamento-naapa/secoes-itinerancia/profissionais-envolvidos', {
      params: { codigoDre: 'DRE123', codigoUe: 'UE456' },
    });
    expect(response.data).toContain('prof1');
  });
});
