import ServicoDevolutivas from './ServicoDevolutivas';
import api from '~/servicos/api';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
}));

describe('ServicoDevolutivas', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve chamar obterSugestaoDataInicio com a URL correta', () => {
    ServicoDevolutivas.obterSugestaoDataInicio(1, 2);
    expect(api.get).toHaveBeenCalledWith(
      '/v1/devolutivas/turmas/1/componentes-curriculares/2/sugestao'
    );
  });

  it('deve chamar salvarAlterarDevolutiva com POST quando id não é fornecido', () => {
    const params = { texto: 'Nova devolutiva' };
    ServicoDevolutivas.salvarAlterarDevolutiva(params);
    expect(api.post).toHaveBeenCalledWith('/v1/devolutivas', params);
  });

  it('deve chamar salvarAlterarDevolutiva com PUT quando id é fornecido', () => {
    const params = { texto: 'Alterando devolutiva' };
    ServicoDevolutivas.salvarAlterarDevolutiva(params, 10);
    expect(api.put).toHaveBeenCalledWith('/v1/devolutivas/10', params);
  });

  it('deve chamar deletarDevolutiva com a URL correta', () => {
    ServicoDevolutivas.deletarDevolutiva(5);
    expect(api.delete).toHaveBeenCalledWith('/v1/devolutivas/5');
  });

  it('deve chamar obterDevolutiva com a URL correta', () => {
    ServicoDevolutivas.obterDevolutiva(7);
    expect(api.get).toHaveBeenCalledWith('/v1/devolutivas/7');
  });

  it('deve chamar obterPeriodoDeDiasDevolutivaPorParametro com o ano letivo correto', () => {
    ServicoDevolutivas.obterPeriodoDeDiasDevolutivaPorParametro(2025);
    expect(api.get).toHaveBeenCalledWith('/v1/devolutivas/periodo-dias?anoLetivo=2025');
  });
});
