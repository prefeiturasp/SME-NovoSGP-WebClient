import ServicoAnotacaoFrequenciaAluno from './ServicoAnotacaoFrequenciaAluno';
import api from '~/servicos/api';
import { store } from '@/core/redux';
import { setListaPadraoMotivoAusencia } from '~/redux/modulos/modalAnotacaoFrequencia/actions';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

jest.mock('@/core/redux', () => ({
  store: {
    getState: jest.fn(),
    dispatch: jest.fn(),
  },
}));

jest.mock('~/redux/modulos/modalAnotacaoFrequencia/actions', () => ({
  setListaPadraoMotivoAusencia: jest.fn(data => ({ type: 'SET_LISTA', payload: data })),
}));

describe('ServicoAnotacaoFrequenciaAluno', () => {
  const alunoId = 123;
  const aulaId = 456;
  const anotacaoId = 789;
  const anotacaoParams = { id: anotacaoId, texto: 'Faltou por motivo de saúde' };
  const motivos = [{ id: 1, nome: 'Doença' }];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve chamar obterMotivosAusencia corretamente', () => {
    ServicoAnotacaoFrequenciaAluno.obterMotivosAusencia();
    expect(api.get).toHaveBeenCalledWith('/v1/anotacoes/alunos/motivos-ausencia');
  });

  it('deve chamar obterMotivosAusenciaRedux e despachar quando não houver lista', async () => {
    store.getState.mockReturnValue({
      modalAnotacaoFrequencia: {
        listaPadraoMotivoAusencia: [],
      },
    });

    api.get.mockResolvedValue({ data: motivos });

    await ServicoAnotacaoFrequenciaAluno.obterMotivosAusenciaRedux();

    expect(api.get).toHaveBeenCalledWith('/v1/anotacoes/alunos/motivos-ausencia');
    expect(store.dispatch).toHaveBeenCalledWith(setListaPadraoMotivoAusencia(motivos));
  });

  it('não deve chamar API nem dispatch se a lista de motivos já existir', async () => {
    store.getState.mockReturnValue({
      modalAnotacaoFrequencia: {
        listaPadraoMotivoAusencia: [{ id: 1, nome: 'Já carregado' }],
      },
    });

    await ServicoAnotacaoFrequenciaAluno.obterMotivosAusenciaRedux();

    expect(api.get).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it('deve chamar obterAnotacao corretamente', () => {
    ServicoAnotacaoFrequenciaAluno.obterAnotacao(alunoId, aulaId);
    expect(api.get).toHaveBeenCalledWith(`/v1/anotacoes/alunos/${alunoId}/aulas/${aulaId}`);
  });

  it('deve chamar obterAnotacaoPorId corretamente', () => {
    ServicoAnotacaoFrequenciaAluno.obterAnotacaoPorId(anotacaoId);
    expect(api.get).toHaveBeenCalledWith(`/v1/anotacoes/alunos/${anotacaoId}`);
  });

  it('deve chamar salvarAnotacao corretamente', () => {
    ServicoAnotacaoFrequenciaAluno.salvarAnotacao(anotacaoParams);
    expect(api.post).toHaveBeenCalledWith('/v1/anotacoes/alunos', anotacaoParams);
  });

  it('deve chamar alterarAnotacao corretamente', () => {
    ServicoAnotacaoFrequenciaAluno.alterarAnotacao(anotacaoParams);
    expect(api.put).toHaveBeenCalledWith(`/v1/anotacoes/alunos/${anotacaoId}`, anotacaoParams);
  });

  it('deve chamar deletarAnotacao corretamente', () => {
    ServicoAnotacaoFrequenciaAluno.deletarAnotacao(anotacaoId);
    expect(api.delete).toHaveBeenCalledWith(`/v1/anotacoes/alunos/${anotacaoId}`);
  });
});
