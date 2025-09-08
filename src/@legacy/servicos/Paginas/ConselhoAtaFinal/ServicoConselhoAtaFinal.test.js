import ServicoConselhoAtaFinal from './ServicoConselhoAtaFinal';
import api from '~/servicos/api';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  delete: jest.fn(),
}));

describe('ServicoConselhoAtaFinal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve chamar api.post com a URL correta e os dados informados', async () => {
    const dadosMock = { turmaId: 123, anoLetivo: 2025 };
    const respostaMock = { data: 'arquivo-gerado.pdf' };
    api.post.mockResolvedValue(respostaMock);

    const resposta = await ServicoConselhoAtaFinal.gerar(dadosMock);

    expect(api.post).toHaveBeenCalledWith(
      'v1/relatorios/conselhos-classe/atas-finais',
      dadosMock
    );
    expect(resposta).toEqual(respostaMock);
  });
});
