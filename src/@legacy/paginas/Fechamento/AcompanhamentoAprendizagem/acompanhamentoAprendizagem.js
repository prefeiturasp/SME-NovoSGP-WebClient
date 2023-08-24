import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AlertaPermiteSomenteTurmaInfantil } from '~/componentes-sgp';
import Cabecalho from '~/componentes-sgp/cabecalho';
import Alert from '~/componentes/alert';
import Card from '~/componentes/card';
import SelectComponent from '~/componentes/select';
import { RotasDto } from '~/dtos';
import situacaoMatriculaAluno from '~/dtos/situacaoMatriculaAluno';
import {
  limparDadosAcompanhamentoAprendizagem,
  setAlunosAcompanhamentoAprendizagem,
  setApanhadoGeralEmEdicao,
  setCodigoAlunoSelecionado,
  setDadosAlunoObjectCard,
  setDadosApanhadoGeral,
  setExibirLoaderGeralAcompanhamentoAprendizagem,
  setExibirLoaderAlunosAcompanhamentoAprendizagem,
} from '~/redux/modulos/acompanhamentoAprendizagem/actions';
import {
  resetarDadosRegistroIndividual,
  setComponenteCurricularSelecionado,
  setDadosAlunoObjectCard as setDadosAlunoObjectCardRegistroIndividual,
} from '~/redux/modulos/registroIndividual/actions';
import {
  ehTurmaInfantil,
  ServicoCalendarios,
  ServicoDisciplina,
  verificaSomenteConsulta,
} from '~/servicos';
import Loader from '~/componentes/loader';
import { erros } from '~/servicos/alertas';
import ServicoAcompanhamentoAprendizagem from '~/servicos/Paginas/Relatorios/AcompanhamentoAprendizagem/ServicoAcompanhamentoAprendizagem';
import { Container } from './acompanhamentoAprendizagem.css';
import ApanhadoGeral from './DadosAcompanhamentoAprendizagem/ApanhadoGeral/apanhadoGeral';
import BotaoGerarRelatorioAprendizagem from './DadosAcompanhamentoAprendizagem/BotaoGerarRelatorioAprendizagem/botaoGerarRelatorioAprendizagem';
import BotaoOrdenarListaAlunos from './DadosAcompanhamentoAprendizagem/BotaoOrdenarListaAlunos/botaoOrdenarListaAlunos';
import BotoesAcoesAcompanhamentoAprendizagem from './DadosAcompanhamentoAprendizagem/BotoesAcoes/botoesAcoesAcompanhamentoAprendizagem';
import DadosAcompanhamentoAprendizagem from './DadosAcompanhamentoAprendizagem/dadosAcompanhamentoAprendizagem';
import ObjectCardAcompanhamentoAprendizagem from './DadosAcompanhamentoAprendizagem/ObjectCardAcompanhamentoAprendizagem/objectCardAcompanhamentoAprendizagem';
import TabelaRetratilAcompanhamentoAprendizagem from './DadosAcompanhamentoAprendizagem/TabelaRetratilAcompanhamentoAprendizagem/tabelaRetratilAcompanhamentoAprendizagem';
import LoaderAcompanhamentoAprendizagem from './loaderAcompanhamentoAprendizagem';
import ModalErrosAcompanhamentoAprendizagem from './modalErrosAcompanhamentoAprendizagem';
import Button from '~/componentes/button';
import { Colors, ModalConteudoHtml, Label } from '~/componentes';
import { Row } from 'antd';
import AlertaDentroPeriodo from '~/componentes-sgp/Calendario/componentes/MesCompleto/componentes/Dias/componentes/DiaCompleto/componentes/AlertaPeriodoEncerrado';

const AcompanhamentoAprendizagem = () => {
  const dispatch = useDispatch();

  const usuario = useSelector(store => store.usuario);
  const { turmaSelecionada } = usuario;
  const { turma, anoLetivo } = turmaSelecionada;

  const modalidadesFiltroPrincipal = useSelector(
    store => store.filtro.modalidades
  );

  const componenteCurricularSelecionado = useSelector(
    state => state.registroIndividual.componenteCurricularSelecionado
  );

  const permissoesTela =
  usuario.permissoes[RotasDto.ACOMPANHAMENTO_APRENDIZAGEM];

  const desabilitarCamposAcompanhamentoAprendizagem = useSelector(
    store =>
      store.acompanhamentoAprendizagem
        .desabilitarCamposAcompanhamentoAprendizagem
  );

const desabilitar =
      desabilitarCamposAcompanhamentoAprendizagem ||
        (!permissoesTela.podeIncluir || !permissoesTela.podeAlterar);

  const [listaComponenteCurricular, setListaComponenteCurricular] = useState(
    []
  );
  const [listaSemestres, setListaSemestres] = useState([]);
  const [semestreSelecionado, setSemestreSelecionado] = useState(undefined);
  const [exibirModalValidar, setExibirModalValidar] = useState(false);
  const [validarDados, setValidarDados] = useState(null);
  const [listAlunosValidarDados, setListAlunosValidar] = useState(null);
  const [carregando, setCarregando] = useState(false);

  const resetarInfomacoes = useCallback(() => {
    dispatch(limparDadosAcompanhamentoAprendizagem());
  }, [dispatch]);

  const obterComponentesCurriculares = useCallback(async () => {
    dispatch(setExibirLoaderGeralAcompanhamentoAprendizagem(true));
    const resposta = await ServicoDisciplina.obterDisciplinasPorTurma(turma)
      .catch(e => erros(e))
      .finally(() =>
        dispatch(setExibirLoaderGeralAcompanhamentoAprendizagem(false))
      );

    if (resposta?.data?.length) {
      setListaComponenteCurricular(resposta?.data);

      if (resposta?.data.length === 1) {
        dispatch(
          setComponenteCurricularSelecionado(
            String(resposta?.data[0].codigoComponenteCurricular)
          )
        );
      }
    } else {
      dispatch(setComponenteCurricularSelecionado());
      setListaComponenteCurricular([]);
    }
  }, [dispatch, turma]);

  const obterListaSemestres = useCallback(async () => {
    if (ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada)) {
      const retorno =
        await ServicoAcompanhamentoAprendizagem.obterListaSemestres().catch(e =>
          erros(e)
        );
      if (retorno?.data) {
        setListaSemestres(retorno.data);
      } else {
        setListaSemestres([]);
        setListAlunosValidar(null);
      }
    }
  }, [modalidadesFiltroPrincipal, turmaSelecionada]);

  const onClickValidar = () => {
    setCarregando(true);
    ServicoAcompanhamentoAprendizagem.validarInconsistencias(
      turmaSelecionada?.id,
      semestreSelecionado
    )
      .then(resposta => {
        if (resposta?.data) {
          setExibirModalValidar(true);
          setValidarDados(resposta.data);
          setCarregando(false);
        }
        setCarregando(false);
      })
      .catch(e => erros(e));
  };

  const onCloseModalValidar = () => {
    setExibirModalValidar(false);
    setValidarDados(null);
  };
  const limparListAlunosValidar = (alunoCodigo) => {
    setListAlunosValidar(null);
    var alunosComMarcador = listAlunosValidarDados.filter(x => x.alunoCodigo !== alunoCodigo);
    setListAlunosValidar(alunosComMarcador);
  };
  const onClickValidarDados = () => {
    setListAlunosValidar(
      validarDados?.inconsistenciaPercursoIndividual
        ?.alunosComInconsistenciaPercursoIndividualRAA
    );
    setExibirModalValidar(false);
  };

  useEffect(() => {
    resetarInfomacoes();
    dispatch(setAlunosAcompanhamentoAprendizagem([]));
    dispatch(resetarDadosRegistroIndividual());

    if (
      turmaSelecionada?.turma &&
      ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada)
    ) {
      obterComponentesCurriculares();
      obterListaSemestres();
      ServicoAcompanhamentoAprendizagem.obterQtdMaxImagensCampos(
        turmaSelecionada?.anoLetivo
      );
    } else {
      setSemestreSelecionado(undefined);
      setListaSemestres([]);
      setListAlunosValidar(null);
    }

    return () => {
      dispatch(resetarDadosRegistroIndividual());
      dispatch(setComponenteCurricularSelecionado());
      dispatch(setDadosApanhadoGeral({}));
      dispatch(setApanhadoGeralEmEdicao(false));
      resetarInfomacoes();
    };
  }, [
    dispatch,
    resetarInfomacoes,
    obterListaSemestres,
    turmaSelecionada,
    modalidadesFiltroPrincipal,
    obterComponentesCurriculares,
  ]);

  useEffect(() => {
    const ehInfantil = ehTurmaInfantil(
      modalidadesFiltroPrincipal,
      turmaSelecionada
    );
    verificaSomenteConsulta(permissoesTela, !ehInfantil);
  }, [turmaSelecionada, permissoesTela, modalidadesFiltroPrincipal]);

  const obterFrequenciaAluno = async (codigoAluno, semestre) => {
    dispatch(setExibirLoaderAlunosAcompanhamentoAprendizagem(true));
    const retorno = await ServicoCalendarios.obterFrequenciaAlunoPorSemestre(
      codigoAluno,
      turma,
      semestre
    )
      .catch(e => erros(e))
      .finally(() =>
        dispatch(setExibirLoaderAlunosAcompanhamentoAprendizagem(false))
      );
    return retorno?.data;
  };

  const onChangeAlunoSelecionado = async (aluno, semestreConsulta) => {
    resetarInfomacoes();
    const frequenciaGeralAluno = await obterFrequenciaAluno(
      aluno.codigoEOL,
      semestreConsulta
    );
    const novoAluno = aluno;
    novoAluno.frequencia = frequenciaGeralAluno;
    dispatch(setDadosAlunoObjectCard(aluno));
    dispatch(setDadosAlunoObjectCardRegistroIndividual(aluno));

    dispatch(setCodigoAlunoSelecionado(aluno.codigoEOL));
  };

  const obterListaAlunos = useCallback(
    async semestreConsulta => {
      if (turma) {
        dispatch(setExibirLoaderAlunosAcompanhamentoAprendizagem(true));

        const retorno =
          await ServicoAcompanhamentoAprendizagem.obterListaAlunos(
            turma,
            anoLetivo,
            semestreConsulta
          )
            .catch(e => erros(e))
            .finally(() =>
              dispatch(setExibirLoaderAlunosAcompanhamentoAprendizagem(false))
            );

        if (retorno?.data) {
          dispatch(setAlunosAcompanhamentoAprendizagem(retorno.data));
          const primeiroEstudanteAtivo = retorno.data.find(
            item => item.situacaoCodigo === situacaoMatriculaAluno.Ativo
          );
          if (primeiroEstudanteAtivo) {
            onChangeAlunoSelecionado(primeiroEstudanteAtivo, semestreConsulta);
          }
        } else {
          resetarInfomacoes();
          dispatch(setAlunosAcompanhamentoAprendizagem([]));
        }
      }
    },

    [anoLetivo, dispatch, turma, resetarInfomacoes]
  );

  useEffect(() => {
    if (componenteCurricularSelecionado && semestreSelecionado) {
      obterListaAlunos(semestreSelecionado);
    } else {
      dispatch(setAlunosAcompanhamentoAprendizagem([]));
    }
  }, [
    componenteCurricularSelecionado,
    semestreSelecionado,
    obterListaAlunos,
    dispatch,
  ]);

  const onChangeSemestre = valor => {
    resetarInfomacoes();
    dispatch(setAlunosAcompanhamentoAprendizagem([]));
    dispatch(setCodigoAlunoSelecionado());
    dispatch(setDadosApanhadoGeral({}));
    dispatch(setApanhadoGeralEmEdicao(false));
    setSemestreSelecionado(valor);
  };

  const permiteOnChangeAluno = async () => {
    const continuar =
      await ServicoAcompanhamentoAprendizagem.salvarDadosAcompanhamentoAprendizagem(
        semestreSelecionado
      );

    return continuar;
  };

  return (
    <>
      <Loader loading={carregando} tip="">
        <Container>
          {exibirModalValidar ? (
            <ModalConteudoHtml
              titulo={validarDados?.mensagemInconsistenciaPercursoColetivo}
              visivel={exibirModalValidar}
              onConfirmacaoSecundaria={() => onCloseModalValidar()}
              onConfirmacaoPrincipal={() => onClickValidarDados()}
              labelBotaoPrincipal="Atualizar"
              labelBotaoSecundario="Cancelar"
              fontSizeTitulo="18"
              tipoFonte="bold"
            >
              <Label
                text={
                  validarDados?.inconsistenciaPercursoIndividual
                    ?.mensagemInsconsistencia
                }
              />
              {validarDados?.inconsistenciaPercursoIndividual
                ?.alunosComInconsistenciaPercursoIndividualRAA?.length ? (
                <table className="table">
                  <tbody className="tabela-um-tbody">
                    {validarDados?.inconsistenciaPercursoIndividual?.alunosComInconsistenciaPercursoIndividualRAA.map(
                      (dado, index) => {
                        return (
                          <tr key={index}>
                            <td className="col-valor-linha-um">
                              {dado.numeroChamada}
                            </td>
                            <td className="col-valor-linha-um">
                              {dado.alunoNome} ({dado.alunoCodigo})
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              ) : (
                <></>
              )}
            </ModalConteudoHtml>
          ) : (
            <></>
          )}
          {!turmaSelecionada.turma ? (
            <Alert
              alerta={{
                tipo: 'warning',
                id: 'alerta-sem-turma',
                mensagem: 'Você precisa escolher uma turma.',
              }}
            />
          ) : (
            <></>
          )}
          {turmaSelecionada.turma ? <AlertaPermiteSomenteTurmaInfantil /> : ''}
          <ModalErrosAcompanhamentoAprendizagem />
          <LoaderAcompanhamentoAprendizagem>
          {semestreSelecionado ? <AlertaDentroPeriodo
            exibir={desabilitar}
          /> : ''}
            <Cabecalho pagina="Relatório do Acompanhamento da Aprendizagem">
              <BotoesAcoesAcompanhamentoAprendizagem
                semestreSelecionado={semestreSelecionado}
                componenteCurricularId={componenteCurricularSelecionado}
                limparAlunoIconeAlunoSelecionado ={(valor) => limparListAlunosValidar(valor)}
              />
            </Cabecalho>
            <Card>
              {turmaSelecionada?.turma &&
              ehTurmaInfantil(modalidadesFiltroPrincipal, turmaSelecionada) ? (
                <>
                  <div className="col-md-12 mb-2">
                    <div className="row">
                      <div className="col-sm-12 col-md-6 col-lg-6 col-xl-4 mb-2">
                        <SelectComponent
                          id="componenteCurricular"
                          name="ComponenteCurricularId"
                          lista={listaComponenteCurricular || []}
                          valueOption="codigoComponenteCurricular"
                          valueText="nomeComponenteInfantil"
                          valueSelect={componenteCurricularSelecionado}
                          placeholder="Selecione um componente curricular"
                          disabled={listaComponenteCurricular?.length === 1}
                          onChange={valorNovo => {
                            dispatch(
                              setComponenteCurricularSelecionado(valorNovo)
                            );
                          }}
                        />
                      </div>
                      <div className="col-sm-12 col-md-6 col-lg-6 col-xl-4 mb-2">
                        <SelectComponent
                          id="semestre"
                          lista={listaSemestres}
                          valueOption="semestre"
                          valueText="descricao"
                          valueSelect={semestreSelecionado}
                          onChange={onChangeSemestre}
                          placeholder="Selecione o semestre"
                          disabled={!componenteCurricularSelecionado}
                        />
                      </div>
                    </div>
                  </div>
                  {componenteCurricularSelecionado && semestreSelecionado ? (
                    <>
                      <div className="col-md-12 mb-2 d-flex justify-content-between">
                        <div className="d-flex">
                          <BotaoOrdenarListaAlunos />
                          <BotaoGerarRelatorioAprendizagem
                            semestre={semestreSelecionado}
                          />
                        </div>
                        <Button
                          label="Conferir"
                          color={Colors.Roxo}
                          onClick={onClickValidar}
                        />
                      </div>
                      <div className="col-md-12 mb-2 mt-2">
                        <ApanhadoGeral
                          semestreSelecionado={semestreSelecionado}
                        />
                      </div>
                      <div className="col-md-12 mb-2">
                        <TabelaRetratilAcompanhamentoAprendizagem
                          onChangeAlunoSelecionado={value => {
                            onChangeAlunoSelecionado(
                              value,
                              semestreSelecionado
                            );
                          }}
                          permiteOnChangeAluno={permiteOnChangeAluno}
                          alunosValidar={listAlunosValidarDados}
                        >
                          <ObjectCardAcompanhamentoAprendizagem
                            semestre={semestreSelecionado}
                          />
                          <DadosAcompanhamentoAprendizagem
                            codigoTurma={turmaSelecionada.turma}
                            modalidade={turmaSelecionada.modalidade}
                            semestreSelecionado={semestreSelecionado}
                            componenteCurricularId={
                              componenteCurricularSelecionado
                            }
                          />
                        </TabelaRetratilAcompanhamentoAprendizagem>
                      </div>
                    </>
                  ) : (
                    ''
                  )}
                </>
              ) : (
                ''
              )}
            </Card>
          </LoaderAcompanhamentoAprendizagem>
        </Container>
      </Loader>
    </>
  );
};

export default AcompanhamentoAprendizagem;