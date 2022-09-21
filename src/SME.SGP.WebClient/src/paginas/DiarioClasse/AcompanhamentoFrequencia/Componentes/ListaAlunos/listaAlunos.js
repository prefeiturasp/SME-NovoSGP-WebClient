import { Tooltip } from 'antd';
import PropTypes from 'prop-types';
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Loader } from '~/componentes';
import AusenciasEstudante from '~/componentes-sgp/ListaFrequenciaPorBimestre/ausenciasEstudante';
import BtnExpandirAusenciaEstudante from '~/componentes-sgp/ListaFrequenciaPorBimestre/btnExpandirAusenciaEstudante';
import ModalAnotacoes from '~/componentes-sgp/ListaFrequenciaPorBimestre/modalAnotacoes';
import NomeEstudanteLista from '~/componentes-sgp/NomeEstudanteLista/nomeEstudanteLista';
import Ordenacao from '~/componentes-sgp/Ordenacao/ordenacao';
import { Base, Colors } from '~/componentes/colors';
import { BIMESTRE_FINAL } from '~/constantes';
import {
  setExibirModalImpressao,
  setExpandirLinhaFrequenciaAluno,
} from '~/redux/modulos/acompanhamentoFrequencia/actions';
import { erros } from '~/servicos';
import ServicoAcompanhamentoFrequencia from '~/servicos/Paginas/DiarioClasse/ServicoAcompanhamentoFrequencia';
import { ehTurmaInfantil } from '~/servicos/Validacoes/validacoesInfatil';
import ModalImpressao from '../ModalImpressao/modalImpressao';
import {
  MarcadorAulas,
  Marcadores,
  TabelaColunasFixas,
  BotaoCustomizado,
} from './listaAlunos.css';

const ListaAlunos = props => {
  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;

  const { componenteCurricularId, territorioSaber } = props;
  const modalidadesFiltroPrincipal = useSelector(
    store => store.filtro.modalidades
  );

  const exibirModalAnotacao = useSelector(
    store => store.listaFrequenciaPorBimestre.exibirModalAnotacao
  );

  const bimestreSelecionado = useSelector(
    store => store.acompanhamentoFrequencia.bimestreSelecionado
  );

  const exibirModalImpressao = useSelector(
    store => store.acompanhamentoFrequencia.exibirModalImpressao
  );

  const { id: turmaId, periodo: semestre } = turmaSelecionada;

  const dispatch = useDispatch();

  const [carregandoListaAlunos, setCarregandoListaAlunos] = useState(false);
  const [dadosBimestre, setDadosBimestre] = useState([]);

  const obterAlunos = useCallback(async () => {
    setDadosBimestre([]);
    setCarregandoListaAlunos(true);
    const retorno = await ServicoAcompanhamentoFrequencia.obterAcompanhamentoFrequenciaPorBimestre(
      turmaSelecionada?.id,
      componenteCurricularId,
      bimestreSelecionado,
      territorioSaber
    )
      .catch(e => erros(e))
      .finally(() => setCarregandoListaAlunos(false));

    const dados = retorno?.data ? retorno?.data : [];
    setDadosBimestre(dados);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [turmaSelecionada, componenteCurricularId, bimestreSelecionado]);

  useEffect(() => {
    if (componenteCurricularId && turmaId && bimestreSelecionado) {
      dispatch(setExpandirLinhaFrequenciaAluno([]));
      setDadosBimestre([]);
      obterAlunos(componenteCurricularId, bimestreSelecionado);
    }
  }, [
    componenteCurricularId,
    turmaId,
    bimestreSelecionado,
    dispatch,
    obterAlunos,
  ]);

  const onChangeOrdenacao = alunosOrdenados => {
    dispatch(setExpandirLinhaFrequenciaAluno([]));
    setDadosBimestre({ ...dadosBimestre, frequenciaAlunos: alunosOrdenados });
  };

  return (
    <>
      <Loader loading={carregandoListaAlunos} />
      {dadosBimestre ? (
        <>
          {exibirModalAnotacao ? <ModalAnotacoes /> : ''}
          {exibirModalImpressao ? (
            <ModalImpressao
              dadosAlunos={dadosBimestre?.frequenciaAlunos}
              componenteCurricularId={componenteCurricularId}
            />
          ) : (
            ''
          )}
          <TabelaColunasFixas>
            <div className="row">
              <div className="col-md-6 col-sm-12 d-flex">
                <Ordenacao
                  className="mb-2"
                  conteudoParaOrdenar={dadosBimestre?.frequenciaAlunos}
                  ordenarColunaNumero="numeroChamada"
                  ordenarColunaTexto="nome"
                  retornoOrdenado={retorno => {
                    onChangeOrdenacao(retorno);
                  }}
                />
                {String(bimestreSelecionado) !== BIMESTRE_FINAL && (
                  <BotaoCustomizado
                    icon="print"
                    className="ml-2"
                    color={Colors.Azul}
                    border
                    onClick={() => dispatch(setExibirModalImpressao(true))}
                    id="btn-imprimir-frequencia"
                  />
                )}
              </div>

              <Marcadores className="col-md-6 col-sm-12 d-flex justify-content-end">
                {!ehTurmaInfantil(
                  modalidadesFiltroPrincipal,
                  turmaSelecionada
                ) ? (
                  <MarcadorAulas className="ml-2">
                    <span>Aulas previstas </span>
                    <span className="numero">
                      {dadosBimestre?.aulasPrevistas
                        ? dadosBimestre.aulasPrevistas
                        : 0}
                    </span>
                  </MarcadorAulas>
                ) : (
                  <></>
                )}
                <MarcadorAulas className="ml-2">
                  <span>Aulas dadas </span>
                  <span className="numero">
                    {dadosBimestre?.aulasDadas ? dadosBimestre.aulasDadas : 0}
                  </span>
                </MarcadorAulas>
              </Marcadores>
            </div>
            <div className="wrapper">
              <div className="header-fixo">
                <table className="table">
                  <thead className="tabela-dois-thead">
                    <tr>
                      <th className="col-linha-quatro" colSpan="2">
                        Nome
                      </th>
                      <th className="col-linha-dois">Aulas</th>
                      <th className="col-linha-dois">Ausências</th>
                      {!ehTurmaInfantil(
                        modalidadesFiltroPrincipal,
                        turmaSelecionada
                      ) ? (
                        <th className="col-linha-dois">Compensações</th>
                      ) : (
                        <></>
                      )}
                      <th className="col-linha-dois">Presenças</th>
                      <th className="col-linha-dois">Remoto</th>
                      <th className="col-linha-dois">Frequência</th>
                    </tr>
                  </thead>
                  <tbody className="tabela-um-tbody">
                    {dadosBimestre?.frequenciaAlunos?.map((data, index) => {
                      return (
                        <>
                          <tr
                            id={index}
                            style={{
                              background: data?.marcadorFrequencia
                                ? Base.CinzaDesabilitado
                                : '',
                              borderRight: data?.marcadorFrequencia
                                ? `solid 1px ${Base.CinzaBotao}`
                                : `solid 1px ${Base.CinzaDesabilitado}`,
                            }}
                          >
                            <td
                              className="col-valor-linha-tres"
                              style={{
                                borderRight: data?.marcadorFrequencia
                                  ? `solid 1px ${Base.CinzaBotao}`
                                  : `solid 1px ${Base.CinzaDesabilitado}`,
                              }}
                            >
                              <strong>{data?.numeroChamada}</strong>
                              {data?.marcadorFrequencia ? (
                                <div className="divIconeSituacao">
                                  <Tooltip
                                    title={data.marcadorFrequencia?.descricao}
                                  >
                                    <span className="iconeSituacao" />
                                  </Tooltip>
                                </div>
                              ) : (
                                ''
                              )}
                            </td>
                            <td
                              className="col-valor-linha-quatro"
                              style={{
                                borderRight: data?.marcadorFrequencia
                                  ? `solid 1px ${Base.CinzaBotao}`
                                  : `solid 1px ${Base.CinzaDesabilitado}`,
                              }}
                            >
                              <NomeEstudanteLista
                                nome={data?.nome}
                                exibirSinalizacao={data?.ehAtendidoAEE}
                              />
                            </td>
                            <td
                              className="col-valor-linha-dois"
                              style={{
                                borderRight: data?.marcadorFrequencia
                                  ? `solid 1px ${Base.CinzaBotao}`
                                  : `solid 1px ${Base.CinzaDesabilitado}`,
                              }}
                            >
                              {data.totalAulas}
                            </td>
                            <td
                              className="col-valor-linha-dois"
                              style={{
                                borderRight: data?.marcadorFrequencia
                                  ? `solid 1px ${Base.CinzaBotao}`
                                  : `solid 1px ${Base.CinzaDesabilitado}`,
                              }}
                            >
                              {data.ausencias}
                            </td>
                            {!ehTurmaInfantil(
                              modalidadesFiltroPrincipal,
                              turmaSelecionada
                            ) ? (
                              <td
                                className="col-valor-linha-dois"
                                style={{
                                  borderRight: data?.marcadorFrequencia
                                    ? `solid 1px ${Base.CinzaBotao}`
                                    : `solid 1px ${Base.CinzaDesabilitado}`,
                                }}
                              >
                                {data.compensacoes}
                              </td>
                            ) : (
                              <></>
                            )}
                            <td
                              className="col-valor-linha-dois"
                              style={{
                                borderRight: data?.marcadorFrequencia
                                  ? `solid 1px ${Base.CinzaBotao}`
                                  : `solid 1px ${Base.CinzaDesabilitado}`,
                              }}
                            >
                              {data.presencas}
                            </td>
                            <td
                              className="col-valor-linha-dois"
                              style={{
                                borderRight: data?.marcadorFrequencia
                                  ? `solid 1px ${Base.CinzaBotao}`
                                  : `solid 1px ${Base.CinzaDesabilitado}`,
                              }}
                            >
                              {data.remotos}
                            </td>
                            <td className="col-valor-linha-dois">
                              {data?.frequencia ? `${data.frequencia}%` : ''}
                              {data?.totalAulas > 0 &&
                                bimestreSelecionado > 0 && (
                                  <BtnExpandirAusenciaEstudante
                                    indexLinha={index}
                                  />
                                )}
                            </td>
                          </tr>
                          <AusenciasEstudante
                            indexLinha={index}
                            bimestre={bimestreSelecionado}
                            turmaId={turmaId}
                            codigoAluno={data.alunoRf}
                            componenteCurricularId={componenteCurricularId}
                            semestre={semestre}
                          />
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </TabelaColunasFixas>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

ListaAlunos.propTypes = {
  componenteCurricularId: PropTypes.string,
  territorioSaber: PropTypes.bool,
};

ListaAlunos.defaultProps = {
  componenteCurricularId: '',
  territorioSaber: false,
};

export default ListaAlunos;
