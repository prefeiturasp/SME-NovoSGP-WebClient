/* eslint-disable react/prop-types */
import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import shortid from 'shortid';
import { LabelSemDados, MarcadorTriangulo } from '~/componentes';
import { SGP_INPUT_NOTA, SGP_INPUT_NOTA_FINAL } from '~/constantes/ids/input';
import {
  SGP_SELECT_CONCEITO_FINAL,
  SGP_SELECT_NOTA,
} from '~/constantes/ids/select';
import {
  SGP_TABLE_LANCAMENTO_NOTAS,
  SGP_TABLE_LANCAMENTO_NOTAS_LINHA,
} from '~/constantes/ids/table';
import notasConceitos from '~/dtos/notasConceitos';
import {
  setExpandirLinha,
  setModoEdicaoGeral,
  setModoEdicaoGeralNotaFinal,
} from '~/redux/modulos/notasConceitos/actions';
import {
  formatarFrequencia,
  ocultarColunaAvaliacaoComponenteRegencia,
} from '~/utils';
import Nota from '../inputs/nota';
import { moverFocoCampoNota } from '../inputs/nota/funcoes';
import LabelInterdisciplinar from '../interdisciplinar';
import Ordenacao from '../Ordenacao/ordenacao';
import { InfoMarcador, TabelaColunasFixas } from './avaliacao.css';
import CampoConceito from './campoConceito';
import CampoConceitoFinal from './campoConceitoFinal';
import ColunaNotaFinalRegencia from './colunaNotaFinalRegencia';
import LinhaConceitoFinal from './linhaConceitoFinal';
import EstudanteAtendidoAEE from '@/components/sgp/estudante-atendido-aee';
import FiltroComponentesRegencia from '../FiltroComponentesRegencia';
import EstudanteMatriculadoPAP from '@/components/sgp/estudante-matriculado-pap';

const Avaliacao = props => {
  const dispatch = useDispatch();

  const {
    dados,
    notaTipo,
    onChangeOrdenacao,
    desabilitarCampos,
    ehProfessorCj,
    ehRegencia,
    exibirTootipStatusGsa,
    exibirStatusAlunoAusente,
    disciplinaSelecionada,
  } = props;

  const expandirLinha = useSelector(
    store => store.notasConceitos.expandirLinha
  );
  const exibiDados = dados?.alunos?.length;

  const [componentesRegencia, setComponentesRegencia] = useState([]);

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
    return dados?.avaliacoes?.length > 0 ? (
      dados.avaliacoes.map(avaliacao => {
        const ocultar = ocultarColunaAvaliacaoComponenteRegencia(
          avaliacao?.disciplinas,
          componentesRegencia,
          ehRegencia
        );

        if (ocultar) return <></>;

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
    ) : (
      <></>
    );
  };

  const montarCabecalhoInterdisciplinar = () => {
    let cabecalho = <></>;

    if (dados?.avaliacoes?.length > 0) {
      cabecalho = dados.avaliacoes.map(avaliacao => {
        const ocultar = ocultarColunaAvaliacaoComponenteRegencia(
          avaliacao?.disciplinas,
          componentesRegencia,
          ehRegencia
        );

        if (ocultar) return <></>;

        return avaliacao.ehInterdisciplinar ? (
          <th key={shortid.generate()}>
            <LabelInterdisciplinar disciplinas={avaliacao.disciplinas} />
          </th>
        ) : (
          <th key={shortid.generate()} />
        );
      });
    } else {
      return cabecalho;
    }

    return (
      <tr key={shortid.generate()}>
        <th
          className="sticky-col col-numero-chamada cinza-fundo"
          style={{ borderRight: 'none' }}
        />
        <th className="sticky-col col-nome-aluno cinza-fundo" />
        {cabecalho}
      </tr>
    );
  };

  const montarCampoNotaConceito = (nota, aluno, linha, coluna) => {
    const avaliacao = dados.avaliacoes.find(
      item => item.id === nota.atividadeAvaliativaId
    );
    const desabilitarNota = ehProfessorCj ? !avaliacao.ehCJ : avaliacao.ehCJ;
    const desabilitar =
      desabilitarCampos || desabilitarNota || !nota?.podeEditar;

    let campo = <></>;
    switch (Number(notaTipo)) {
      case notasConceitos.Notas:
        campo = (
          <Nota
            id={`${SGP_INPUT_NOTA}_LINHA_${linha}_COLUNA_${coluna}`}
            onKeyDown={e =>
              moverFocoCampoNota({ e, aluno, alunos: dados?.alunos })
            }
            dadosNota={nota}
            desabilitar={desabilitar}
            name={`aluno${aluno.id}`}
            dadosArredondamento={avaliacao?.dadosArredondamento}
            onChangeNotaConceito={valorNovo =>
              onChangeNotaConceito(nota, valorNovo)
            }
          />
        );
        break;
      case notasConceitos.Conceitos:
        campo = (
          <CampoConceito
            id={`${SGP_SELECT_NOTA}_LINHA_${linha}_COLUNA_${coluna}`}
            nota={nota}
            onChangeNotaConceito={valorNovo =>
              onChangeNotaConceito(nota, valorNovo)
            }
            desabilitarCampo={desabilitarCampos}
            listaTiposConceitos={dados.listaTiposConceitos}
          />
        );
        break;
      default:
        campo = <></>;
        break;
    }

    const ocultar = ocultarColunaAvaliacaoComponenteRegencia(
      avaliacao?.disciplinas,
      componentesRegencia,
      ehRegencia
    );

    return ocultar ? (
      <></>
    ) : (
      <td
        key={shortid.generate()}
        className={`${obterTamanhoColuna()} position-relative`}
      >
        {campo}
      </td>
    );
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

  const acaoExpandirLinhaRegencia = (direcao, indexLinha) => {
    let novaLinha = [];
    const novoIndex = indexLinha + direcao;

    if (expandirLinha[novoIndex]) {
      expandirLinha[novoIndex] = false;
      novaLinha = expandirLinha;
    } else {
      novaLinha[novoIndex] = true;
    }
    dispatch(setExpandirLinha([...novaLinha]));
  };

  const onKeyDownCampoFinal = (
    e,
    aluno,
    componenteCurricularNome,
    regencia,
    indexLinha
  ) => {
    const params = {
      e,
      aluno,
      alunos: dados?.alunos,
      componenteCurricularNome,
      regencia,
      acaoExpandirLinha: direcao =>
        acaoExpandirLinhaRegencia(direcao, indexLinha),
    };

    moverFocoCampoNota(params);
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

      const dadosArredondamentoFechamento = dados?.dadosArredondamento;
      return (
        <>
          <Nota
            ehFechamento
            onKeyDown={e =>
              onKeyDownCampoFinal(e, aluno, label, regencia, indexLinha)
            }
            dadosNota={dadosNota}
            desabilitar={desabilitarNotaFinal}
            id={`${SGP_INPUT_NOTA_FINAL}_LINHA_${index}`}
            name={`aluno${aluno.id}`}
            dadosArredondamento={dadosArredondamentoFechamento}
            onChangeNotaConceito={valorNovo =>
              onChangeNotaConceitoFinal(dadosNota, valorNovo)
            }
            mediaAprovacaoBimestre={dados.mediaAprovacaoBimestre}
            label={label}
          />
        </>
      );
    }
    if (Number(notaTipo) === Number(notasConceitos.Conceitos)) {
      return (
        <CampoConceitoFinal
          id={`${SGP_SELECT_CONCEITO_FINAL}_LINHA_${index}`}
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
    return <></>;
  };

  return (
    <>
      {exibiDados && dados?.avaliacoes?.length ? (
        <FiltroComponentesRegencia
          ehRegencia={ehRegencia}
          componentesRegencia={componentesRegencia}
          setComponentesRegencia={setComponentesRegencia}
          codigoComponenteCurricular={disciplinaSelecionada}
        />
      ) : (
        <></>
      )}
      {exibiDados ? (
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
                      Frequência
                    </th>
                  </tr>
                  {dados.avaliacoes && dados.avaliacoes.length > 0 ? (
                    montarCabecalhoInterdisciplinar()
                  ) : (
                    <></>
                  )}
                </thead>
              </table>
            </div>

            <div>
              <table className="table" id={SGP_TABLE_LANCAMENTO_NOTAS}>
                <tbody className="tabela-avaliacao-tbody">
                  {dados.alunos.map((aluno, i) => {
                    return (
                      <React.Fragment key={shortid.generate()}>
                        <tr id={`${SGP_TABLE_LANCAMENTO_NOTAS_LINHA}_${i}`}>
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
                            <div
                              className="d-flex"
                              style={{
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              {aluno.nome}
                              <div className="d-flex justify-content-end">
                                <EstudanteAtendidoAEE
                                  show={aluno?.ehAtendidoAEE}
                                />
                                <EstudanteMatriculadoPAP
                                  show={aluno?.ehMatriculadoTurmaPAP}
                                />
                              </div>
                            </div>
                          </td>

                          {aluno.notasAvaliacoes.length
                            ? aluno.notasAvaliacoes.map((nota, index) => {
                                return montarCampoNotaConceito(
                                  nota,
                                  aluno,
                                  i,
                                  index
                                );
                              })
                            : ''}
                          <td className="sticky-col col-nota-final linha-nota-conceito-final">
                            {ehRegencia ? (
                              <ColunaNotaFinalRegencia indexLinha={i} />
                            ) : (
                              montarCampoNotaConceitoFinal(aluno, '', i)
                            )}
                            {!!aluno?.notasBimestre?.find(
                              n => !!n?.emAprovacao
                            ) && (
                              <Tooltip title="Aguardando aprovação">
                                <MarcadorTriangulo />
                              </Tooltip>
                            )}
                          </td>

                          <td
                            className="sticky-col col-frequencia linha-frequencia "
                            style={{ verticalAlign: 'middle' }}
                          >
                            {formatarFrequencia(aluno?.percentualFrequencia)}
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
