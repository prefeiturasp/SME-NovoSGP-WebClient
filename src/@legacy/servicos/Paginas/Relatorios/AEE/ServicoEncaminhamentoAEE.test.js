import ServicoEncaminhamentoAEE from './ServicoEncaminhamentoAEE';
import api from '~/servicos/api';
import { store } from '@/core/redux';
import * as alertas from '~/servicos/alertas';
import { ServicoCalendarios } from '../../Calendario';

jest.mock('~/servicos/api', () => {
  const mockUse = jest.fn();
  return {
    get: jest.fn(),
    post: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: {
        use: mockUse,
      },
      response: {
        use: mockUse,
      },
    },
  };
});

jest.mock('@/core/redux', () => ({
  store: {
    dispatch: jest.fn(),
    getState: jest.fn(),
  },
}));

jest.mock('~/servicos/alertas', () => ({
  erros: jest.fn(),
}));

jest.mock('../../Calendario', () => ({
  ServicoCalendarios: {
    obterFrequenciaAluno: jest.fn(),
  },
}));

describe('ServicoEncaminhamentoAEE', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('obterSituacoes deve chamar api.get com url correta', async () => {
    api.get.mockResolvedValue({ data: ['sit1', 'sit2'] });
    const result = await ServicoEncaminhamentoAEE.obterSituacoes();
    expect(api.get).toHaveBeenCalledWith('v1/encaminhamento-aee/situacoes');
    expect(result.data).toEqual(['sit1', 'sit2']);
  });

  it('obterAlunoSituacaoEncaminhamentoAEE deve chamar api.get com params corretos', async () => {
    api.get.mockResolvedValue({ data: { situacao: 'ativo' } });
    const params = { estudanteCodigo: '123', ueCodigo: '456' };
    const result = await ServicoEncaminhamentoAEE.obterAlunoSituacaoEncaminhamentoAEE(params);
    expect(api.get).toHaveBeenCalledWith('v1/encaminhamento-aee/estudante/situacao', {
      params,
    });
    expect(result.data).toEqual({ situacao: 'ativo' });
  });

  it('obterAvisoModal deve despachar dados e exibir modal quando dadosModalAviso undefined', async () => {
    store.getState.mockReturnValue({
      encaminhamentoAEE: { dadosModalAviso: null },
    });
    const dadosApi = { texto: 'Aviso importante' };
    api.get.mockResolvedValue({ data: dadosApi });

    await ServicoEncaminhamentoAEE.obterAvisoModal();

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: '@encaminhamentoAEE/setDadosModalAviso' })
    );
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: '@encaminhamentoAEE/setExibirModalAviso' })
    );
  });

  it('obterAvisoModal deve exibir modal quando dadosModalAviso já existe', async () => {
    store.getState.mockReturnValue({
      encaminhamentoAEE: { dadosModalAviso: { texto: 'Já tem dados' } },
    });

    await ServicoEncaminhamentoAEE.obterAvisoModal();

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: '@encaminhamentoAEE/setExibirModalAviso' })
    );
  });

  it('obterSecoesPorEtapaDeEncaminhamentoAEE deve chamar api.get com url sem id', async () => {
    api.get.mockResolvedValue({ data: ['sec1', 'sec2'] });
    const result = await ServicoEncaminhamentoAEE.obterSecoesPorEtapaDeEncaminhamentoAEE();
    expect(api.get).toHaveBeenCalledWith('v1/encaminhamento-aee/secoes');
    expect(result.data).toEqual(['sec1', 'sec2']);
  });

  it('obterSecoesPorEtapaDeEncaminhamentoAEE deve chamar api.get com url com id', async () => {
    api.get.mockResolvedValue({ data: ['sec1'] });
    const result = await ServicoEncaminhamentoAEE.obterSecoesPorEtapaDeEncaminhamentoAEE(5);
    expect(api.get).toHaveBeenCalledWith('v1/encaminhamento-aee/secoes?encaminhamentoAeeId=5');
    expect(result.data).toEqual(['sec1']);
  });

  it('obterQuestionario deve chamar api.get com query params corretos sem encaminhamentoId', async () => {
    api.get.mockResolvedValue({ data: { id: 1 } });
    const result = await ServicoEncaminhamentoAEE.obterQuestionario(1, null, '123', '999');
    expect(api.get).toHaveBeenCalledWith('v1/encaminhamento-aee/questionario?questionarioId=1&codigoAluno=123&codigoTurma=999');
    expect(result.data).toEqual({ id: 1 });
  });

  it('obterQuestionario deve chamar api.get com query params corretos com encaminhamentoId', async () => {
    api.get.mockResolvedValue({ data: { id: 2 } });
    const result = await ServicoEncaminhamentoAEE.obterQuestionario(1, 7, '123', '999');
    expect(api.get).toHaveBeenCalledWith('v1/encaminhamento-aee/questionario?questionarioId=1&codigoAluno=123&codigoTurma=999&encaminhamentoId=7');
    expect(result.data).toEqual({ id: 2 });
  });

  it('obterEncaminhamentoPorId deve despachar ações corretamente e obter frequencia', async () => {
    const mockData = {
      aluno: { codigoAluno: '123', numeroAlunoChamada: 5, turmaEscola: 'Turma X' },
      turma: { codigo: '999', anoLetivo: 2023, id: 11 },
      responsavelEncaminhamentoAEE: { rf: 'RF123', nome: 'João', id: 10 },
    };

    api.get.mockResolvedValue({ data: mockData });
    ServicoCalendarios.obterFrequenciaAluno.mockResolvedValue({ data: '95%' });

    store.getState.mockReturnValue({
      encaminhamentoAEE: {},
    });

    await ServicoEncaminhamentoAEE.obterEncaminhamentoPorId(1);

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: '@encaminhamentoAEE/setExibirLoaderEncaminhamentoAEE' })
    );
    expect(api.get).toHaveBeenCalledWith('v1/encaminhamento-aee/1');
    expect(ServicoCalendarios.obterFrequenciaAluno).toHaveBeenCalledWith('123', '999');
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: '@objectCardEstudante/setDadosObjectCardEstudante' })
    );
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: '@collapseLocalizarEstudante/setDadosCollapseLocalizarEstudante' })
    );
    expect(store.dispatch).toHaveBeenCalledWith(
    expect.objectContaining({ type: '@collapseAtribuicaoResponsavel/setDadosCollapseAtribuicaoResponsavel' })
    );

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: '@encaminhamentoAEE/setDadosEncaminhamento' })
    );
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: '@encaminhamentoAEE/setExibirLoaderEncaminhamentoAEE' })
    );
  });

  it('obterEncaminhamentoPorId deve limpar dados se não retornar dados', async () => {
    api.get.mockResolvedValue({ data: null });

    store.getState.mockReturnValue({
      encaminhamentoAEE: {},
    });

    await ServicoEncaminhamentoAEE.obterEncaminhamentoPorId(99);

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: '@encaminhamentoAEE/setExibirLoaderEncaminhamentoAEE' })
    );
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: '@collapseAtribuicaoResponsavel/setLimparDadosAtribuicaoResponsavel' })
    );
    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({ type: '@collapseLocalizarEstudante/setLimparDadosLocalizarEstudante' })
    );
  });

  it('salvarEncaminhamento deve retornar true sem validar campos e sem editar se listaSecoesEmEdicao vazia', async () => {
    const mockForm = {
      form: () => ({
        state: { values: {} },
        setFieldTouched: jest.fn(),
        validateForm: jest.fn().mockResolvedValue({}),
        getFormikContext: () => ({ isValid: true, errors: {} }),
      }),
      secaoId: 1,
      dadosQuestionarioAtual: { tipoQuestao: 'tipo', resposta: [] },
    };

    store.getState.mockReturnValue({
      questionarioDinamico: {
        formsQuestionarioDinamico: [mockForm],
        arquivoRemovido: false,
      },
      collapseLocalizarEstudante: {
        dadosCollapseLocalizarEstudante: { turmaId: 1, codigoAluno: '123' },
      },
      encaminhamentoAEE: {
        listaSecoesEmEdicao: [],
        dadosSecoesPorEtapaDeEncaminhamentoAEE: [],
      },
    });

    const result = await ServicoEncaminhamentoAEE.salvarEncaminhamento(
      0,
      'A',
      false,
      false,
      false,
      jest.fn()
    );

    expect(result).toBe(true);
  });

  it('excluirEncaminhamento deve chamar api.delete com url correta', async () => {
    api.delete.mockResolvedValue({ status: 204 });
    const result = await ServicoEncaminhamentoAEE.excluirEncaminhamento(3);
    expect(api.delete).toHaveBeenCalledWith('v1/encaminhamento-aee/3');
    expect(result.status).toBe(204);
  });

  it('podeCadastrarEncaminhamentoEstudante deve retornar true quando api retorna dados', async () => {
    api.get.mockResolvedValue({ data: true });
    const resultado = await ServicoEncaminhamentoAEE.podeCadastrarEncaminhamentoEstudante({
      estudanteCodigo: '123',
      ueCodigo: '456',
    });
    expect(resultado).toBe(true);
  });

  it('podeCadastrarEncaminhamentoEstudante deve retornar false quando api falha', async () => {
    api.get.mockRejectedValue(new Error('fail'));
    alertas.erros.mockImplementation(() => {});
    const resultado = await ServicoEncaminhamentoAEE.podeCadastrarEncaminhamentoEstudante({
      estudanteCodigo: '123',
      ueCodigo: '456',
    });
    expect(resultado).toBe(false);
  });

  it('removerArquivo deve chamar api.delete com url correta', async () => {
    api.delete.mockResolvedValue({ status: 200 });
    const resultado = await ServicoEncaminhamentoAEE.removerArquivo(55);
    expect(api.delete).toHaveBeenCalledWith('v1/encaminhamento-aee/arquivo?arquivoCodigo=55');
    expect(resultado.status).toBe(200);
  });

  it('encerramentoEncaminhamentoAEE deve chamar api.post com params corretos', async () => {
    api.post.mockResolvedValue({ status: 200 });
    const resultado = await ServicoEncaminhamentoAEE.encerramentoEncaminhamentoAEE(10, 'Motivo Teste');
    expect(api.post).toHaveBeenCalledWith('v1/encaminhamento-aee/encerrar', {
      encaminhamentoId: 10,
      motivoEncerramento: 'Motivo Teste',
    });
    expect(resultado.status).toBe(200);
  });

  it('enviarParaAnaliseEncaminhamento deve chamar api.post com url correta', async () => {
    api.post.mockResolvedValue({ status: 200 });
    const resultado = await ServicoEncaminhamentoAEE.enviarParaAnaliseEncaminhamento(5);
    expect(api.post).toHaveBeenCalledWith('v1/encaminhamento-aee/enviar-analise/5');
    expect(resultado.status).toBe(200);
  });

  it('obterResponsaveis deve montar url corretamente e chamar api.get', async () => {
    api.get.mockResolvedValue({ data: ['resp1'] });
    const resultado = await ServicoEncaminhamentoAEE.obterResponsaveis(1, 2, 3, '123', 'Ativo', 2023, true);
    expect(api.get).toHaveBeenCalledWith(
      'v1/encaminhamento-aee/responsaveis?dreId=1&ueId=2&anoLetivo=2023&exibirEncerrados=true&turmaId=3&alunoCodigo=123&situacao=Ativo'
    );
    expect(resultado.data).toEqual(['resp1']);
  });

  it('atribuirResponsavelEncaminhamento deve chamar api.post com params corretos', async () => {
    api.post.mockResolvedValue({ status: 200 });
    const resultado = await ServicoEncaminhamentoAEE.atribuirResponsavelEncaminhamento('RF123', 10);
    expect(api.post).toHaveBeenCalledWith('v1/encaminhamento-aee/atribuir-responsavel', {
      rfResponsavel: 'RF123',
      encaminhamentoId: 10,
    });
    expect(resultado.status).toBe(200);
  });

  it('concluirEncaminhamento deve chamar api.post com url correta', async () => {
    api.post.mockResolvedValue({ status: 200 });
    const resultado = await ServicoEncaminhamentoAEE.concluirEncaminhamento(7);
    expect(api.post).toHaveBeenCalledWith('v1/encaminhamento-aee/concluir/7');
    expect(resultado.status).toBe(200);
  });

  it('removerResponsavel deve chamar api.post com url correta', async () => {
    api.post.mockResolvedValue({ status: 200 });
    const resultado = await ServicoEncaminhamentoAEE.removerResponsavel(8);
    expect(api.post).toHaveBeenCalledWith('v1/encaminhamento-aee/remover-responsavel/8');
    expect(resultado.status).toBe(200);
  });

  it('guardarSecaoEmEdicao deve adicionar secao e despachar lista atualizada', () => {
    const secaoId = 123;
    store.getState.mockReturnValue({
      encaminhamentoAEE: {
        listaSecoesEmEdicao: [{ secaoId: 1 }],
      },
    });

    ServicoEncaminhamentoAEE.guardarSecaoEmEdicao(secaoId);

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: [{ secaoId: 1 }, { secaoId }],
      })
    );
  });

  it('guardarSecaoEmEdicao deve criar nova lista se listaSecoesEmEdicao vazia', () => {
    const secaoId = 50;
    store.getState.mockReturnValue({
      encaminhamentoAEE: {
        listaSecoesEmEdicao: [],
      },
    });

    ServicoEncaminhamentoAEE.guardarSecaoEmEdicao(secaoId);

    expect(store.dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: [{ secaoId }],
      })
    );
  });

  it('devolverEncaminhamentoAEE deve chamar api.post com params', async () => {
    api.post.mockResolvedValue({ status: 200 });
    const params = { id: 1, motivo: 'Motivo teste' };
    const resultado = await ServicoEncaminhamentoAEE.devolverEncaminhamentoAEE(params);
    expect(api.post).toHaveBeenCalledWith('v1/encaminhamento-aee/devolver', params);
    expect(resultado.status).toBe(200);
  });

  it('obterResponsaveisPAAIPesquisa deve montar params e chamar api.post', async () => {
    api.post.mockResolvedValue({ data: ['resp1'] });
    const resultado = await ServicoEncaminhamentoAEE.obterResponsaveisPAAIPesquisa('turma1', 'dre1', true);
    expect(api.post).toHaveBeenCalledWith('v1/encaminhamento-aee/responsavel/pesquisa', {
      limite: 999,
      codigoTurma: 'turma1',
      codigoDRE: 'dre1',
      ehRelatorio: true,
    });
    expect(resultado.data).toEqual(['resp1']);
  });

  it('obterResponsaveisPesquisa deve montar params e chamar api.post', async () => {
    api.post.mockResolvedValue({ data: ['resp2'] });
    const resultado = await ServicoEncaminhamentoAEE.obterResponsaveisPesquisa('turma1', 'dre1', 'ue1');
    expect(api.post).toHaveBeenCalledWith('v1/encaminhamento-aee/responsavel-plano/pesquisa', {
      limite: 999,
      codigoTurma: 'turma1',
      codigoDRE: 'dre1',
      codigoUE: 'ue1',
    });
    expect(resultado.data).toEqual(['resp2']);
  });

  it('gerarRelatorioEncaminhamentoAEE deve chamar api.post com params', async () => {
    api.post.mockResolvedValue({ data: 'relatorio' });
    const params = { param1: 'x' };
    const result = await ServicoEncaminhamentoAEE.gerarRelatorioEncaminhamentoAEE(params);
    expect(api.post).toHaveBeenCalledWith('v1/relatorios/encaminhamento-aee', params);
    expect(result.data).toBe('relatorio');
  });

  it('gerarRelatorio deve chamar api.post com params', async () => {
    api.post.mockResolvedValue({ data: 'relatorioDetalhado' });
    const params = { param2: 'y' };
    const result = await ServicoEncaminhamentoAEE.gerarRelatorio(params);
    expect(api.post).toHaveBeenCalledWith('v1/encaminhamento-aee/imprimir-detalhado', params);
    expect(result.data).toBe('relatorioDetalhado');
  });
});
describe('ServicoEncaminhamentoAEE - métodos simples', () => {
  afterEach(() => jest.clearAllMocks());

  it('deve chamar a API para excluir um encaminhamento', async () => {
    const id = 123;
    await ServicoEncaminhamentoAEE.excluirEncaminhamento(id);
    expect(api.delete).toHaveBeenCalledWith(`v1/encaminhamento-aee/${id}`);
  });

  it('deve chamar a API para verificar se pode cadastrar', async () => {
    const parametros = { estudanteCodigo: 1, ueCodigo: 2 };
    api.get.mockResolvedValue({ data: true });

    const resultado = await ServicoEncaminhamentoAEE.podeCadastrarEncaminhamentoEstudante(parametros);
    expect(api.get).toHaveBeenCalledWith(
      `v1/encaminhamento-aee/estudante/pode-cadastrar`,
      { params: parametros }
    );
    expect(resultado).toBe(true);
  });

  it('deve chamar a API para remover arquivo', async () => {
    const codigo = '456';
    await ServicoEncaminhamentoAEE.removerArquivo(codigo);
    expect(api.delete).toHaveBeenCalledWith(`v1/encaminhamento-aee/arquivo?arquivoCodigo=${codigo}`);
  });

  it('deve chamar a API para encerrar o encaminhamento', async () => {
    const resultado = await ServicoEncaminhamentoAEE.encerramentoEncaminhamentoAEE(1, 'Motivo');
    expect(api.post).toHaveBeenCalledWith(`v1/encaminhamento-aee/encerrar`, {
      encaminhamentoId: 1,
      motivoEncerramento: 'Motivo',
    });
  });

  it('deve chamar a API para enviar para análise', async () => {
    await ServicoEncaminhamentoAEE.enviarParaAnaliseEncaminhamento(99);
    expect(api.post).toHaveBeenCalledWith(`v1/encaminhamento-aee/enviar-analise/99`);
  });

  it('deve chamar a API para atribuir responsável', async () => {
    const rf = '123456';
    const id = 10;
    await ServicoEncaminhamentoAEE.atribuirResponsavelEncaminhamento(rf, id);
    expect(api.post).toHaveBeenCalledWith(`v1/encaminhamento-aee/atribuir-responsavel`, {
      rfResponsavel: rf,
      encaminhamentoId: id,
    });
  });

  it('deve chamar a API para concluir encaminhamento', async () => {
    await ServicoEncaminhamentoAEE.concluirEncaminhamento(33);
    expect(api.post).toHaveBeenCalledWith(`v1/encaminhamento-aee/concluir/33`);
  });

  it('deve chamar a API para remover responsável', async () => {
    await ServicoEncaminhamentoAEE.removerResponsavel(77);
    expect(api.post).toHaveBeenCalledWith(`v1/encaminhamento-aee/remover-responsavel/77`);
  });

  it('deve chamar a API para devolver encaminhamento', async () => {
    const params = { motivo: 'faltou dados' };
    await ServicoEncaminhamentoAEE.devolverEncaminhamentoAEE(params);
    expect(api.post).toHaveBeenCalledWith(`v1/encaminhamento-aee/devolver`, params);
  });

  it('deve guardar seção em edição', () => {
    store.getState.mockReturnValue({
      encaminhamentoAEE: {
        listaSecoesEmEdicao: [{ secaoId: 5 }],
      },
    });

    ServicoEncaminhamentoAEE.guardarSecaoEmEdicao(7);
    expect(store.dispatch).toHaveBeenCalledWith(
    expect.objectContaining({
        type: '@encaminhamentoAEE/setListaSecoesEmEdicao',
        payload: [{ secaoId: 5 }, { secaoId: 7 }],
    })
    );

  });

  it('deve chamar a API para obter responsáveis para PAAI', async () => {
    const result = await ServicoEncaminhamentoAEE.obterResponsaveisPAAIPesquisa(1, 2, true);
    expect(api.post).toHaveBeenCalledWith(`v1/encaminhamento-aee/responsavel/pesquisa`, {
      codigoTurma: 1,
      codigoDRE: 2,
      ehRelatorio: true,
      limite: 999,
    });
  });

  it('deve chamar a API para obter responsáveis para plano', async () => {
    const result = await ServicoEncaminhamentoAEE.obterResponsaveisPesquisa(1, 2, 3);
    expect(api.post).toHaveBeenCalledWith(`v1/encaminhamento-aee/responsavel-plano/pesquisa`, {
      codigoTurma: 1,
      codigoDRE: 2,
      codigoUE: 3,
      limite: 999,
    });
  });

  it('deve chamar a API para gerar relatório de encaminhamento', async () => {
    const params = { filtro: 'teste' };
    await ServicoEncaminhamentoAEE.gerarRelatorioEncaminhamentoAEE(params);
    expect(api.post).toHaveBeenCalledWith(`v1/relatorios/encaminhamento-aee`, params);
  });

  it('deve chamar a API para gerar relatório detalhado', async () => {
    const params = { outroFiltro: 'valor' };
    await ServicoEncaminhamentoAEE.gerarRelatorio(params);
    expect(api.post).toHaveBeenCalledWith(`v1/encaminhamento-aee/imprimir-detalhado`, params);
  });
});
