import { OPCAO_TODOS } from '~/constantes';
import api from '~/servicos/api';

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

    let url = `v1/dashboard/naapa/${rota}?anoLetivo=${anoLetivo}&&consideraHistorico=${consideraHistorico}`;

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
}

export default new ServicoDashboardNAAPA();
