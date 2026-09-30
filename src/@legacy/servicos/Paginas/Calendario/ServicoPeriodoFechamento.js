import moment from 'moment';
import api from '~/servicos/api';
import { Aplicacao } from '~/constantes';

class ServicoPeriodoFechamento {
  obterPorTipoCalendario = tipoCalendarioSelecionado => {
    return api.get(
      `/v1/periodos/fechamentos/aberturas?tipoCalendarioId=${tipoCalendarioSelecionado}&aplicacao=${Aplicacao.SGP}`
    );
  };

  salvar = async fechamento => {
    return api.post('/v1/periodos/fechamentos/aberturas', {
      ...fechamento,
      aplicacao: Aplicacao.SGP,
    });
  };

  verificarSePodeAlterarNoPeriodo = async (
    turmaCodigo,
    bimestre,
    dataReferencia = ''
  ) => {
    let url = `/v1/periodo-escolar/bimestres/${bimestre}/turmas/${turmaCodigo}/aberto`;
    if (dataReferencia) {
      dataReferencia = moment(dataReferencia).format('YYYY-MM-DD');
      url = `${url}?dataReferencia=${dataReferencia}`;
    }
    return api.get(url);
  };
}

export default new ServicoPeriodoFechamento();
