import ServicoHistoricoEscolar from './ServicoHistoricoEscolar';
import api from '~/servicos/api';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

describe('ServicoHistoricoEscolar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve gerar o histórico escolar com os parâmetros corretos', async () => {
    const params = { alunoId: 123, ano: 2024 };
    const responseMock = { data: 'relatorio.pdf' };
    api.post.mockResolvedValue(responseMock);

    const resultado = await ServicoHistoricoEscolar.gerar(params);

    expect(api.post).toHaveBeenCalledWith('/v1/historico-escolar/gerar', params);
    expect(resultado).toEqual(responseMock);
  });

  it('deve obter a observação complementar do aluno', async () => {
    const codigoAluno = 456;
    const responseMock = { data: 'Observação do aluno' };
    api.get.mockResolvedValue(responseMock);

    const resultado = await ServicoHistoricoEscolar.obterObservacaoComplementar(codigoAluno);

    expect(api.get).toHaveBeenCalledWith('/v1/historico-escolar/aluno/456/observacao-complementar');
    expect(resultado).toEqual(responseMock);
  });
});
