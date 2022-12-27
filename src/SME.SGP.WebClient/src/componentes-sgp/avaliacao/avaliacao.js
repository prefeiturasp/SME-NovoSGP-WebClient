/* eslint-disable react/prop-types */
import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import shortid from 'shortid';
import { LabelSemDados, MarcadorTriangulo } from '~/componentes';
import notasConceitos from '~/dtos/notasConceitos';
import {
  setExpandirLinha,
  setModoEdicaoGeral,
  setModoEdicaoGeralNotaFinal,
} from '~/redux/modulos/notasConceitos/actions';
import {
  acharItem,
  converterAcaoTecla,
  moverCursor,
  tratarString,
} from '~/utils';
import Nota from '../inputs/nota';
import Ordenacao from '../Ordenacao/ordenacao';
import {
  CaixaMarcadores,
  InfoMarcador,
  TabelaColunasFixas,
} from './avaliacao.css';
import CampoConceito from './campoConceito';
import CampoConceitoFinal from './campoConceitoFinal';
import CampoNotaFinal from './campoNotaFinal';
import ColunaNotaFinalRegencia from './colunaNotaFinalRegencia';
import LinhaConceitoFinal from './linhaConceitoFinal';

const Avaliacao = props => {
  const dispatch = useDispatch();

  const {
    dados,
    notaTipo,
    onChangeOrdenacao,
    desabilitarCampos,
    ehProfessorCj,
    ehRegencia,
    disciplinaSelecionada,
    exibirTootipStatusGsa,
    exibirStatusAlunoAusente,
  } = props;

  const expandirLinha = useSelector(
    store => store.notasConceitos.expandirLinha
  );

  const onChangeNotaConceito = (nota, valorNovo) => {
    if (!desabilitarCampos && nota.podeEditar) {
      nota.notaConceito = valorNovo;
      nota.modoEdicao = true;
      dados.modoEdicao = true;
      dispatch(setModoEdicaoGeral(true));
    }
  };

  const onChangeNotaConceitoFinal = (notaBimestre, valorNovo) => {
    if (!desabilitarCampos) {
      notaBimestre.notaConceito = valorNovo;
      notaBimestre.modoEdicao = true;
      dados.modoEdicao = true;
      dispatch(setModoEdicaoGeralNotaFinal(true));
    }
  };

  const obterTamanhoColuna = () => {
    if (exibirTootipStatusGsa && exibirStatusAlunoAusente) {
      return 'width-150';
    }
    if (!exibirTootipStatusGsa && !exibirStatusAlunoAusente) {
      return 'width-110';
    }
    return 'width-135';
  };

  const montarCabecalhoAvaliacoes = () => {
    return dados?.avaliacoes?.length > 0
      ? dados.avaliacoes.map(avaliacao => {
          return (
            <th key={shortid.generate()} className={obterTamanhoColuna()}>
              <div className="texto-header-avaliacao">
                <Tooltip title={avaliacao.nome}>{avaliacao.nome}</Tooltip>
              </div>
              <div className="texto-header-avaliacao">
                {window.moment(avaliacao.data).format('DD/MM/YYYY')}
              </div>
              {avaliacao.disciplinas && (
                <div className="row justify-content-center px-3">
                  {avaliacao.disciplinas.map(item => (
                    <div
                      key={shortid.generate()}
                      alt={item}
                      className="badge badge-pill border text-dark bg-white font-weight-light"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </th>
          );
        })
      : '';
  };

  const montarToolTipDisciplinas = disciplinas => {
    let nomes = '';
    disciplinas.forEach(nomeDisciplina => {
      nomes += nomes.length > 0 ? `, ${nomeDisciplina}` : nomeDisciplina;
    });
    return nomes;
  };

  const montarCabecalhoInterdisciplinar = () => {
    return dados.avaliacoes && dados.avaliacoes.length > 0
      ? dados.avaliacoes.map(avaliacao => {
          return avaliacao.ehInterdisciplinar ? (
            <th key={shortid.generate()}>
              <Tooltip
                title={montarToolTipDisciplinas(avaliacao.disciplinas)}
                placement="bottom"
                overlayStyle={{ fontSize: '12px' }}
              >
                <CaixaMarcadores>Interdisciplinar</CaixaMarcadores>
              </Tooltip>
            </th>
          ) : (
            <th key={shortid.generate()} />
          );
        })
      : '';
  };

  const acharElemento = (e, elemento) => {
    return e.nativeEvent.path.find(item => item.localName === elemento);
  };

  // const clicarSetas = (e, aluno, label = '', index = 0, regencia = false) => {
  //   const direcao = converterAcaoTecla(e.keyCode);
  //   const disciplina = label.toLowerCase();

  //   if (direcao && regencia) {
  //     let novaLinha = [];
  //     const novoIndex = index + direcao;
  //     if (expandirLinha[novoIndex]) {
  //       expandirLinha[novoIndex] = false;
  //       novaLinha = expandirLinha;
  //     } else {
  //       novaLinha[novoIndex] = true;
  //     }
  //     dispatch(setExpandirLinha([...novaLinha]));
  //   }
  //   const elementoTD = acharElemento(e, 'td');
  //   const indexElemento = elementoTD?.cellIndex - 2;
  //   const alunoEscolhido =
  //     direcao && acharItem(dados?.alunos, aluno, direcao, 'id');
  //   if (alunoEscolhido.length) {
  //     const disciplinaTratada = tratarString(disciplina);
  //     const item = regencia ? disciplinaTratada : 'aluno';
  //     const itemEscolhido = `${item}${alunoEscolhido[0].id}`;
  //     moverCursor(itemEscolhido, indexElemento, regencia);
  //   }
  // };

  const montarCampoNotaConceito = (nota, aluno) => {
    const avaliacao = dados.avaliacoes.find(
      item => item.id === nota.atividadeAvaliativaId
    );
    const desabilitarNota = ehProfessorCj ? !avaliacao.ehCJ : avaliacao.ehCJ;
    const desabilitar =
      desabilitarCampos || desabilitarNota || !nota?.podeEditar;

    switch (Number(notaTipo)) {
      case Number(notasConceitos.Notas):
        return (
          <Nota
            dadosNota={nota}
            desabilitar={desabilitar}
            idCampo={`aluno${aluno.id}`}
            dadosArredondamento={avaliacao?.dadosArredondamento}
            onChangeNotaConceito={valorNovo =>
              onChangeNotaConceito(nota, valorNovo)
            }
          />
        );
      case Number(notasConceitos.Conceitos):
        return (
          <CampoConceito
            nota={nota}
            onChangeNotaConceito={valorNovo =>
              onChangeNotaConceito(nota, valorNovo)
            }
            desabilitarCampo={desabilitarCampos}
            listaTiposConceitos={dados.listaTiposConceitos}
          />
        );
      default:
        return '';
    }
  };

  const montaNotaFinal = (aluno, index) => {
    if (aluno && aluno.notasBimestre && aluno.notasBimestre.length) {
      if (ehRegencia) {
        return aluno.notasBimestre[index];
      }
      return aluno.notasBimestre[0];
    }

    aluno.notasBimestre = [{ notaConceito: '' }];
    return aluno.notasBimestre[0];
  };

  const montarCampoNotaConceitoFinal = (
    aluno,
    label,
    index,
    regencia,
    indexLinha
  ) => {
    const desabilitarNotaFinal =
      ehProfessorCj ||
      desabilitarCampos ||
      !dados.podeLancarNotaFinal ||
      !aluno.podeEditar;

    if (Number(notaTipo) === Number(notasConceitos.Notas)) {
      const dadosNota = montaNotaFinal(aluno, index);
      return (
        <>
          <Nota
            dadosNota={dadosNota}
            desabilitar={desabilitarNotaFinal}
            idCampo={`aluno${aluno.id}`}
            name={`aluno${aluno.id}`}
            dadosArredondamento={null}
            onChangeNotaConceito={valorNovo =>
              onChangeNotaConceitoFinal(dadosNota, valorNovo)
            }
            mediaAprovacaoBimestre={dados.mediaAprovacaoBimestre}
            label={label}
          />
          {/*
          <CampoNotaFinal
            esconderSetas
            name={`aluno${aluno.id}`}
            clicarSetas={e => clicarSetas(e, aluno, label, indexLinha, regencia)}
            step={0}
            montaNotaFinal={() => montaNotaFinal(aluno, index)}
            onChangeNotaConceitoFinal={(nota, valor) =>
              onChangeNotaConceitoFinal(nota, valor)
            }
            desabilitarCampo={ehProfessorCj || desabilitarCampos}
            podeEditar={aluno.podeEditar}
            periodoFim={dados.periodoFim}
            notaFinal={aluno.notasBimestre.find(
              x => String(x.disciplinaId) === String(disciplinaSelecionada)
            )}
            disciplinaSelecionada={disciplinaSelecionada}
            mediaAprovacaoBimestre={dados.mediaAprovacaoBimestre}
            label={label}
            podeLancarNotaFinal={dados.podeLancarNotaFinal}
          /> */}
        </>
      );
    }
    if (Number(notaTipo) === Number(notasConceitos.Conceitos)) {
      return (
        <CampoConceitoFinal
          montaNotaConceitoFinal={() => montaNotaFinal(aluno, index)}
          onChangeNotaConceitoFinal={(nota, valor) =>
            onChangeNotaConceitoFinal(nota, valor)
          }
          desabilitarCampo={ehProfessorCj || desabilitarCampos}
          podeEditar={aluno.podeEditar}
          listaTiposConceitos={dados.listaTiposConceitos}
          label={label}
          podeLancarNotaFinal={dados.podeLancarNotaFinal}
        />
      );
    }
    return '';
  };

  return (
    <>
      {dados && dados.alunos && dados.alunos.length ? (
        <TabelaColunasFixas>
          <div className="botao-ordenacao-avaliacao">
            <Ordenacao
              conteudoParaOrdenar={dados.alunos}
              ordenarColunaNumero="numeroChamada"
              ordenarColunaTexto="nome"
              retornoOrdenado={retorno => {
                dados.alunos = retorno;
                onChangeOrdenacao(dados);
              }}
            />
          </div>
          <div className="wrapper">
            <div className="header-fixo">
              <table className="table">
                <thead className="tabela-avaliacao-thead">
                  <tr className="coluna-ordenacao-tr">
                    <th
                      className="sticky-col col-numero-chamada"
                      style={{ borderRight: 'none', borderLeft: 'none' }}
                    />
                    <th
                      className="sticky-col col-nome-aluno"
                      style={{ borderTop: 'none' }}
                    />

                    {montarCabecalhoAvaliacoes()}
                    <th
                      className="sticky-col col-nota-final cabecalho-nota-conceito-final "
                      rowSpan="2"
                    >
                      {Number(notasConceitos.Notas) === notaTipo
                        ? 'NOTA FINAL'
                        : 'CONCEITO FINAL'}
                    </th>
                    <th
                      className="sticky-col col-frequencia cabecalho-frequencia"
                      rowSpan="2"
                    >
                      %Freq.
                    </th>
                  </tr>
                  {dados.avaliacoes && dados.avaliacoes.length > 0 ? (
                    <tr>
                      <th
                        className="sticky-col col-numero-chamada cinza-fundo"
                        style={{ borderRight: 'none' }}
                      />
                      <th className="sticky-col col-nome-aluno cinza-fundo" />
                      {montarCabecalhoInterdisciplinar()}
                    </tr>
                  ) : (
                    ''
                  )}
                </thead>
              </table>
            </div>

            <div>
              <table className="table">
                <tbody className="tabela-avaliacao-tbody">
                  {dados.alunos.map((aluno, i) => {
                    return (
                      <React.Fragment key={shortid.generate()}>
                        <tr>
                          <td className="sticky-col col-numero-chamada">
                            {aluno.numeroChamada}
                            {aluno.marcador && (
                              <Tooltip
                                title={aluno.marcador.descricao}
                                placement="top"
                              >
                                <InfoMarcador className="fas fa-circle" />
                              </Tooltip>
                            )}
                          </td>
                          <td className="sticky-col col-nome-aluno">
                            <Tooltip title={aluno.nome} placement="top">
                              {aluno.nome}
                            </Tooltip>
                          </td>
                          {aluno.notasAvaliacoes.length
                            ? aluno.notasAvaliacoes.map(nota => {
                                return (
                                  <td
                                    key={shortid.generate()}
                                    className={`${obterTamanhoColuna()} position-relative`}
                                  >
                                    {montarCampoNotaConceito(nota, aluno)}
                                  </td>
                                );
                              })
                            : ''}
                          <td className="sticky-col col-nota-final linha-nota-conceito-final">
                            {ehRegencia ? (
                              <ColunaNotaFinalRegencia indexLinha={i} />
                            ) : (
                              montarCampoNotaConceitoFinal(aluno)
                            )}
                            {aluno?.notasBimestre[0]?.emAprovacao && (
                              <Tooltip title="Aguardando aprovação">
                                <MarcadorTriangulo />
                              </Tooltip>
                            )}
                          </td>

                          <td className="sticky-col col-frequencia linha-frequencia ">
                            {aluno?.percentualFrequencia
                              ? `${aluno.percentualFrequencia}%`
                              : ''}
                          </td>
                        </tr>
                        <LinhaConceitoFinal
                          indexLinha={i}
                          dados={dados}
                          aluno={aluno}
                          montarCampoNotaConceitoFinal={(label, index) =>
                            montarCampoNotaConceitoFinal(
                              aluno,
                              label,
                              index,
                              true,
                              i
                            )
                          }
                        />
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </TabelaColunasFixas>
      ) : (
        <LabelSemDados
          text="Bimestre selecionado não possui atividade avaliativa cadastrada"
          center
        />
      )}
    </>
  );
};

Avaliacao.propTypes = {
  notaTipo: PropTypes.number,
  onChangeOrdenacao: () => {},
  exibirTootipStatusGsa: PropTypes.bool,
  exibirStatusAlunoAusente: PropTypes.bool,
};

Avaliacao.defaultProps = {
  notaTipo: 0,
  onChangeOrdenacao: () => {},
  exibirTootipStatusGsa: false,
  exibirStatusAlunoAusente: false,
};

export default Avaliacao;
