import ServicoDiarioBordo from './ServicoDiarioBordo';
import api from '~/servicos/api';
import { store } from '@/core/redux';
import { setDadosObservacoesUsuario } from '~/redux/modulos/observacoesUsuario/actions';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

jest.mock('@/core/redux', () => ({
  store: {
    getState: jest.fn(() => ({
      observacoesUsuario: {
        dadosObservacoes: [],
      },
    })),
    dispatch: jest.fn(),
  },
}));

jest.mock('~/redux/modulos/observacoesUsuario/actions', () => ({
  setDadosObservacoesUsuario: jest.fn(data => ({
    type: 'SET_OBS',
    payload: data,
  })),
}));

describe('ServicoDiarioBordo', () => {
  const id = 1;
  const dados = { observacao: 'Teste' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve obter dados de observações', () => {
    ServicoDiarioBordo.obterDadosObservacoes(id);
    expect(api.get).toHaveBeenCalledWith(`/v1/diarios-bordo/${id}/observacoes`);
  });

  it('deve salvar nova observação', () => {
    ServicoDiarioBordo.salvarEditarObservacao(id, dados);
    expect(api.post).toHaveBeenCalledWith(`/v1/diarios-bordo/${id}/observacoes`, dados);
  });

  it('deve editar observação existente', () => {
    const dadosEdit = { id: 2, observacao: 'Editado' };
    ServicoDiarioBordo.salvarEditarObservacao(id, dadosEdit);
    expect(api.put).toHaveBeenCalledWith(`/v1/diarios-bordo/observacoes/2`, dadosEdit);
  });

  it('deve atualizar e salvar dados observação nova', () => {
    const dadosAposSalvar = { id: 3 };
    ServicoDiarioBordo.atualizarSalvarEditarDadosObservacao(dados, dadosAposSalvar);
    expect(store.dispatch).toHaveBeenCalled();
    expect(setDadosObservacoesUsuario).toHaveBeenCalled();
  });

  it('deve excluir observação', () => {
    const dadosDel = { id: 4 };
    ServicoDiarioBordo.excluirObservacao(dadosDel);
    expect(api.delete).toHaveBeenCalledWith(`/v1/diarios-bordo/observacoes/4`);
  });

  it('deve excluir diário de bordo', () => {
    ServicoDiarioBordo.excluirDiarioBordo(id);
    expect(api.delete).toHaveBeenCalledWith(`/v1/diarios-bordo/${id}`);
  });

  it('deve retornar [] se aulaId ou componenteCurricularId forem inválidos', () => {
    const resultado = ServicoDiarioBordo.obterDiarioBordo(null, null);
    expect(resultado).toEqual([]);
  });

  it('deve obter diário de bordo se ids forem válidos', () => {
    ServicoDiarioBordo.obterDiarioBordo(1, 2);
    expect(api.get).toHaveBeenCalledWith(
      '/v1/diarios-bordo/1?componenteCurricularId=2'
    );
  });

  it('deve salvar novo diário de bordo', () => {
    ServicoDiarioBordo.salvarDiarioBordo(dados);
    expect(api.post).toHaveBeenCalledWith('/v1/diarios-bordo', dados);
  });

  it('deve editar diário de bordo existente', () => {
    ServicoDiarioBordo.salvarDiarioBordo(dados, 1);
    expect(api.put).toHaveBeenCalledWith('/v1/diarios-bordo', { ...dados, id: 1 });
  });

  it('deve obter diário bordo por data', () => {
    ServicoDiarioBordo.obterDiarioBordoPorData({
      turmaCodigo: 1,
      componenteCurricularId: 2,
      dataInicio: '2024-01-01',
      dataFim: '2024-01-31',
    });
    expect(api.get).toHaveBeenCalledWith(
      '/v1/diarios-bordo/turmas/1/componentes-curriculares/2/inicio/2024-01-01/fim/2024-01-31'
    );
  });

  it('deve chamar salvarDiarioBordoListao corretamente', () => {
    const params = { key: 'value' };
    ServicoDiarioBordo.salvarDiarioBordoListao(params);
    expect(api.post).toHaveBeenCalledWith('/v1/diarios-bordo/salvar', params);
  });
});
