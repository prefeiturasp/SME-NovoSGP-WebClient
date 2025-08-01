import Servico from '~/servicos/Paginas/Dashboard/ServicoDashboardRelAcompanhamentoAprendizagem';
import api from '~/servicos/api';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
}));

describe('ServicoDashboardRelAcompanhamentoAprendizagem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve chamar a rota correta em obterTotalCriancasComAcompanhamentoAprendizagem', async () => {
    await Servico.obterTotalCriancasComAcompanhamentoAprendizagem(
      2025,
      1,
      2,
      1
    );

    expect(api.get).toHaveBeenCalledWith(
      'v1/dashboard/acompanhamento-aprendizagem/acompanhamento-aluno?anoLetivo=2025&dreId=1&ueId=2&semestre=1'
    );
  });

  it('deve chamar a rota correta em obterTotalCriancasComAcompPorDRE', async () => {
    await Servico.obterTotalCriancasComAcompPorDRE(2025, 2);

    expect(api.get).toHaveBeenCalledWith(
      'v1/dashboard/acompanhamento-aprendizagem/acompanhamento-aluno-dre?anoLetivo=2025&semestre=2'
    );
  });

  it('deve chamar a rota correta em obterUltimaConsolidacao', async () => {
    await Servico.obterUltimaConsolidacao(2025);

    expect(api.get).toHaveBeenCalledWith(
      'v1/dashboard/acompanhamento-aprendizagem/ultima-consolidacao?anoLetivo=2025'
    );
  });
});
