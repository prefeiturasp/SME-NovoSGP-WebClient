import moment from 'moment';
import api from '~/servicos/api';

const urlPadrao = 'v1/periodo-escolar';

class ServicoPeriodoEscolar {
  obterPeriodosAbertos = async (turma, dataReferencia = null) => {
    let url = `v1/periodo-escolar/turmas/${turma}/bimestres/aberto`;
    if (dataReferencia) {
      dataReferencia = moment(dataReferencia).format('YYYY-MM-DD');
      url = `${url}?dataReferencia=${dataReferencia}`;
    }
    return api.get(url);
  };

  obterPeriodosPorAnoLetivoModalidade = async (
    modalidade,
    anoLetivo,
    semestre
  ) => {
    const url = `v1/periodo-escolar/modalidades/${modalidade}/ano-letivo/${anoLetivo}/bimestres`;
    return api.get(url, { params: { semestre } });
  };

  obterBimestresPorTurmaId = turmaId => {
    return api.get(`v1/periodo-escolar/turmas/${turmaId}`);
  };

  obterBimestreAtualPorTurmaId = turmaId => {
    return api.get(`v1/periodo-escolar/turmas/${turmaId}/bimestres/atual`);
  };

  obterPeriodoLetivoTurma = async codigoTurma => {
    const url = `v1/periodo-escolar/turmas/${codigoTurma}/periodo-letivo`;
    return api.get(url);
  };

  obterPeriodoPorComponente = (
    turmaCodigo,
    codigoComponenteCurricular,
    ehRegencia,
    bimestre,
    exibirDataFutura = false
  ) => {
    let url = `${urlPadrao}/turmas/${turmaCodigo}/componentes-curriculares/${codigoComponenteCurricular}/regencia/${ehRegencia}/bimestres/${bimestre}`;
    if (exibirDataFutura) {
      url += `?exibirDataFutura=${exibirDataFutura}`;
    }
    return api.get(url);
  };
}

export default new ServicoPeriodoEscolar();
