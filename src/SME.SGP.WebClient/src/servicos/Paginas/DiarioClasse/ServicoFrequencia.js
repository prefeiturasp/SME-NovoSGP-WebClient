import { store } from '~/redux';
import {
  setExibirLoaderFrequenciaPlanoAula,
  setListaDadosFrequencia,
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

    const { frequenciaPlanoAula } = state;

    const { aulaId, componenteCurricular } = frequenciaPlanoAula;

    if (aulaId) {
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
        const tiposFrequencia = await this.obterTipoFrequencia().catch(e =>
          erros(e)
        );

        frequenciaAlunos.data.tiposFrequencia = tiposFrequencia?.data?.length
          ? tiposFrequencia.data
          : [];

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

  obterTipoFrequencia = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          data: [
            { valor: 'F', desc: 'F' },
            { valor: 'C', desc: 'C' },
            { valor: 'R', desc: 'R' },
          ],
        });
      }, 1000);
    });
  };

  obterPreDefinicaoAlunos = () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          data: [
            { codigoAluno: '', tipoLancamento: 'C' },
            { codigoAluno: '', tipoLancamento: 'R' },
            { codigoAluno: '', tipoLancamento: 'R' },
            { codigoAluno: '', tipoLancamento: 'F' },
            { codigoAluno: '', tipoLancamento: 'F' },
          ],
        });
      }, 1000);
    });
  };
}

export default new ServicoFrequencia();
