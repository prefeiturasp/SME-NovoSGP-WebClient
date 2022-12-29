import { converterAcaoTecla, moverCursor, tratarString } from '~/utils';

const acharItem = (dados, alunoEscolhido, numero, nomeItem) => {
  if (dados?.length) {
    return dados
      ?.map((valor, index, elementos) => {
        if (valor[nomeItem] === alunoEscolhido[nomeItem]) {
          return elementos[index + numero];
        }
        return '';
      })
      .filter(item => item && item[nomeItem]);
  }
  return '';
};

const acharElemento = (e, elemento) => {
  let path = null;

  if (e.nativeEvent?.path) {
    path = e.nativeEvent?.path;
  } else if (e.nativeEvent?.composedPath) {
    path = e.nativeEvent?.composedPath();
  }
  return path ? path.find(item => item.localName === elemento) : '';
};

/** Ao clicar para cima ou baixo, mover o foco para o próximo campo */
const clicarSetas = (
  e,
  aluno,
  alunos,
  /** TELA DE NOTAS/LISTÃO FECHAMENTO = 2, LISTAO AVALIAÇÃO = 3 */
  qtdColunasSemCampoNota = 2,
  disciplinaNome = '',
  index = 0,
  regencia = false,
  acaoExpandirLinha
) => {
  const direcao = converterAcaoTecla(e.keyCode);
  const disciplina = disciplinaNome.toLowerCase();

  if (direcao && regencia && acaoExpandirLinha) {
    acaoExpandirLinha(direcao);
  }
  const elementoTD = acharElemento(e, 'td');
  if (!elementoTD) return;

  const indexElemento = elementoTD?.cellIndex - qtdColunasSemCampoNota;

  let alunoEscolhido = [];
  if (aluno?.id) {
    alunoEscolhido = direcao && acharItem(alunos, aluno, direcao, 'id');
  } else if (aluno?.codigoAluno) {
    alunoEscolhido =
      direcao && acharItem(alunos, aluno, direcao, 'codigoAluno');
  } else if (aluno?.codigo) {
    alunoEscolhido = direcao && acharItem(alunos, aluno, direcao, 'codigo');
  }

  if (alunoEscolhido?.length) {
    const disciplinaTratada = tratarString(disciplina);
    const item = regencia && disciplinaTratada ? disciplinaTratada : 'aluno';

    let itemEscolhido = '';
    if (alunoEscolhido[0].id) {
      itemEscolhido = `${item}${alunoEscolhido[0]?.id}`;
    } else if (alunoEscolhido[0]?.codigoAluno) {
      itemEscolhido = `${item}${alunoEscolhido[0].codigoAluno}`;
    } else if (alunoEscolhido[0]?.codigo) {
      itemEscolhido = `${item}${alunoEscolhido[0].codigo}`;
    }

    moverCursor(itemEscolhido, indexElemento, regencia);
  }
};

export { clicarSetas };
