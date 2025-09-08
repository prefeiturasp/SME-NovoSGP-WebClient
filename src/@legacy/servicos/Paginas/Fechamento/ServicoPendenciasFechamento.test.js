import ServicoPendenciasFechamento from './ServicoPendenciasFechamento';
import api from '~/servicos/api';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

describe('ServicoPendenciasFechamento', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve chamar obterPorId corretamente', async () => {
    await ServicoPendenciasFechamento.obterPorId(123);

    expect(api.get).toHaveBeenCalledWith('/v1/fechamentos/pendencias/123');
  });

  it('deve chamar aprovar corretamente', async () => {
    const ids = [1, 2, 3];
    await ServicoPendenciasFechamento.aprovar(ids);

    expect(api.post).toHaveBeenCalledWith('/v1/fechamentos/pendencias/aprovar', ids);
  });
});
