import {
  converterAcaoTecla,
  moverCursor,
  tratarStringComponenteCurricularNome,
} from '~/utils';

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
const moverFocoCampoNota = props => {
  const {
    e,
    aluno,
    alunos,
    qtdColunasSemCampoNota = 2,
    chaveAluno = 'id',
    componenteCurricularNome = '',
    regencia = false,
    acaoExpandirLinha,
  } = props;

  const direcao = converterAcaoTecla(e.keyCode);

  if (direcao && regencia && acaoExpandirLinha) {
    acaoExpandirLinha(direcao);
  }

  const elementoTD = acharElemento(e, 'td');

  if (!elementoTD) return;

  const indexElemento = elementoTD?.cellIndex - qtdColunasSemCampoNota;

  const alunoEscolhido =
    direcao && acharItem(alunos, aluno, direcao, chaveAluno);

  if (alunoEscolhido?.length) {
    const disciplinaTratada = tratarStringComponenteCurricularNome(
      componenteCurricularNome
    );
    const item = regencia && disciplinaTratada ? disciplinaTratada : 'aluno';

    const itemEscolhido = `${item}${alunoEscolhido[0][chaveAluno]}`;

    moverCursor(itemEscolhido, indexElemento, regencia);
  }
};

const moverFocoCampoNotaConselhoClasse = (
  e,
  componentesAgrupados,
  nomeComponenteCurricular
) => {
  const direcao = converterAcaoTecla(e.keyCode);
  let componenteEscolhido = [];

  if (componentesAgrupados?.length) {
    componenteEscolhido = componentesAgrupados
      .map((valor, index, elementos) => {
        const nomeComponente = tratarStringComponenteCurricularNome(
          valor?.nome
        );
        if (nomeComponente === nomeComponenteCurricular) {
          return elementos[index + direcao];
        }
        return '';
      })
      .filter(item => item?.nome);
  }

  componenteEscolhido = direcao && componenteEscolhido;

  if (componenteEscolhido?.length) {
    const componenteTratado = tratarStringComponenteCurricularNome(
      componenteEscolhido?.[0]?.nome
    );
    moverCursor(componenteTratado);
  }
};

export { moverFocoCampoNota, moverFocoCampoNotaConselhoClasse };
