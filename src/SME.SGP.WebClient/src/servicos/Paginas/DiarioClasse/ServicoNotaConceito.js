import api from '~/servicos/api';
import { store } from '~/redux';

class ServicoNotaConceito {
  obterTodosConceitos = data => {
    return api.get(`v1/avaliacoes/notas/conceitos?data=${data}`);
  };

  obterTodasSinteses = data => {
    return api.get(`v1/sinteses/${data}`);
  };

  obterArredondamento = (nota, data) => {
    return api.get(
      `v1/avaliacoes/notas/${nota}/arredondamento?data=${data ||
        window.moment().format('YYYY-MM-DD')}`
    );
  };

  obterTipoNota = (turma, anoLetivo, consideraHistorico) => {
    return api.get(
      `v1/avaliacoes/notas/turmas/${turma}/anos-letivos/${anoLetivo}/tipos?consideraHistorico=${consideraHistorico}`
    );
  };

  estaEmModoEdicaoGeral = () => {
    const state = store.getState();
    const { notasConceitos } = state;
    const { modoEdicaoGeral } = notasConceitos;
    return modoEdicaoGeral;
  };

  estaEmModoEdicaoGeralNotaFinal = () => {
    const state = store.getState();
    const { notasConceitos } = state;
    const { modoEdicaoGeralNotaFinal } = notasConceitos;
    return modoEdicaoGeralNotaFinal;
  };

  obterNotasAvaliacoesPorTurmaBimestreAluno = (
    turmaId,
    periodoEscolarId,
    alunoCodigo,
    codigoComponenteCurricular
  ) => {
    return api.get(
      `v1/avaliacoes/notas/turmas/${turmaId}/periodo-escolar/${periodoEscolarId}/alunos/${alunoCodigo}/componentes-curriculares=${codigoComponenteCurricular}`
    );
  };
}
export default new ServicoNotaConceito();
