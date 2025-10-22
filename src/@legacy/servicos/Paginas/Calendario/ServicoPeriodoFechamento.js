import moment from 'moment';
import api from '~/servicos/api';

class ServicoPeriodoFechamento {
  obterPorTipoCalendario = (tipoCalendarioSelecionado, aplicacao) => {
    console.log(aplicacao);
    return api.get(
      `/v1/periodos/fechamentos/aberturas?tipoCalendarioId=${tipoCalendarioSelecionado}&aplicacao=${aplicacao}`
    );
  };

  salvar = async fechamento => {
    return api.post('/v1/periodos/fechamentos/aberturas', fechamento);
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
