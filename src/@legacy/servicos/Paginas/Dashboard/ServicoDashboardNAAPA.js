import { OPCAO_TODOS } from '~/constantes';
import api from '~/servicos/api';

const URL_PADRAO = 'v1/dashboard/naapa';
class ServicoDashboardNAAPA {
  montarConsultaPadraoGraficos = params => {
    const {
      rota,
      consideraHistorico,
      anoLetivo,
      dreCodigo,
      ueCodigo,
      modalidade,
      semestre,
      mes,
    } = params;

    let url = `${URL_PADRAO}/${rota}?anoLetivo=${anoLetivo}&consideraHistorico=${consideraHistorico}`;

    if (dreCodigo) {
      url += `&dreCodigo=${dreCodigo}`;
    }
    if (ueCodigo) {
      url += `&ueCodigo=${ueCodigo}`;
    }
    if (modalidade) {
      url += `&modalidade=${modalidade}`;
    }
    if (semestre) {
      url += `&semestre=${semestre}`;
    }
    url += `&mes=${mes === OPCAO_TODOS ? 0 : mes}`;

    return api.get(url);
  };

  obterFrequenciaTurmaEvasaoAbaixo50Porcento = (
    consideraHistorico,
    anoLetivo,
    dreCodigo,
    ueCodigo,
    modalidade,
    semestre,
    mes
  ) => {
    return this.montarConsultaPadraoGraficos({
      rota: 'frequencia/turma/evasao/abaixo50porcento',
      consideraHistorico,
      anoLetivo,
      dreCodigo,
      ueCodigo,
      modalidade,
      semestre,
      mes,
    });
  };

  obterFrequenciaTurmaEvasaoSemPresenca = (
    consideraHistorico,
    anoLetivo,
    dreCodigo,
    ueCodigo,
    modalidade,
    semestre,
    mes
  ) => {
    return this.montarConsultaPadraoGraficos({
      rota: 'frequencia/turma/evasao/sempresenca',
      consideraHistorico,
      anoLetivo,
      dreCodigo,
      ueCodigo,
      modalidade,
      semestre,
      mes,
    });
  };

  obterQuantidadeEncaminhamentosNAAPA = (anoLetivo, dreId, modalidade) =>
    api.get(`${URL_PADRAO}/quantidade-em-aberto`, {
      params: { anoLetivo, dreId, modalidade },
    });

  obterQuantidadeEncaminhamentosNAAPASituacao = (
    anoLetivo,
    dreId,
    ueId,
    modalidade
  ) => {
    let url = `${URL_PADRAO}/frequencia/turma/encaminhamentosituacao?anoLetivo=${anoLetivo}`;

    if (dreId && dreId !== OPCAO_TODOS) {
      url += `&dreId=${dreId}`;
    }
    if (ueId && ueId !== OPCAO_TODOS) {
      url += `&ueId=${ueId}`;
    }
    if (modalidade && modalidade !== OPCAO_TODOS) {
      url += `&modalidade=${modalidade}`;
    }

    return api.get(url);
  };

  obterQuantidadeAtendimentoEncaminhamentosProfissional = (
    anoLetivo,
    dreId,
    ueId,
    modalidade,
    mes
  ) => {
    let url = `${URL_PADRAO}/quantidade-por-profissional-mes?anoLetivo=${anoLetivo}`;

    if (dreId && dreId !== OPCAO_TODOS) {
      url += `&dreId=${dreId}`;
    }

    if (ueId && ueId !== OPCAO_TODOS) {
      url += `&ueId=${ueId}`;
    }

    if (modalidade && modalidade !== OPCAO_TODOS) {
      url += `&modalidade=${modalidade}`;
    }

    if (mes && mes !== OPCAO_TODOS) {
      url += `&mes=${mes}`;
    }

    return api.get(url);
  };
}

export default new ServicoDashboardNAAPA();
