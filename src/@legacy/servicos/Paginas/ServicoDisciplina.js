import api from '~/servicos/api';

class ServicoDisciplina {
  obterDisciplinasPorTurma = (
    turmaId,
    realizarAgrupamentoComponente = true
  ) => {
    const url = `v1/professores/turmas/${turmaId}/disciplinas?realizarAgrupamentoComponente=${realizarAgrupamentoComponente}`;
    return api.get(url);
  };

  obterDisciplinasPlanejamento = (
    codigoDisciplina,
    turmaId,
    turmaPrograma,
    temRegencia
  ) => {
    const url = `v1/professores/turmas/${turmaId}/disciplinas/planejamento/regencia/${!!temRegencia}?codigoDisciplina=${codigoDisciplina}&turmaPrograma=${!!turmaPrograma}`;
    return api.get(url);
  };
}

export default new ServicoDisciplina();
