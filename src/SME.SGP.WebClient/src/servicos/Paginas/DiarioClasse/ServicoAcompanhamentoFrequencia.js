import api from '~/servicos/api';

const urlPadrao = '/v1/frequencias/acompanhamentos';

class ServicoAcompanhamentoFrequencia {
  obterAcompanhamentoFrequenciaPorBimestre = async (
    turmaId,
    componenteCurricularId,
    bimestre,
    territorioSaber
  ) => {
    return api.get(
      `${urlPadrao}?turmaId=${turmaId}&componenteCurricularId=${componenteCurricularId}&bimestre=${bimestre}&possuiTerritorio=${territorioSaber}`
    );
  };

  obterJustificativaAcompanhamentoFrequencia = async (
    turmaId,
    componenteCurricularId,
    alunoCodigo,
    bimestre
  ) => {
    return api.get(
      `${urlPadrao}/turmas/${turmaId}/componentes-curriculares/${componenteCurricularId}/alunos/${alunoCodigo}/bimestres/${bimestre}/justificativas/`
    );
  };

  obterJustificativaAcompanhamentoFrequenciaPaginacaoManual = (
    turmaId,
    componenteCurricularId,
    alunoCodigo,
    bimestre,
    semestre,
    numeroPagina,
    numeroRegistros
  ) => {
    const url = `${urlPadrao}/turmas/${turmaId}/componentes-curriculares/${componenteCurricularId ||
      0}/alunos/${alunoCodigo}/bimestres/${bimestre}/justificativas/semestre/${semestre}?numeroPagina=${numeroPagina ||
      1}&numeroRegistros=${numeroRegistros}`;
    return api.get(url);
  };

  obterFrequenciaDiariaAluno =(
    turmaId,
    componenteCurricularId,
    alunoCodigo,
    bimestre,
    numeroPagina,
    numeroRegistros
  ) =>{
    const url  =`${urlPadrao}/turma/${turmaId}/componente-curricular/${componenteCurricularId || 
                  0}/aluno/${alunoCodigo}/bimestre/${bimestre}?numeroPagina=${numeroPagina ||
                  1}&numeroRegistros=${numeroRegistros}`;
    return api.get(url);
  };

  obterInformacoesDeFrequenciaAlunoPorSemestre = (
    turmaId,
    semestre,
    alunoCodigo,
    componenteCurricularId
  ) => {
    const url = `${urlPadrao}/turmas/${turmaId}/semestres/${semestre}/alunos/${alunoCodigo}`;
    return api.get(url, {
      params: { componenteCurricularId },
    });
  };

  gerar = params => {
    return api.post('/v1/relatorios/acompanhamento-frequencia', params);
  };
}

export default new ServicoAcompanhamentoFrequencia();
