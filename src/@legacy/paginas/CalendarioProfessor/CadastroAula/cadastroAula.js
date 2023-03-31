/* eslint-disable react/prop-types */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Form, Formik } from 'formik';
import queryString from 'query-string';
import * as Yup from 'yup';
import { Col, Row } from 'antd';
import Alert from '~/componentes/alert';
import { Cabecalho } from '~/componentes-sgp';
import { verificaSomenteConsulta } from '~/servicos/servico-navegacao';

import {
  Card,
  SelectComponent,
  Loader,
  CampoData,
  RadioGroupButton,
  Button,
  Colors,
  Auditoria,
} from '~/componentes';
import servicoCadastroAula from '~/servicos/Paginas/CalendarioProfessor/CadastroAula/ServicoCadastroAula';
import { erros, sucesso, confirmar } from '~/servicos/alertas';
import servicoDisciplina from '~/servicos/Paginas/ServicoDisciplina';
import CampoNumeroFormik from '~/componentes/campoNumeroFormik/campoNumeroFormik';
import { aulaDto } from '~/dtos/aulaDto';

import ExcluirAula from './excluirAula';
import { setBreadcrumbManual } from '~/servicos/breadcrumb-services';
import RotasDto from '~/dtos/rotasDto';
import { RegistroMigrado } from '~/componentes-sgp/registro-migrado';
import { ehTurmaInfantil } from '~/servicos/Validacoes/validacoesInfatil';
import AlterarAula from './alterarAula';
import {
  SGP_BUTTON_ALTERAR_CADASTRAR,
  SGP_BUTTON_CANCELAR,
} from '~/constantes/ids/button';
import { SGP_INPUT_NUMBER_QUANTIDADE_AULAS } from '~/constantes/ids/input';
import { SGP_SELECT_COMPONENTE_CURRICULAR } from '~/constantes/ids/select';
import {
  SGP_RADIO_RECORRENCIA,
  SGP_RADIO_TIPO_AULA,
} from '~/constantes/ids/radio';
import { SGP_DATA_AULA } from '~/constantes/ids/date';
import { ContainerColumnReverseRowAntd } from '~/paginas/Planejamento/Anual/planoAnual.css';
import BotaoVoltarPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoVoltarPadrao';
import BotaoExcluirPadrao from '~/componentes-sgp/BotoesAcaoPadrao/botaoExcluirPadrao';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

function CadastroDeAula() {
  const navigate = useNavigate();
  const location = useLocation();
  const routeParams = useParams();

  const id = routeParams?.id;
  const tipoCalendarioId = routeParams?.tipoCalendarioId;
  const somenteReposicao = routeParams?.somenteReposicao;

  const ehReposicao = somenteReposicao === 'true';
  const permissoesTela = useSelector(state => state.usuario.permissoes);
  const somenteConsulta = verificaSomenteConsulta(
    permissoesTela[RotasDto.CALENDARIO_PROFESSOR]
  );
  const refForm = useRef();
  const modalidadesFiltroPrincipal = useSelector(
    store => store.filtro.modalidades
  );

  const [validacoes, setValidacoes] = useState({
    disciplinaId: Yup.string().required('Informe o componente curricular'),
    dataAula: Yup.string()
      .required('Informe a data da aula')
      .typeError('Informe a data da aula'),
    quantidade: Yup.number()
      .integer('O valor informado deve ser um número inteiro')
      .typeError('O valor informado deve ser um número')
      .nullable()
      .required('Informe a quantidade de aulas'),
    recorrenciaAula: Yup.string().required('Informe o tipo de recorrência'),
    tipoAula: Yup.string().required('Informe o tipo de aula'),
  });

  const turmaSelecionada = useSelector(store => store.usuario.turmaSelecionada);
  const [somenteLeitura, setSomenteLeitura] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [exibirModalExclusao, setExibirModalExclusao] = useState(false);
  const [exibirModalAlteracao, setExibirModalAlteracao] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(false);
  const [controlaGrade, setControlaGrade] = useState(true);
  const [gradeAtingida, setGradeAtingida] = useState(false);
  const [registroMigrado, setRegistroMigrado] = useState(false);
  const [emManutencao, setEmManutencao] = useState(false);
  const [desabilitarBtnSalvar, setDesabilitarBtnSalvar] = useState(false);
  const [turmaFiltro] = useState(turmaSelecionada.turma);

  const { diaAula } = queryString.parse(location.search);
  const aulaInicial = {
    ...aulaDto,
    dataAula: window.moment(diaAula),
    turmaId: turmaSelecionada.turma,
    ueId: turmaSelecionada.unidadeEscolar,
    tipoCalendarioId,
    quantidade: 1,
    tipoAula: ehReposicao ? 2 : 1,
    recorrenciaAula: 1,
    podeEditar: true,
  };

  const [recorrenciaAulaEmEdicao, setRecorrenciaAulaEmEdicao] = useState({
    aulaId: id,
    existeFrequenciaOuPlanoAula: false,
    quantidadeAulasRecorrentes: 0,
    recorrenciaAula: 1,
  });

  const [aula, setAula] = useState(aulaInicial);

  const [quantidadeBloqueada, setQuantidadeBloqueada] = useState(false);
  const [listaComponentes, setListaComponentes] = useState([]);
  const [recorrenciaAulaOriginal, setRecorrenciaAulaOriginal] = useState();

  const opcoesTipoAulaSomenteReposicao = [{ label: 'Reposição', value: 2 }];

  const opcoesTipoAula = [
    { label: 'Normal', value: 1 },
    { label: 'Reposição', value: 2 },
  ];

  const recorrencia = {
    AULA_UNICA: 1,
    REPETIR_BIMESTRE_ATUAL: 2,
    REPETIR_TODOS_BIMESTRES: 3,
  };

  const opcoesRecorrenciaSomenteReposicao = [
    { label: 'Aula única', value: recorrencia.AULA_UNICA },
  ];

  const opcoesRecorrencia = [
    { label: 'Aula única', value: recorrencia.AULA_UNICA },
    {
      label: 'Repetir no Bimestre atual',
      value: recorrencia.REPETIR_BIMESTRE_ATUAL,
      disabled:
        id && (recorrenciaAulaOriginal === 3 || recorrenciaAulaOriginal === 1),
    },
    {
      label: 'Repetir em todos os Bimestres',
      value: recorrencia.REPETIR_TODOS_BIMESTRES,
      disabled:
        id && (recorrenciaAulaOriginal === 2 || recorrenciaAulaOriginal === 1),
    },
  ];
  const obterComponenteSelecionadoPorId = useCallback(
    componenteCurricularId => {
      return listaComponentes.find(
        c => c.codigoComponenteCurricular === Number(componenteCurricularId) ||
             c.id === Number(componenteCurricularId)
             || (c.regencia && (c.codDisciplinaPai === Number(componenteCurricularId)))
             || (c.territorioSaber && (c.codigoTerritorioSaber === Number(componenteCurricularId)))
      );
    },
    [listaComponentes]
  );

  const navegarParaCalendarioProfessor = () => {
    navigate('/calendario-escolar/calendario-professor');
  };

  const removeGrade = () => {
    refForm.current.handleReset();
    setControlaGrade(false);
    setQuantidadeBloqueada(false);
    setValidacoes(validacoesState => {
      return {
        ...validacoesState,
        quantidade: Yup.number()
          .integer('O valor informado deve ser um número inteiro')
          .typeError('O valor informado deve ser um número')
          .nullable()
          .required('Informe a quantidade de aulas'),
      };
    });
  };

  const defineGradeRegistroNovoComValidacoes = quantidadeAulasRestante => {
    setValidacoes(validacoesState => {
      return {
        ...validacoesState,
        quantidade: Yup.number()
          .integer('O valor informado deve ser um número inteiro')
          .typeError('O valor informado deve ser um número')
          .nullable()
          .required('Informe a quantidade de aulas')
          .max(
            quantidadeAulasRestante,
            `A quantidade máxima de aulas permitidas é ${quantidadeAulasRestante}.`
          ),
      };
    });

    if (Number(quantidadeAulasRestante) === 0) {
      setQuantidadeBloqueada(true);
      setGradeAtingida(true);
      setControlaGrade(true);
    }
  };

  const defineGradeEdicaoComValidacoes = quantidadeAulasRestante => {
    setValidacoes(validacoesState => {
      return {
        ...validacoesState,
        quantidade: Yup.number()
          .integer('O valor informado deve ser um número inteiro')
          .typeError('O valor informado deve ser um número')
          .nullable()
          .required('Informe a quantidade de aulas')
          .max(
            quantidadeAulasRestante,
            `A quantidade máxima de aulas permitidas é ${quantidadeAulasRestante}.`
          ),
      };
    });
  };

  const defineGrade = useCallback(
    (dadosGrade, tipoAula, aplicarGrade) => {
      refForm.current.handleReset();
      const { quantidadeAulasRestante, podeEditar } = dadosGrade;
      setGradeAtingida(Number(quantidadeAulasRestante) === 0);
      if (Number(tipoAula) === 1) {
        if (aplicarGrade) {
          setQuantidadeBloqueada(!podeEditar);
          if (!id) {
            if (quantidadeAulasRestante === 1 || !podeEditar) {
              // defineGrade limite 1 aula
              setQuantidadeBloqueada(true);
              setAula(aulaState => {
                return {
                  ...aulaState,
                  quantidade: quantidadeAulasRestante,
                };
              });
            }
            // define grade registro novo com validações
            defineGradeRegistroNovoComValidacoes(quantidadeAulasRestante);
          } else {
            // define grade para edição
            defineGradeEdicaoComValidacoes(quantidadeAulasRestante);
          }
        } else {
          removeGrade();
        }
      } else removeGrade();
    },
    [id]
  );

  const carregarGrade = useCallback(
    (componenteSelecionado, dataAula, tipoAula, aplicarGrade) => {
      if (componenteSelecionado && dataAula) {
        setCarregandoDados(true);
        servicoCadastroAula
          .obterGradePorComponenteETurma(
            turmaSelecionada.turma,
            componenteSelecionado.territorioSaber
              ? componenteSelecionado.id
              : componenteSelecionado.codigoComponenteCurricular,
            dataAula,
            id || 0,
            componenteSelecionado.regencia,
            tipoAula
          )
          .then(respostaGrade => {
            setDesabilitarBtnSalvar(false);
            if (respostaGrade.status === 200) {
              const { grade } = respostaGrade.data;
              if (grade) {
                defineGrade(grade, tipoAula, aplicarGrade);
              } else {
                removeGrade();
              }
            } else {
              removeGrade();
            }
          })
          .catch(e => {
            setDesabilitarBtnSalvar(true);
            if (
              e &&
              e.response &&
              e.response.data &&
              e.response.data.mensagens
            ) {
              erros(e);
            }
          })
          .finally(() => setCarregandoDados(false));
      }
    },
    [turmaSelecionada.turma, defineGrade, id]
  );

  const obterAula = useCallback(async () => {
    const carregarComponentesCurriculares = async idTurma => {
      setCarregandoDados(true);
      const respostaComponentes = await servicoDisciplina
        .obterDisciplinasPorTurma(idTurma)
        .catch(e => erros(e))
        .finally(() => setCarregandoDados(false));

      if (respostaComponentes?.status === 200) {
        setListaComponentes(respostaComponentes.data);
        return respostaComponentes.data;
      }
      return [];
    };
    const componentes = await carregarComponentesCurriculares(
      turmaSelecionada.turma
    );
    if (id) {
      setCarregandoDados(true);
      servicoCadastroAula
        .obterPorId(id)
        .then(resposta => {
          const respostaAula = resposta.data;
          respostaAula.dataAula = window.moment(respostaAula.dataAula);
          setRecorrenciaAulaOriginal(respostaAula.recorrenciaAula);
          setAula(respostaAula);
          setRegistroMigrado(respostaAula.migrado);
          setEmManutencao(respostaAula.emManutencao);
          servicoCadastroAula
            .obterRecorrenciaPorIdAula(id, respostaAula.recorrenciaAula)
            .then(resp => {
              setRecorrenciaAulaEmEdicao(resp.data);
            })
            .catch(e => erros(e));
            if (componentes) {
              const componenteSelecionado = componentes.find(
                c =>
                  String(c.codigoComponenteCurricular) ===
                  String(respostaAula.disciplinaId) ||
                  String(c.id) ===
                  String(respostaAula.disciplinaId) ||
                  (c.regencia && String(c.codDisciplinaPai) === respostaAula.disciplinaId) ||
                  (c.territorioSaber && String(c.codigoTerritorioSaber) === respostaAula.disciplinaId)
              );

              if (componenteSelecionado.codigoComponenteCurricular == respostaAula.disciplinaId||
                  componenteSelecionado.codigoTerritorioSaber == respostaAula.disciplinaId && componenteSelecionado.territorioSaber){
                respostaAula.disciplinaId = String(componenteSelecionado.id);
                setAula(respostaAula);
              }

            if (componenteSelecionado) {
              carregarGrade(
                componenteSelecionado,
                respostaAula.dataAula,
                respostaAula.tipoAula,
                respostaAula.tipoAula === 1
              );
            } else {
              setAula({
                ...respostaAula,
                disciplinaId: null,
              });
              setSomenteLeitura(false);
              setCarregandoDados(false);
            }
          }
        })
        .catch(e => {
          erros(e);
          navegarParaCalendarioProfessor();
          setCarregandoDados(false);
        });
    } else if (componentes?.length === 1) {
      setAula({
        ...aulaInicial,
        disciplinaId: String(componentes[0].id),
      });

      carregarGrade(
        componentes[0],
        aulaInicial.dataAula,
        aulaInicial.tipoAula,
        Number(aulaInicial.tipoAula) === 1
      );
    }
  }, [id, turmaSelecionada.turma]);

  const salvar = async valoresForm => {
    const componente = obterComponenteSelecionadoPorId(
      valoresForm.disciplinaId
    );
    if (Number(valoresForm.quantidade) === 0) valoresForm.quantidade = 1;
    if (componente) valoresForm.disciplinaNome = componente.nome;
    setCarregandoDados(true);
    servicoCadastroAula
      .salvar(id, valoresForm, componente.regencia || false)
      .then(resposta => {
        resposta.data.mensagens.forEach(mensagem => sucesso(mensagem));
        navegarParaCalendarioProfessor();
      })
      .catch(e => erros(e))
      .finally(() => setCarregandoDados(false));
  };

  const obterDataFormatada = () => {
    if (aula.dataAula) {
      const data = window.moment.isMoment(aula.dataAula)
        ? aula.dataAula
        : window.moment(aula.dataAula);
      return `${data.format('dddd')}, ${data.format('DD/MM/YYYY')}`;
    }
    return '';
  };

  const onChangeComponente = componenteCurricularId => {
    setModoEdicao(true);
    const componenteSelecionado = obterComponenteSelecionadoPorId(
      componenteCurricularId
    );
    setAula(aulaState => {
      return {
        ...aulaState,
        disciplinaId: componenteSelecionado
          ? String(componenteSelecionado.id)
          : null,
        disciplinaCompartilhadaId: componenteSelecionado?.compartilhada
          ? componenteSelecionado.componenteCurricularId
          : 0,
      };
    });
    carregarGrade(
      componenteSelecionado,
      aula.dataAula,
      aula.tipoAula,
      Number(aula.tipoAula) === 1
    );
  };

  const onClickCancelar = async () => {
    if (modoEdicao) {
      const confirmou = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas.',
        'Deseja realmente cancelar as alterações?'
      );

      if (confirmou) {
        setModoEdicao(false);
        obterAula();
      }
    }
  };

  const onChangeDataAula = data => {
    setModoEdicao(true);
    setAula(aulaState => {
      return { ...aulaState, dataAula: data };
    });
    const componenteSelecionado = obterComponenteSelecionadoPorId(
      aula.disciplinaId
    );
    carregarGrade(componenteSelecionado, data, aula.tipoAula, controlaGrade);
  };

  const onChangeTipoAula = e => {
    setModoEdicao(true);
    const ehAulaNormal = e === 1;
    setControlaGrade(ehAulaNormal);

    let tipoRecorrencia = aula.recorrenciaAula;
    const componente = obterComponenteSelecionadoPorId(aula.disciplinaId);

    if (!ehAulaNormal) {
      tipoRecorrencia = recorrencia.AULA_UNICA;
      setQuantidadeBloqueada(false);
    }
    carregarGrade(componente, aula.dataAula, e, ehAulaNormal);
    setAula(aulaState => {
      return {
        ...aulaState,
        tipoAula: e,
        recorrenciaAula: tipoRecorrencia,
      };
    });
  };

  const onChangeQuantidadeAula = quantidade => {
    setModoEdicao(true);
    setAula(aulaState => {
      return {
        ...aulaState,
        quantidade,
      };
    });
  };

  const onChangeRecorrencia = e => {
    setModoEdicao(true);
    setAula(aulaState => {
      return {
        ...aulaState,
        recorrenciaAula: e,
      };
    });
    if (id) {
      servicoCadastroAula
        .obterRecorrenciaPorIdAula(id, e)
        .then(resposta => {
          setRecorrenciaAulaEmEdicao(resposta.data);
        })
        .catch(er => erros(er));
    }
  };

  const salvarAntesMudarTurma = async () => {
    if (modoEdicao) {
      const confirmou = await confirmar(
        'Atenção',
        '',
        'Suas alterações não foram salvas, deseja salvar agora?'
      );

      if (confirmou) {
        if (refForm.current) {
          salvar(refForm.current?.state?.values);
        }
      }

      navegarParaCalendarioProfessor();
      setModoEdicao(false);
    } else navegarParaCalendarioProfessor();
  };

  const onClickVoltar = async () => {
    if (modoEdicao) {
      const confirmou = await confirmar(
        'Atenção',
        'Você não salvou as informações preenchidas, saindo desta página elas serão perdidas.',
        'Deseja realmente cancelar as alterações?'
      );

      if (confirmou) {
        navegarParaCalendarioProfessor();
        setModoEdicao(false);
      }
    } else navegarParaCalendarioProfessor();
  };

  const onClickExcluir = async () => {
    if (Number(recorrenciaAulaEmEdicao.recorrenciaAula) === 1) {
      let mensagem = 'Você tem certeza que deseja excluir esta aula?';
      if (recorrenciaAulaEmEdicao.existeFrequenciaOuPlanoAula) {
        const infantil = ehTurmaInfantil(
          modalidadesFiltroPrincipal,
          turmaSelecionada
        );
        mensagem += ` Obs: Esta aula ou sua recorrência possui frequência ou ${
          infantil ? 'diário de bordo' : 'plano de aula'
        } registrado, ao excluí - la estará excluindo esse registro também`;
      }
      const confirmado = await confirmar(
        `Excluir aula - ${obterDataFormatada()} `,
        mensagem,
        'Deseja Continuar?',
        'Excluir',
        'Cancelar'
      );
      if (confirmado) {
        const componenteSelecionado = obterComponenteSelecionadoPorId(
          aula.disciplinaId
        );
        if (componenteSelecionado) {
          setCarregandoDados(true);
          servicoCadastroAula
            .excluirAula(id, aula.recorrenciaAula, componenteSelecionado.nome)
            .then(resposta => {
              sucesso(resposta.data.mensagens[0]);
              navegarParaCalendarioProfessor();
            })
            .catch(e => erros(e))
            .finally(() => setCarregandoDados(false));
        }
      }
    } else {
      setExibirModalExclusao(true);
    }
  };

  useEffect(() => {
    setBreadcrumbManual(
      location?.pathname,
      'Cadastro de Aula',
      '/calendario-escolar/calendario-professor'
    );

    if (turmaFiltro === turmaSelecionada.turma) {
      obterAula();
    }
  }, [obterAula, location]);

  useEffect(() => {
    if (!carregandoDados && aula.somenteLeitura) {
      setSomenteLeitura(true);
    }
  }, [carregandoDados, aula.somenteLeitura]);

  useEffect(() => {
    if (turmaFiltro !== turmaSelecionada.turma) salvarAntesMudarTurma();
  }, [turmaSelecionada]);

  return (
    <>
      <Loader loading={carregandoDados}>
        <ExcluirAula
          idAula={id}
          visivel={exibirModalExclusao}
          dataAula={obterDataFormatada()}
          nomeComponente={() => {
            const componente = obterComponenteSelecionadoPorId(
              aula.disciplinaId
            );
            return componente?.nome;
          }}
          recorrencia={recorrenciaAulaEmEdicao}
          onFecharModal={() => {
            setExibirModalExclusao(false);
            navegarParaCalendarioProfessor();
          }}
          onCancelar={() => setExibirModalExclusao(false)}
          modalidadesFiltroPrincipal={modalidadesFiltroPrincipal}
          turmaSelecionada={turmaSelecionada}
        />
        <AlterarAula
          visivel={exibirModalAlteracao}
          dataAula={obterDataFormatada()}
          nomeComponente={() => {
            const componente = obterComponenteSelecionadoPorId(
              aula.disciplinaId
            );
            return componente?.nome;
          }}
          recorrencia={recorrenciaAulaEmEdicao}
          recorrenciaSelecionada={aula.recorrenciaAula}
          onFecharModal={acaoSubmit => {
            setExibirModalAlteracao(false);
            if (acaoSubmit) {
              refForm.current.handleSubmit();
            }
          }}
          onCancelar={() => setExibirModalAlteracao(false)}
        />

        {controlaGrade && gradeAtingida && !id && (
          <Alert
            alerta={{
              tipo: 'warning',
              id: 'cadastro-aula-quantidade-maxima',
              mensagem:
                'Não é possível criar aula normal porque o limite da grade curricular foi atingido',
            }}
          />
        )}
        {somenteLeitura && (
          <Alert
            alerta={{
              tipo: 'warning',
              id: 'somente-leitura',
              mensagem: 'Você possui permissão somente de leitura nesta aula',
            }}
          />
        )}
        {emManutencao && (
          <Alert
            alerta={{
              tipo: 'warning',
              id: 'em-manutencao',
              mensagem: 'Registro em manutenção',
            }}
          />
        )}
        <Formik
          enableReinitialize
          initialValues={aula}
          validationSchema={Yup.object(validacoes)}
          onSubmit={salvar}
          validateOnChange
          validateOnBlur
          ref={refForm}
        >
          {form => (
            <>
              <Cabecalho pagina={`Cadastro de Aula - ${obterDataFormatada()} `}>
                <Row gutter={[8, 8]} type="flex">
                  <Col>
                    <BotaoVoltarPadrao onClick={onClickVoltar} />
                  </Col>
                  <Col>
                    <Button
                      id={SGP_BUTTON_CANCELAR}
                      label="Cancelar"
                      color={Colors.Roxo}
                      border
                      onClick={onClickCancelar}
                      disabled={somenteConsulta || !modoEdicao}
                    />
                  </Col>
                  <Col>
                    <BotaoExcluirPadrao
                      onClick={onClickExcluir}
                      disabled={
                        somenteConsulta ||
                        !id ||
                        somenteLeitura ||
                        !aula.podeEditar
                      }
                    />
                  </Col>
                  <Col>
                    <Button
                      id={SGP_BUTTON_ALTERAR_CADASTRAR}
                      label={id ? 'Alterar' : 'Cadastrar'}
                      color={Colors.Roxo}
                      border
                      bold
                      onClick={() => {
                        if (
                          !id ||
                          (Number(aula.recorrenciaAula) ===
                            recorrencia.AULA_UNICA &&
                            !recorrenciaAulaEmEdicao.existeFrequenciaOuPlanoAula)
                        ) {
                          form.handleSubmit();
                        } else {
                          setExibirModalAlteracao(true);
                        }
                      }}
                      disabled={
                        somenteConsulta ||
                        (controlaGrade && gradeAtingida && !id) ||
                        !aula.disciplinaId ||
                        somenteLeitura ||
                        desabilitarBtnSalvar ||
                        (id && !modoEdicao) ||
                        !aula.podeEditar
                      }
                    />
                  </Col>
                </Row>
              </Cabecalho>

              <Card padding="24px 24px">
                <Form>
                  <ContainerColumnReverseRowAntd
                    gutter={[16, 16]}
                    style={{ paddingBottom: '8px' }}
                  >
                    <Col md={6}>
                      <CampoData
                        placeholder="Data da aula"
                        label="Data da aula"
                        formatoData="DD/MM/YYYY"
                        name="dataAula"
                        id={SGP_DATA_AULA}
                        form={form}
                        onChange={onChangeDataAula}
                        labelRequired
                      />
                    </Col>
                    <Col
                      span={18}
                      style={{ display: 'flex', justifyContent: 'end' }}
                    >
                      {registroMigrado && (
                        <RegistroMigrado>Registro Migrado</RegistroMigrado>
                      )}
                    </Col>
                  </ContainerColumnReverseRowAntd>

                  <Row gutter={[16, 16]}>
                    <Col md={24} lg={6}>
                      <RadioGroupButton
                        id={SGP_RADIO_TIPO_AULA}
                        label="Tipo de aula"
                        opcoes={
                          ehReposicao
                            ? opcoesTipoAulaSomenteReposicao
                            : opcoesTipoAula
                        }
                        name="tipoAula"
                        form={form}
                        onChange={onChangeTipoAula}
                        desabilitado={!!id}
                        labelRequired
                      />
                    </Col>

                    <Col md={24} lg={18}>
                      <SelectComponent
                        id={SGP_SELECT_COMPONENTE_CURRICULAR}
                        name="disciplinaId"
                        lista={listaComponentes}
                        label="Componente Curricular"
                        valueOption={
                          listaComponentes[0]?.regencia &&
                          listaComponentes[0]?.codDisciplinaPai !== 0
                            ? 'codDisciplinaPai'
                            :  'id'
                        }
                        valueText="nome"
                        placeholder="Selecione um componente curricular"
                        form={form}
                        disabled={
                          !!(!!id && aula?.disciplinaId) ||
                          (listaComponentes.length === 1 && !id)
                        }
                        onChange={onChangeComponente}
                        labelRequired
                      />
                    </Col>

                    <Col sm={24} md={6}>
                      <CampoNumeroFormik
                        height="auto"
                        label="Quantidade de aulas"
                        id={SGP_INPUT_NUMBER_QUANTIDADE_AULAS}
                        name="quantidade"
                        form={form}
                        min={1}
                        onChange={onChangeQuantidadeAula}
                        disabled={quantidadeBloqueada}
                        labelRequired
                      />
                    </Col>

                    <Col sm={24} md={18}>
                      <RadioGroupButton
                        id={SGP_RADIO_RECORRENCIA}
                        label="Recorrência"
                        opcoes={
                          ehReposicao
                            ? opcoesRecorrenciaSomenteReposicao
                            : opcoesRecorrencia
                        }
                        name="recorrenciaAula"
                        form={form}
                        onChange={onChangeRecorrencia}
                        desabilitado={aula.tipoAula === 2}
                        labelRequired
                      />
                    </Col>
                  </Row>
                </Form>

                <Auditoria
                  novaEstrutura
                  alteradoEm={aula.alteradoEm}
                  alteradoPor={aula.alteradoPor}
                  alteradoRf={aula.alteradoRF}
                  criadoEm={aula.criadoEm}
                  criadoPor={aula.criadoPor}
                  criadoRf={aula.criadoRF}
                />
              </Card>
            </>
          )}
        </Formik>
      </Loader>
    </>
  );
}

export default CadastroDeAula;
