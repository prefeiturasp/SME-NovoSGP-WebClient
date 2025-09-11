import api from '~/servicos/api';
import ServicoDashboardInformacoesEscolares from '~/servicos/Paginas/Dashboard/ServicoDashboardInformacoesEscolares';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
}));

describe('ServicoDashboardInformacoesEscolares', () => {
  const anoLetivo = 2025;
  const dreId = 'dre-123';
  const ueId = 'ue-456';
  const modalidade = 3;
  const anosEscolares = [1, 2, 3];

  beforeEach(() => {
    api.get.mockClear();
  });

  it('deve chamar a API corretamente em obterQuantidadeTurmasPorAno', () => {
    ServicoDashboardInformacoesEscolares.obterQuantidadeTurmasPorAno(
      anoLetivo,
      dreId,
      ueId,
      modalidade,
      anosEscolares
    );

    expect(api.get).toHaveBeenCalledWith(
      expect.stringContaining('v1/dashboard/informacoes-escolares/turmas')
    );
    expect(api.get).toHaveBeenCalledWith(
      expect.stringContaining('anoLetivo=2025')
    );
    expect(api.get).toHaveBeenCalledWith(
      expect.stringContaining('dreId=dre-123')
    );
    expect(api.get).toHaveBeenCalledWith(
      expect.stringContaining('ueId=ue-456')
    );
    expect(api.get).toHaveBeenCalledWith(
      expect.stringContaining('modalidade=3')
    );
    expect(api.get).toHaveBeenCalledWith(
      expect.stringContaining('anos=1&anos=2&anos=3')
    );
  });

  it('deve chamar a API corretamente em obterQuantidadeMatriculasPorAno', () => {
    ServicoDashboardInformacoesEscolares.obterQuantidadeMatriculasPorAno(
      anoLetivo,
      dreId,
      ueId,
      modalidade,
      anosEscolares
    );

    expect(api.get).toHaveBeenCalledWith(
      expect.stringContaining('/matriculas?anoLetivo=2025')
    );
  });

  it('deve chamar a API corretamente em obterUltimaConsolidacao', () => {
    ServicoDashboardInformacoesEscolares.obterUltimaConsolidacao(anoLetivo);

    expect(api.get).toHaveBeenCalledWith(
      'v1/dashboard/informacoes-escolares/ultima-consolidacao?anoLetivo=2025'
    );
  });

  it('deve chamar a API corretamente em obterAnosEscolaresPorModalidade', () => {
    ServicoDashboardInformacoesEscolares.obterAnosEscolaresPorModalidade(
      anoLetivo,
      dreId,
      ueId,
      modalidade
    );

    expect(api.get).toHaveBeenCalledWith(
      expect.stringContaining('/modalidades/anos?anoLetivo=2025')
    );
    expect(api.get).toHaveBeenCalledWith(expect.stringContaining('dreId=dre-123'));
    expect(api.get).toHaveBeenCalledWith(expect.stringContaining('modalidade=3'));
  });
});
