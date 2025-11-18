import { ModalidadeEnum } from '@/core/enum/modalidade-enum';
import { ModalidadeTipoCalendarioEnum } from '@/core/enum/modalidade-tipo-calendario-enum';
import moment from 'moment';
import api from '~/servicos/api';

class ServicoCalendarios {
  obterTiposCalendario = async anoLetivo => {
    if (!anoLetivo) anoLetivo = moment().year();

    return api
      .get(`v1/calendarios/tipos/anos/letivos/${anoLetivo}`)
      .then(resposta => resposta)
      .catch(() => []);
  };

  converterModalidade = modalidadeCalendario => {
    switch (modalidadeCalendario) {
      case ModalidadeTipoCalendarioEnum.EJA:
        return ModalidadeEnum.EJA;
      case ModalidadeTipoCalendarioEnum.CELP:
        return ModalidadeEnum.CELP;
      case ModalidadeTipoCalendarioEnum.INFANTIL:
        return ModalidadeEnum.INFANTIL;
      case ModalidadeTipoCalendarioEnum.FUNDAMENTAL_MEDIO:
        return ModalidadeEnum.FUNDAMENTAL;
      default:
        return null;
    }
  };

  gerarRelatorio = payload => {
    return api.post('v1/relatorios/calendarios/impressao', payload);
  };

  obterTiposCalendarioAutoComplete = (descricao = '') => {
    return api.get(`v1/calendarios/tipos/anos-letivos?descricao=${descricao}`);
  };

  obterDatasDeAulasDisponiveis = (
    anoLetivo,
    turma,
    codigoComponenteCurricular
  ) => {
    const url = `v1/calendarios/frequencias/aulas/datas/${anoLetivo}/turmas/${turma}/disciplinas/${codigoComponenteCurricular}`;
    return api.get(url);
  };

  obterAusenciaMotivoPorAlunoTurmaBimestreAno = (
    codigoAluno,
    bimestre,
    codigoTurma,
    anoLetivo
  ) => {
    const url = `v1/calendarios/frequencias/ausencias-motivos?codigoAluno=${codigoAluno}&codigoTurma=${codigoTurma}&bimestre=${bimestre}&anoLetivo=${anoLetivo}`;
    return api.get(url);
  };

  obterFrequenciaAluno = (alunoCodigo, turmaCodigo) => {
    const url = `v1/calendarios/frequencias/alunos/${alunoCodigo}/turmas/${turmaCodigo}/geral`;
    return api.get(url);
  };

  obterFrequenciaAlunoPorSemestre = (alunoCodigo, turmaCodigo, semestre) => {
    const url = `v1/calendarios/frequencias/alunos/${alunoCodigo}/turmas/${turmaCodigo}/semestre/${semestre}/geral`;
    return api.get(url);
  };

  obterTiposCalendarioPorAnoLetivoModalidade = (
    anoLetivo,
    modalidades,
    semestre
  ) => {
    let url = `v1/calendarios/tipos/ano-letivo/${anoLetivo}/modalidade/${modalidades}`;
    if (semestre) {
      url += `?semestre=${semestre}`;
    }
    return api.get(url);
  };

  obterBimestres = tipoCalendarioId => {
    return api.get(`v1/calendarios/tipos/${tipoCalendarioId}/bimestres`);
  };

  obterTipoCalendarioPorId = tipoCalendarioId => {
    return api.get(`v1/calendarios/tipos/${tipoCalendarioId}`);
  };

  obterFeriados = () => {
    return api.post('v1/calendarios/feriados/listar', {});
  };
}

export default new ServicoCalendarios();
