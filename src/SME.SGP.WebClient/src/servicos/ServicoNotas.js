import notasConceitos from '~/dtos/notasConceitos';
import api from './api';

const urlPadrao = 'v1/avaliacoes/';
class ServicoNota {
  temQuantidadeMinimaAprovada = (
    dados,
    percentualMinimoAprovados,
    notaTipo
  ) => {
    const validaNotas = alunos => {
      const quantidadeTotalNotas = alunos.reduce(
        (total, aluno) => total + aluno.notasBimestre.length,
        0
      );

      let quantidadeTotalNotasNaoAprovado = 0;

      const mediaAprovacaoBimestre = dados.mediaAprovacaoBimestre;

      alunos.forEach(aluno => {
        const notasDoAluno = aluno.notasBimestre.filter(
          nota =>
            nota.notaConceito !== '' &&
            nota.notaConceito !== null &&
            nota.notaConceito !== undefined
        );

        const qtdAlunosAbaixoMedia = notasDoAluno.filter(
          nota => nota.notaConceito < mediaAprovacaoBimestre
        );
        quantidadeTotalNotasNaoAprovado += qtdAlunosAbaixoMedia.length;
      });

      const percentualAbaixoMedia =
        (quantidadeTotalNotasNaoAprovado / quantidadeTotalNotas) * 100;
      const ehPorcentagemAceitavel =
        percentualAbaixoMedia <= percentualMinimoAprovados;
      return ehPorcentagemAceitavel;
    };

    const validaConceitos = alunos => {
      let quantidadeTotalNotas = 0;
      let quantidadeTotalNotasNaoAprovado = 0;

      const listaTiposConceitos = dados.listaTiposConceitos;
      const tipoNaoAprovado = listaTiposConceitos.find(tipo => !tipo.aprovado);
      const codigoTipoNaoAprovado = tipoNaoAprovado.id;

      alunos.forEach(aluno => {
        const notasDoAluno = aluno.notasBimestre.filter(
          nota =>
            nota.notaConceito !== '' &&
            nota.notaConceito !== null &&
            nota.notaConceito !== undefined
        );

        const totalNaoAprovado = notasDoAluno.filter(nota => {
          return Number(nota.notaConceito) == Number(codigoTipoNaoAprovado);
        });

        quantidadeTotalNotas += notasDoAluno.length;
        quantidadeTotalNotasNaoAprovado += totalNaoAprovado.length;
      });

      if (quantidadeTotalNotas === 0) return true;

      const percentualAbaixoMedia = (quantidadeTotalNotasNaoAprovado / quantidadeTotalNotas) * 100;
      const ehPorcentagemAceitavel =
        percentualAbaixoMedia <= percentualMinimoAprovados;

      return ehPorcentagemAceitavel;
    };

    if (dados && dados.alunos && dados.alunos.length > 0) {
      if (notaTipo === notasConceitos.Notas) {
        const alunosComNotas = dados.alunos.filter(aluno => {
          const notasDoAluno = aluno.notasBimestre.filter(
            nota =>
              nota.notaConceito !== '' &&
              nota.notaConceito !== null &&
              nota.notaConceito !== undefined
          );
          return notasDoAluno.length;
        });
        if (alunosComNotas && alunosComNotas.length) {
          return validaNotas(alunosComNotas);
        }
      }
      if (notaTipo === notasConceitos.Conceitos) {
        return validaConceitos(dados.alunos);
      }
    }

    return true;
  };

  obterPeriodos = params => {
    const url = `${urlPadrao}notas/periodos`;
    return api.get(url, params);
  };

  obterNotas = params => {
    const url = `${urlPadrao}notas`;
    return api.get(url, params);
  };
}

export default new ServicoNota();
