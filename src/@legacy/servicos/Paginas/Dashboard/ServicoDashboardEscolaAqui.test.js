import ServicoDashboardEscolaAqui from './ServicoDashboardEscolaAqui';
import api from '~/servicos/api';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
}));

describe('ServicoDashboardEscolaAqui', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('obterDadosGraficoAdesao com apenas codigoDre', () => {
    ServicoDashboardEscolaAqui.obterDadosGraficoAdesao('dre123');
    expect(api.get).toHaveBeenCalledWith(
      'v1/ea/dashboard/adesao?codigoDre=dre123'
    );
  });

  it('obterDadosGraficoAdesao com codigoDre e codigoUe', () => {
    ServicoDashboardEscolaAqui.obterDadosGraficoAdesao('dre123', 'ue456');
    expect(api.get).toHaveBeenCalledWith(
      'v1/ea/dashboard/adesao?codigoDre=dre123&codigoUe=ue456'
    );
  });

  it('obterDadosGraficoAdesaoAgrupados', () => {
    ServicoDashboardEscolaAqui.obterDadosGraficoAdesaoAgrupados();
    expect(api.get).toHaveBeenCalledWith(
      'v1/ea/dashboard/adesao/agrupados'
    );
  });

  it('obterUltimaAtualizacaoPorProcesso', () => {
    ServicoDashboardEscolaAqui.obterUltimaAtualizacaoPorProcesso('notificacao');
    expect(api.get).toHaveBeenCalledWith(
      'v1/ea/dashboard/ultimoProcessamento?nomeProcesso=notificacao'
    );
  });

  it('obterComunicadosTotaisSme', () => {
    ServicoDashboardEscolaAqui.obterComunicadosTotaisSme('dre1', 'ue2', 2025);
    expect(api.get).toHaveBeenCalledWith(
      'v1/ea/dashboard/comunicados/totais?anoLetivo=2025&codigoDre=dre1&codigoUe=ue2'
    );
  });

  it('obterComunicadosTotaisAgrupadosPorDre', () => {
    ServicoDashboardEscolaAqui.obterComunicadosTotaisAgrupadosPorDre(2024);
    expect(api.get).toHaveBeenCalledWith(
      'v1/ea/dashboard/comunicados/totais/agrupados?anoLetivo=2024'
    );
  });

  it('obterComunicadosAutoComplete com parâmetros mínimos', () => {
    const dataInicial = { format: () => '2025-01-01' };
    const dataFinal = { format: () => '2025-01-31' };

    ServicoDashboardEscolaAqui.obterComunicadosAutoComplete(
      2025,
      'dre',
      'ue',
      'modal',
      1,
      5,
      'turma1',
      dataInicial,
      dataFinal,
      'desc'
    );

    expect(api.get).toHaveBeenCalledWith(
      'v1/ea/dashboard/comunicados/filtro?anoLetivo=2025&codigoDre=dre&codigoUe=ue&descricao=desc&modalidades=modal&semestre=1&anoEscolar=5&codigoTurma=turma1&dataEnvioInicial=2025-01-01&dataEnvioFinal=2025-01-31'
    );
  });

  it('obterDadosDeLeituraDeComunicados', () => {
    ServicoDashboardEscolaAqui.obterDadosDeLeituraDeComunicados('dre', 'ue', 10, true, 1);
    expect(api.get).toHaveBeenCalledWith(
      'v1/ea/dashboard/comunicados/leitura?codigoDre=dre&codigoUe=ue&notificacaoId=10&agruparModalidade=true&modoVisualizacao=1'
    );
  });

  it('obterDadosDeLeituraDeComunicadosAgrupadosPorDre', () => {
    ServicoDashboardEscolaAqui.obterDadosDeLeituraDeComunicadosAgrupadosPorDre(42, 0);
    expect(api.get).toHaveBeenCalledWith(
      'v1/ea/dashboard/comunicados/leitura/agrupados?notificacaoId=42&modoVisualizacao=0'
    );
  });

  it('obterDadosDeLeituraDeComunicadosPorModalidades com ambos códigos', () => {
    ServicoDashboardEscolaAqui.obterDadosDeLeituraDeComunicadosPorModalidades(
      'dre',
      'ue',
      999,
      1
    );
    expect(api.get).toHaveBeenCalledWith(
      'v1/ea/dashboard/comunicados/leitura/modalidades?notificacaoId=999&modoVisualizacao=1&codigoDre=dre&codigoUe=ue'
    );
  });

  it('obterDadosDeLeituraDeComunicadosPorModalidadeETurmas', () => {
    ServicoDashboardEscolaAqui.obterDadosDeLeituraDeComunicadosPorModalidadeETurmas(
      'dre',
      'ue',
      11,
      0,
      ['1', '2'],
      ['t1', 't2']
    );
    expect(api.get).toHaveBeenCalledWith(
      'v1/ea/dashboard/comunicados/leitura/turmas?codigoDre=dre&codigoUe=ue&notificacaoId=11&modoVisualizacao=0&modalidades=1&modalidades=2&codigosTurmas=t1&codigosTurmas=t2'
    );
  });

  it('obterDadosLeituraDeComunicadosPorAlunos', () => {
    ServicoDashboardEscolaAqui.obterDadosLeituraDeComunicadosPorAlunos('turmaX', 88);
    expect(api.get).toHaveBeenCalledWith(
      'v1/ea/dashboard/comunicados/leitura/alunos?codigoTurma=turmaX&comunicadoId=88'
    );
  });
});
