import {
  converterAcaoTecla,
  moverCursor,
  tratarStringComponenteCurricularNome,
} from '~/utils';

const acharAluno = (alunos, alunoEscolhido, direcao, chaveAluno) => {
  if (alunos?.length) {
    const index = alunos.findIndex(
      a => a[chaveAluno] === alunoEscolhido[chaveAluno]
    );
    const totalIndex = alunos?.length - 1;
    const indexDestino = index + direcao;

    if (indexDestino <= totalIndex && indexDestino >= 0) {
      return { aluno: alunos[indexDestino], indexDestino };
    }
  }
  return null;
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

const acharAlunoMoverFoco = async (
  direcao,
  alunos,
  aluno,
  chaveAluno,
  componenteCurricularNome,
  regencia,
  indexElemento
) => {
  const retorno = direcao && acharAluno(alunos, aluno, direcao, chaveAluno);

  const alunoEscolhido = retorno?.aluno;

  if (alunoEscolhido?.[chaveAluno]) {
    const disciplinaTratada = tratarStringComponenteCurricularNome(
      componenteCurricularNome
    );
    const item = regencia && disciplinaTratada ? disciplinaTratada : 'aluno';

    const itemEscolhido = `${item}${alunoEscolhido[chaveAluno]}`;

    const campo = await moverCursor(itemEscolhido, indexElemento, regencia);
    if (campo?.desabilitado) {
      const totalIndex = alunos?.length - 1;
      const indexDestino = retorno?.indexDestino + direcao;
      const temProximoAnteriorAluno =
        indexDestino <= totalIndex && indexDestino >= 0;

      if (temProximoAnteriorAluno) {
        acharAlunoMoverFoco(
          direcao,
          alunos,
          alunoEscolhido,
          chaveAluno,
          componenteCurricularNome,
          regencia,
          indexElemento
        );
      }
    }
  }
  return true;
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

  acharAlunoMoverFoco(
    direcao,
    alunos,
    aluno,
    chaveAluno,
    componenteCurricularNome,
    regencia,
    indexElemento
  );
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
