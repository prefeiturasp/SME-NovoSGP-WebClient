import api from '~/servicos/api';
import { OPCAO_TODOS } from '~/constantes';
import ServicoDashboardNAAPA from '~/servicos/Paginas/Dashboard/ServicoDashboardNAAPA';

jest.mock('~/servicos/api', () => ({
  get: jest.fn(),
}));

describe('ServicoDashboardNAAPA', () => {
  const anoLetivo = 2025;
  const dreCodigo = 'dre123';
  const ueCodigo = 'ue456';
  const modalidade = 3;
  const semestre = 1;
  const mes = 5;
  const consideraHistorico = true;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve montar corretamente a URL para evasão abaixo de 50%', () => {
    ServicoDashboardNAAPA.obterFrequenciaTurmaEvasaoAbaixo50Porcento(
      consideraHistorico,
      anoLetivo,
      dreCodigo,
      ueCodigo,
      modalidade,
      semestre,
      mes
    );

    expect(api.get).toHaveBeenCalledWith(
      expect.stringContaining('frequencia/turma/evasao/abaixo50porcento')
    );
    expect(api.get).toHaveBeenCalledWith(
      expect.stringContaining(`anoLetivo=${anoLetivo}`)
    );
    expect(api.get).toHaveBeenCalledWith(
      expect.stringContaining(`mes=${mes}`)
    );
  });

  it('deve montar corretamente a URL para evasão sem presença', () => {
    ServicoDashboardNAAPA.obterFrequenciaTurmaEvasaoSemPresenca(
      consideraHistorico,
      anoLetivo,
      dreCodigo,
      ueCodigo,
      modalidade,
      semestre,
      OPCAO_TODOS
    );

    expect(api.get).toHaveBeenCalledWith(
      expect.stringContaining('frequencia/turma/evasao/sempresenca')
    );
    expect(api.get).toHaveBeenCalledWith(expect.stringContaining('mes=0'));
  });

  it('deve chamar corretamente a API em obterQuantidadeEncaminhamentosNAAPA', () => {
    ServicoDashboardNAAPA.obterQuantidadeEncaminhamentosNAAPA(
      anoLetivo,
      dreCodigo,
      modalidade
    );

    expect(api.get).toHaveBeenCalledWith(
      'v1/dashboard/naapa/quantidade-em-aberto',
      {
        params: { anoLetivo, dreId: dreCodigo, modalidade },
      }
    );
  });

  it('deve montar corretamente a URL em obterQuantidadeEncaminhamentosNAAPASituacao', () => {
    ServicoDashboardNAAPA.obterQuantidadeEncaminhamentosNAAPASituacao(
      anoLetivo,
      dreCodigo,
      ueCodigo,
      modalidade
    );

    expect(api.get).toHaveBeenCalledWith(
      expect.stringContaining('frequencia/turma/encaminhamentosituacao')
    );
    expect(api.get).toHaveBeenCalledWith(
      expect.stringContaining(`anoLetivo=${anoLetivo}`)
    );
    expect(api.get).toHaveBeenCalledWith(
      expect.stringContaining(`dreId=${dreCodigo}`)
    );
    expect(api.get).toHaveBeenCalledWith(
      expect.stringContaining(`ueId=${ueCodigo}`)
    );
    expect(api.get).toHaveBeenCalledWith(
      expect.stringContaining(`modalidade=${modalidade}`)
    );
  });

  it('deve montar corretamente a URL em obterQuantidadeAtendimentoEncaminhamentosProfissional', () => {
    ServicoDashboardNAAPA.obterQuantidadeAtendimentoEncaminhamentosProfissional(
      anoLetivo,
      dreCodigo,
      ueCodigo,
      modalidade,
      mes
    );

    expect(api.get).toHaveBeenCalledWith(
      expect.stringContaining('quantidade-por-profissional-mes')
    );
    expect(api.get).toHaveBeenCalledWith(
      expect.stringContaining(`anoLetivo=${anoLetivo}`)
    );
    expect(api.get).toHaveBeenCalledWith(
      expect.stringContaining(`dreId=${dreCodigo}`)
    );
    expect(api.get).toHaveBeenCalledWith(
      expect.stringContaining(`ueId=${ueCodigo}`)
    );
    expect(api.get).toHaveBeenCalledWith(
      expect.stringContaining(`modalidade=${modalidade}`)
    );
    expect(api.get).toHaveBeenCalledWith(
      expect.stringContaining(`mes=${mes}`)
    );
  });

  it('deve ignorar parâmetros que são OPCAO_TODOS em obterQuantidadeAtendimentoEncaminhamentosProfissional', () => {
  ServicoDashboardNAAPA.obterQuantidadeAtendimentoEncaminhamentosProfissional(
    anoLetivo,
    OPCAO_TODOS,
    OPCAO_TODOS,
    OPCAO_TODOS,
    OPCAO_TODOS
  );

  const chamada = api.get.mock.calls[0][0];

  expect(chamada).toContain('quantidade-por-profissional-mes');
  expect(chamada).not.toMatch(/[\?&]mes=/);
  expect(chamada).not.toMatch(/[\?&]dreId=/);
  expect(chamada).not.toMatch(/[\?&]ueId=/);
  expect(chamada).not.toMatch(/[\?&]modalidade=/);
});

});
