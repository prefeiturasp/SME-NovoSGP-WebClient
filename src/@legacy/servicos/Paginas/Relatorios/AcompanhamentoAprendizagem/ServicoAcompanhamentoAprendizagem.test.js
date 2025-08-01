import ServicoAcompanhamentoAprendizagem from './ServicoAcompanhamentoAprendizagem';
import api from '~/servicos/api';
import { store } from '@/core/redux';
import * as alertas from '~/servicos/alertas';
import * as actions from '~/redux/modulos/acompanhamentoAprendizagem/actions';
import * as registroIndividualActions from '~/redux/modulos/registroIndividual/actions';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

jest.mock('@/core/redux', () => ({
  store: {
    dispatch: jest.fn(),
    getState: jest.fn(() => ({
      acompanhamentoAprendizagem: {
        dadosAcompanhamentoAprendizagem: {},
        acompanhamentoAprendizagemEmEdicao: false,
        desabilitarCamposAcompanhamentoAprendizagem: false,
        dadosAlunoObjectCard: { codigoEOL: '123' },
        dadosApanhadoGeral: {},
        apanhadoGeralEmEdicao: false,
      },
      usuario: {
        turmaSelecionada: { id: 999 },
      },
    })),
  },
}));

jest.mock('~/servicos/alertas', () => ({
  erro: jest.fn(),
  erros: jest.fn(),
  sucesso: jest.fn(),
}));

jest.mock('~/redux/modulos/acompanhamentoAprendizagem/actions', () => ({
  setAcompanhamentoAprendizagemEmEdicao: jest.fn(() => ({ type: 'setAcompanhamentoAprendizagemEmEdicao' })),
  setApanhadoGeralEmEdicao: jest.fn(() => ({ type: 'setApanhadoGeralEmEdicao' })),
  setDadosAcompanhamentoAprendizagem: jest.fn(() => ({ type: 'setDadosAcompanhamentoAprendizagem' })),
  setDadosApanhadoGeral: jest.fn(() => ({ type: 'setDadosApanhadoGeral' })),
  setErrosAcompanhamentoAprendizagem: jest.fn(() => ({ type: 'setErrosAcompanhamentoAprendizagem' })),
  setExibirLoaderGeralAcompanhamentoAprendizagem: jest.fn(() => ({ type: 'setExibirLoaderGeralAcompanhamentoAprendizagem' })),
  setExibirModalErrosAcompanhamentoAprendizagem: jest.fn(() => ({ type: 'setExibirModalErrosAcompanhamentoAprendizagem' })),
  setQtdMaxImagensCampoPercursoColetivo: jest.fn(() => ({ type: 'setQtdMaxImagensCampoPercursoColetivo' })),
  setQtdMaxImagensCampoPercursoIndividual: jest.fn(() => ({ type: 'setQtdMaxImagensCampoPercursoIndividual' })),
}));

jest.mock('~/redux/modulos/registroIndividual/actions', () => ({
  limparDadosRegistroIndividual: jest.fn(() => ({ type: 'limparDadosRegistroIndividual' })),
}));

describe('ServicoAcompanhamentoAprendizagem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('obterListaAlunos deve chamar api.get com a url correta', async () => {
    api.get.mockResolvedValue({ data: ['aluno1', 'aluno2'] });
    const turmaCodigo = 'turma1';
    const anoLetivo = 2023;
    const periodo = 1;
    const resultado = await ServicoAcompanhamentoAprendizagem.obterListaAlunos(turmaCodigo, anoLetivo, periodo);
    expect(api.get).toHaveBeenCalledWith(`v1/fechamentos/turmas/${turmaCodigo}/alunos/anos/${anoLetivo}/semestres/${periodo}`);
    expect(resultado).toEqual({ data: ['aluno1', 'aluno2'] });
  });

  it('obterListaSemestres deve retornar a lista correta', async () => {
    const resultado = await ServicoAcompanhamentoAprendizagem.obterListaSemestres();
    expect(resultado.data).toHaveLength(2);
    expect(resultado.data[0]).toHaveProperty('semestre', '1');
  });

  it('obterAcompanhamentoEstudante deve fazer dispatch e atualizar estado', async () => {
    const mockData = { campo: 'valor' };
    api.get.mockResolvedValue({ data: mockData });

    const turmaId = 1;
    const alunoId = 2;
    const semestre = 1;
    const componenteCurricularId = 3;

    const retorno = await ServicoAcompanhamentoAprendizagem.obterAcompanhamentoEstudante(turmaId, alunoId, semestre, componenteCurricularId);

    const { dispatch } = store;
    expect(dispatch).toHaveBeenCalledWith(actions.setExibirLoaderGeralAcompanhamentoAprendizagem(true));
    expect(dispatch).toHaveBeenCalledWith(registroIndividualActions.limparDadosRegistroIndividual());
    expect(dispatch).toHaveBeenCalledWith(actions.setDadosAcompanhamentoAprendizagem({}));
    expect(api.get).toHaveBeenCalledWith(
      `/v1/acompanhamento/alunos?turmaId=${turmaId}&alunoId=${alunoId}&semestre=${semestre}&componenteCurricularId=${componenteCurricularId}`
    );
    expect(dispatch).toHaveBeenCalledWith(actions.setDadosAcompanhamentoAprendizagem(mockData));
    expect(dispatch).toHaveBeenCalledWith(actions.setExibirLoaderGeralAcompanhamentoAprendizagem(false));
    expect(retorno).toEqual(mockData);
  });

  it('salvarDadosAcompanhamentoAprendizagem deve validar campo percursoIndividual e salvar', async () => {
    const params = {
      acompanhamentoAlunoId: 10,
      acompanhamentoAlunoSemestreId: 20,
      turmaId: 999,
      semestre: 1,
      alunoCodigo: '123',
      observacoes: '',
      percursoIndividual: 'Percurso Teste',
      textoSugerido: '',
    };

    store.getState.mockReturnValue({
      acompanhamentoAprendizagem: {
        dadosAcompanhamentoAprendizagem: {
          ...params,
          percursoIndividual: 'Percurso Teste',
        },
        acompanhamentoAprendizagemEmEdicao: true,
        desabilitarCamposAcompanhamentoAprendizagem: false,
        dadosAlunoObjectCard: { codigoEOL: '123' },
      },
      usuario: { turmaSelecionada: { id: 999 } },
    });

    api.post.mockResolvedValue({ status: 200, data: { auditoria: {}, acompanhamentoAlunoId: 10, acompanhamentoAlunoSemestreId: 20 } });

    const result = await ServicoAcompanhamentoAprendizagem.salvarDadosAcompanhamentoAprendizagem(1);

    expect(api.post).toHaveBeenCalledWith(
      '/v1/acompanhamento/alunos/semestres',
      expect.objectContaining({
        percursoIndividual: 'Percurso Teste',
      })
    );
    expect(alertas.sucesso).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('salvarDadosAcompanhamentoAprendizagem deve retornar false se percursoIndividual for vazio', async () => {
    store.getState.mockReturnValue({
      acompanhamentoAprendizagem: {
        dadosAcompanhamentoAprendizagem: { percursoIndividual: '' },
        acompanhamentoAprendizagemEmEdicao: true,
        desabilitarCamposAcompanhamentoAprendizagem: false,
        dadosAlunoObjectCard: { codigoEOL: '123' },
      },
      usuario: { turmaSelecionada: { id: 999 } },
    });

    const result = await ServicoAcompanhamentoAprendizagem.salvarDadosAcompanhamentoAprendizagem(1);

    expect(store.dispatch).toHaveBeenCalledWith(
    actions.setErrosAcompanhamentoAprendizagem([
        'Campo percurso individual é obrigatório',
    ])
    );
    expect(store.dispatch).toHaveBeenCalledWith(
    actions.setExibirModalErrosAcompanhamentoAprendizagem(true)
    );
    expect(result).toBe(false);
  });

  it('atualizarDadosPorNomeCampo deve atualizar o estado com novo valor', () => {
    const estadoInicial = { campoTeste: 'valorAntigo' };
    store.getState.mockReturnValue({
      acompanhamentoAprendizagem: {
        dadosAcompanhamentoAprendizagem: { ...estadoInicial },
      },
    });
    ServicoAcompanhamentoAprendizagem.atualizarDadosPorNomeCampo('novoValor', 'campoTeste');
    expect(store.dispatch).toHaveBeenCalledWith(
      actions.setDadosAcompanhamentoAprendizagem({
        ...estadoInicial,
        campoTeste: 'novoValor',
      })
    );
  });

  it('obterQtdMaxImagensCampos deve disparar dispatch correto', async () => {
    api.get.mockResolvedValue({
      data: {
        quantidadeImagemPercursoColetivo: 3,
        quantidadeImagemPercursoIndividual: 4,
      },
    });
    await ServicoAcompanhamentoAprendizagem.obterQtdMaxImagensCampos(2023);
    expect(store.dispatch).toHaveBeenCalledWith(actions.setQtdMaxImagensCampoPercursoColetivo(3));
    expect(store.dispatch).toHaveBeenCalledWith(actions.setQtdMaxImagensCampoPercursoIndividual(4));
  });

  it('obterQtdMaxImagensCampos deve despachar valores padrão quando não há dados', async () => {
    api.get.mockResolvedValue({});
    await ServicoAcompanhamentoAprendizagem.obterQtdMaxImagensCampos(2023);
    expect(store.dispatch).toHaveBeenCalledWith(actions.setQtdMaxImagensCampoPercursoColetivo());
    expect(store.dispatch).toHaveBeenCalledWith(actions.setQtdMaxImagensCampoPercursoIndividual());
  });

  it('salvarApanhadoGeral deve chamar api.post com parametros corretos e retornar resultado', async () => {
    const params = { turmaId: 1, semestre: 2, apanhadoGeral: 'texto', acompanhamentoTurmaId: 3 };
    api.post.mockResolvedValue({ status: 200, data: { id: 3, apanhadoGeral: 'texto' } });

    const resultado = await ServicoAcompanhamentoAprendizagem.salvarApanhadoGeral(params);

    expect(api.post).toHaveBeenCalledWith('v1/acompanhamento/turmas', params);
    expect(resultado).toEqual({ status: 200, data: { id: 3, apanhadoGeral: 'texto' } });
  });

  it('salvarDadosApanhadoGeral deve salvar dados corretamente e disparar ações', async () => {
    const paramsApanhado = {
      turmaId: 999,
      semestre: 1,
      apanhadoGeral: 'Texto Coletivo',
      acompanhamentoTurmaId: 0,
    };

    store.getState.mockReturnValue({
      acompanhamentoAprendizagem: {
        dadosApanhadoGeral: { ...paramsApanhado },
        desabilitarCamposAcompanhamentoAprendizagem: false,
        apanhadoGeralEmEdicao: true,
      },
      usuario: { turmaSelecionada: { id: 999 } },
    });

    api.post.mockResolvedValue({
      status: 200,
      data: { id: 1, apanhadoGeral: 'Texto Coletivo' },
    });

    const result = await ServicoAcompanhamentoAprendizagem.salvarDadosApanhadoGeral(1);

    expect(api.post).toHaveBeenCalledWith('v1/acompanhamento/turmas', expect.any(Object));
    expect(alertas.sucesso).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('salvarDadosApanhadoGeral deve retornar false e mostrar erro se apanhadoGeral vazio', async () => {
    store.getState.mockReturnValue({
      acompanhamentoAprendizagem: {
        dadosApanhadoGeral: { apanhadoGeral: '' },
        desabilitarCamposAcompanhamentoAprendizagem: false,
        apanhadoGeralEmEdicao: true,
      },
      usuario: { turmaSelecionada: { id: 999 } },
    });

    const result = await ServicoAcompanhamentoAprendizagem.salvarDadosApanhadoGeral(1);

    expect(alertas.erro).toHaveBeenCalledWith('Percurso coletivo da turma é obrigatório');
    expect(result).toBe(false);
  });

  it('obterDadosApanhadoGeral deve disparar dispatch correto com dados', async () => {
    const mockData = { apanhadoGeral: 'Texto de teste' };
    api.get.mockResolvedValue({ data: mockData });

    store.getState.mockReturnValue({});

    await ServicoAcompanhamentoAprendizagem.obterDadosApanhadoGeral(123, 1);

    expect(store.dispatch).toHaveBeenCalledWith(actions.setExibirLoaderGeralAcompanhamentoAprendizagem(true));
    expect(store.dispatch).toHaveBeenCalledWith(actions.setDadosApanhadoGeral({}));
    expect(api.get).toHaveBeenCalledWith('v1/acompanhamento/turmas/apanhado-geral?turmaId=123&semestre=1');
    expect(store.dispatch).toHaveBeenCalledWith(actions.setDadosApanhadoGeral(mockData));
    expect(store.dispatch).toHaveBeenCalledWith(actions.setExibirLoaderGeralAcompanhamentoAprendizagem(false));
  });

  it('excluirFotos deve chamar api.delete com url correta', async () => {
    const acompanhamentoAlunoSemestreId = 1;
    const codigoFoto = 2;
    api.delete.mockResolvedValue({ status: 204 });

    const result = await ServicoAcompanhamentoAprendizagem.excluirFotos(acompanhamentoAlunoSemestreId, codigoFoto);

    expect(api.delete).toHaveBeenCalledWith(
      `/v1/acompanhamento/alunos/semestres/${acompanhamentoAlunoSemestreId}/fotos/${codigoFoto}`
    );
    expect(result).toEqual({ status: 204 });
  });
});

  