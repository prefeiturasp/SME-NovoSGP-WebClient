import { store } from '@/core/redux';
import {
  setExibirLoaderFrequenciaPlanoAula,
  setListaDadosFrequencia,
  setTemEstudanteAlteradoComCompensacao,
  setTemPeriodoAbertoFrequenciaPlanoAula,
} from '~/redux/modulos/frequenciaPlanoAula/actions';
import { erros } from '~/servicos/alertas';
import api from '~/servicos/api';

const urlPadrao = '/v1/calendarios';

class ServicoFrequencia {
  obterDisciplinas = turmaId => {
    const url = `v1/calendarios/frequencias/turmas/${turmaId}/disciplinas`;
    return api.get(url);
  };

  obterDatasDeAulasPorCalendarioTurmaEComponenteCurricular = (
    turmaId,
    componenteCurricular
  ) => {
    const url = `${urlPadrao}/frequencias/aulas/datas/turmas/${turmaId}/componente/${componenteCurricular}`;
    return api.get(url);
  };

  obterListaFrequencia = async () => {
    const { dispatch } = store;
    const state = store.getState();

    const { frequenciaPlanoAula, usuario } = state;

    const { aulaId, componenteCurricular } = frequenciaPlanoAula;

    const { turmaSelecionada } = usuario;

    if (aulaId) {
      dispatch(setTemEstudanteAlteradoComCompensacao(false));
      dispatch(setExibirLoaderFrequenciaPlanoAula(true));
      const frequenciaAlunos = await api
        .get(`v1/calendarios/frequencias`, {
          params: {
            aulaId,
            componenteCurricularId:
              componenteCurricular.id > 0
                ? componenteCurricular.id
                : componenteCurricular.codigoComponenteCurricular,
          },
        })
        .catch(e => erros(e));

      if (frequenciaAlunos?.data) {
        const tiposFrequencia = await this.obterTipoFrequencia(
          turmaSelecionada?.modalidade,
          turmaSelecionada?.anoLetivo
        ).catch(e => erros(e));

        frequenciaAlunos.data.listaTiposFrequencia = tiposFrequencia?.data
          ?.length
          ? tiposFrequencia.data
          : [];

        frequenciaAlunos.data.auditoria = {
          criadoEm: frequenciaAlunos.data.criadoEm,
          criadoPor: frequenciaAlunos.data.criadoPor,
          alteradoPor: frequenciaAlunos.data.alteradoPor,
          alteradoEm: frequenciaAlunos.data.alteradoEm,
          alteradoRF: frequenciaAlunos.data.alteradoRF,
          criadoRF: frequenciaAlunos.data.criadoRF,
        };
        dispatch(setListaDadosFrequencia(frequenciaAlunos.data));
        dispatch(
          setTemPeriodoAbertoFrequenciaPlanoAula(
            frequenciaAlunos.data.temPeriodoAberto
          )
        );
      } else {
        dispatch(setListaDadosFrequencia({}));
        dispatch(setTemPeriodoAbertoFrequenciaPlanoAula(true));
      }
      dispatch(setExibirLoaderFrequenciaPlanoAula(false));
    }
  };

  salvarFrequencia = params => {
    return api.post(`v1/calendarios/frequencias`, params);
  };

  obterTipoFrequencia = (modalidade, anoLetivo) => {
    return api.get(
      `${urlPadrao}/frequencias/tipos?modalidade=${modalidade}&anoLetivo=${anoLetivo}`
    );
  };

  obterFrequenciasPorPeriodo = (
    dataInicio,
    dataFim,
    turmaCodigo,
    codigoComponenteCurricular,
    componenteCurricularId
  ) => {
    const url = `${urlPadrao}/frequencias/por-periodo?dataInicio=${dataInicio}&dataFim=${dataFim}&turmaId=${turmaCodigo}&disciplinaId=${codigoComponenteCurricular}&componenteCurricularId=${componenteCurricularId}`;
    return api.get(url);
  };

  obterFrequenciaDetalhadaAluno = (codigoAluno, dataInicio, dataFim) => {
    const url = `${urlPadrao}/frequencias/detalhadas?codigoAluno=${codigoAluno}&dataInicio=${dataInicio}&dataFim=${dataFim}`;
    return api.get(url);
  };

  salvarFrequenciaListao = params =>
    api.post(`${urlPadrao}/frequencias/salvar`, params);

  registrarLog = mensagem =>
    api.post(`${urlPadrao}/frequencias/log/registrar`, { mensagem });
}

export default new ServicoFrequencia();
