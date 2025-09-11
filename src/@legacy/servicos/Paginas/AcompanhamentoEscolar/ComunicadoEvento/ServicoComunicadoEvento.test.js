import ServicoComunicadoEvento from './ServicoComunicadoEvento';
import api from '~/servicos/api';

jest.mock('~/servicos/api', () => ({
  post: jest.fn(),
}));

describe('ServicoComunicadoEvento', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve chamar api.post com os parâmetros corretos', async () => {
    const parametros = { tipo: 'aviso', ativo: true };
    const retornoMockado = { data: ['evento1', 'evento2'] };

    api.post.mockResolvedValue(retornoMockado);

    const resultado = await ServicoComunicadoEvento.listarPor(parametros);

    expect(api.post).toHaveBeenCalledWith(
      'v1/comunicados/eventos',
      parametros
    );
    expect(resultado).toEqual(retornoMockado);
  });
});
